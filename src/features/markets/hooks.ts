import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketsApi, marketKeys } from './api';
import { useSubscriptions } from './subscriptions';
import { GetMarketsParams, MarketSummary, MarketDetail, OddsUpdate, LiquidityData } from './types';
import { toast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

// Markets list with infinite scroll
export function useMarkets(params: GetMarketsParams = {}) {
  return useInfiniteQuery({
    queryKey: marketKeys.list(params),
    queryFn: ({ pageParam = 1 }) => marketsApi.getMarkets({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 15 * 1000, // 15s
    gcTime: 5 * 60 * 1000, // 5min garbage collection
    refetchInterval: (query) => {
      const data = query.state.data;
      // Adaptive polling based on data freshness
      const hasLiveMarkets = data?.pages.some(page => 
        page.items.some(market => market.status === 'live')
      );
      return hasLiveMarkets ? 5 * 1000 : 15 * 1000; // 5s for live, 15s for idle
    },
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors
      if (failureCount < 3 && error instanceof Error) {
        console.log(`🔄 Retrying markets fetch (attempt ${failureCount + 1}/3)`);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

// Single market detail
export function useMarket(id: string) {
  const { subscribe, unsubscribe } = useSubscriptions();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: marketKeys.detail(id),
    queryFn: () => marketsApi.getMarketById(id),
    enabled: !!id,
    staleTime: 10 * 1000, // 10s
    refetchInterval: () => {
      const current = queryClient.getQueryData<MarketDetail | null>(marketKeys.detail(id));
      if (!current) return false as const;
      const isLive = current.status === 'live';
      const startsWithinHour = new Date(current.startsAt).getTime() - Date.now() < 60 * 60 * 1000;
      return isLive || startsWithinHour ? 5 * 1000 : 15 * 1000;
    },
  });

  // Subscribe to real-time updates for this market
  useEffect(() => {
    if (id && query.data) {
      const unsubscribeMarket = subscribe(`market.${id}`, (data: MarketDetail) => {
        queryClient.setQueryData(marketKeys.detail(id), data);
      });

      const unsubscribeOdds = subscribe(`odds.${id}`, (data: OddsUpdate[]) => {
        // Update odds in market data
        queryClient.setQueryData(marketKeys.detail(id), (prev: MarketDetail | undefined) => {
          if (!prev) return prev;
          const updatedOutcomes = prev.outcomes?.map(outcome => {
            const update = data.find(u => u.outcomeId === outcome.id);
            return update ? { ...outcome, odds: update.odds } : outcome;
          });
          return { ...prev, outcomes: updatedOutcomes };
        });
        
        // Invalidate odds query for flash animation
        queryClient.invalidateQueries({ queryKey: marketKeys.odds(id) });
      });

      return () => {
        unsubscribeMarket();
        unsubscribeOdds();
      };
    }
  }, [id, query.data, subscribe, queryClient]);

  return query;
}

// Live odds for a market
export function useOdds(marketId: string) {
  const { subscribe } = useSubscriptions();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: marketKeys.odds(marketId),
    queryFn: () => marketsApi.getOdds(marketId),
    enabled: !!marketId,
    staleTime: 3 * 1000, // 3s
    refetchInterval: 5 * 1000, // 5s polling fallback
  });

  // Subscribe to real-time odds updates
  useEffect(() => {
    if (marketId) {
      const unsubscribe = subscribe(`odds.${marketId}`, (data: OddsUpdate[]) => {
        queryClient.setQueryData(marketKeys.odds(marketId), data);
      });
      return unsubscribe;
    }
  }, [marketId, subscribe, queryClient]);

  return query;
}

// Market liquidity
export function useLiquidity(marketId: string) {
  const { subscribe } = useSubscriptions();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: marketKeys.liquidity(marketId),
    queryFn: () => marketsApi.getLiquidity(marketId),
    enabled: !!marketId,
    staleTime: 5 * 1000, // 5s
    refetchInterval: 10 * 1000, // 10s polling fallback
  });

  // Subscribe to real-time liquidity updates
  useEffect(() => {
    if (marketId) {
      const unsubscribe = subscribe(`liquidity.${marketId}`, (data: LiquidityData) => {
        queryClient.setQueryData(marketKeys.liquidity(marketId), data);
      });
      return unsubscribe;
    }
  }, [marketId, subscribe, queryClient]);

  return query;
}

// Mutation for placing bets
export function usePlaceBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: marketsApi.placeBet,
    onSuccess: (receipt, variables) => {
      toast({
        title: "Bet Placed Successfully",
        description: `Your bet has been submitted. Receipt ID: ${receipt.receiptId}`,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: marketKeys.odds(variables.marketId) });
      queryClient.invalidateQueries({ queryKey: marketKeys.liquidity(variables.marketId) });
      queryClient.invalidateQueries({ queryKey: ['user', 'bets'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Bet Failed",
        description: error.message || "That didn't go through. Please retry or check your connection.",
        variant: "destructive",
      });
    },
  });
}

// Helper hook for handling API errors
export function useApiError() {
  return {
    handleError: (error: Error, context?: string) => {
      console.error(`API Error ${context ? `in ${context}` : ''}:`, error);
      
      const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
      const isRetryable = isNetworkError || error.message.includes('timeout');
      
      toast({
        title: isRetryable ? "Connection Issue" : "Error",
        description: isRetryable 
          ? "Please check your connection and try again"
          : error.message || "Something went wrong",
        variant: "destructive",
      });
      
      return { isRetryable };
    }
  };
}

// Hook for real-time market status
export function useMarketStatus(marketId: string) {
  const { subscribe } = useSubscriptions();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (marketId) {
      const unsubscribe = subscribe(`status.${marketId}`, (status: string) => {
        // Update market status in all relevant queries
        queryClient.setQueryData(marketKeys.detail(marketId), (prev: MarketDetail | undefined) => {
          if (!prev) return prev;
          return { ...prev, status: status as any };
        });
        
        // Invalidate markets list to update status there too
        queryClient.invalidateQueries({ queryKey: marketKeys.lists() });
      });
      return unsubscribe;
    }
  }, [marketId, subscribe, queryClient]);
}