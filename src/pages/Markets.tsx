import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { FilterBar } from '@/components/markets/filter-bar';
import { MarketCard } from '@/components/markets/market-card';
import { BetSlipDrawer } from '@/components/markets/bet-slip-drawer';
import { marketsApi, marketKeys } from '@/features/markets/api';
import { useUIStore, MarketCategory } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Markets() {
  const { activeCategory } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'liquidity' | 'odds' | 'time'>('liquidity');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Create query parameters
  const queryParams = {
    category: activeCategory === 'all' ? undefined : activeCategory as MarketCategory,
    q: searchQuery || undefined,
    sort: sortBy,
  };

  // Debug logging (development only)
  if (import.meta.env.DEV) {
    console.log('🎯 Markets Page Debug:', {
      activeCategory,
      searchQuery,
      sortBy,
      queryParams,
      categoryFilter: activeCategory === 'all' ? 'showing all' : `filtering by ${activeCategory}`
    });
  }

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: marketKeys.list(queryParams),
    queryFn: () => marketsApi.getMarkets(queryParams),
    refetchInterval: (query) => {
      const d: any = query.state.data;
      const hasLive = d?.items?.some((m: any) => m.status === 'live');
      return hasLive ? 5000 : 15000;
    },
    staleTime: 10 * 1000, // 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Add fallback data to ensure we always have something to show
    placeholderData: {
      items: [],
      total: 0,
      nextPage: undefined
    }
  });

  // Update timestamp when data changes
  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
    }
  }, [data]);

  // Debug data (development only)
  if (import.meta.env.DEV) {
    console.log('📊 Query Result:', {
      isLoading,
      error: error?.message,
      data: data ? {
        itemsCount: data.items?.length || 0,
        total: data.total || 0,
        hasNextPage: !!data.nextPage
      } : null,
      isRefetching
    });
  }

  // Test data loading (development only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔍 Markets component mounted');
      console.log('🔍 Active category:', activeCategory);
      console.log('🔍 Query params:', queryParams);
    }
  }, [activeCategory, queryParams]);

  const handleRefresh = () => {
    if (import.meta.env.DEV) {
      console.log('🔄 Manual refresh triggered');
    }
    refetch();
  };

  const markets = data?.items || [];
  const sortedMarkets = useMemo(() => {
    const items = [...markets];
    if (sortBy === 'liquidity') {
      items.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
    } else if (sortBy === 'odds') {
      items.sort((a, b) => (b.topOdds || 0) - (a.topOdds || 0));
    } else if (sortBy === 'time') {
      items.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    }
    return items;
  }, [markets, sortBy]);
  const hasLiveMarkets = markets.some(m => m.status === 'live');

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-8 bg-gradient-primary rounded-full" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PREDICTION MARKETS
            </h1>
            {hasLiveMarkets && (
              <div className="flex items-center space-x-2 text-accent-cyan text-sm">
                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                <span className="font-medium">LIVE</span>
              </div>
            )}
          </div>
          <p className="text-foreground-muted">
            Trade on the outcome of real-world events
          </p>
          {data && (
            <p className="text-xs text-foreground-muted mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar 
            onSortChange={setSortBy}
            currentSort={sortBy}
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="flex items-center space-x-2 text-foreground-muted">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading markets...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="glass-card max-w-md mx-auto">
                <AlertCircle className="h-12 w-12 text-error mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to load markets</h3>
                <p className="text-foreground-muted mb-4">
                  {error.message || 'Please try again later'}
                </p>
                <Button 
                  onClick={handleRefresh}
                  disabled={isRefetching}
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                >
                  {isRefetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground-muted">
                  {data.total || 0} market{(data.total || 0) !== 1 ? 's' : ''} found
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefetching}
                  className="hover:bg-accent-cyan/10 hover:border-accent-cyan/30"
                >
                  {isRefetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {sortedMarkets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="glass-card max-w-md mx-auto">
                    <AlertCircle className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No markets found</h3>
                    <p className="text-foreground-muted">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sortedMarkets.map((market, index) => (
                    <div
                      key={market.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <MarketCard market={market} />
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button (if needed) */}
              {data.nextPage && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => {
                      // For now, just refetch with more data
                      refetch();
                    }}
                    className="bg-gradient-primary hover:bg-gradient-primary/90"
                  >
                    Load More Markets
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Debug Info - Only show in development mode */}
          {import.meta.env.DEV && (
            <div className="mt-8 p-4 bg-surface-elevated/50 rounded-lg text-xs border border-accent-cyan/20">
              <h4 className="font-semibold mb-2 text-accent-cyan">Debug Info (Dev Only):</h4>
              <pre className="text-foreground-muted overflow-auto">
                {JSON.stringify({
                  activeCategory,
                  searchQuery,
                  sortBy,
                  isLoading,
                  error: error?.message,
                  dataCount: markets.length,
                  hasLiveMarkets,
                  timestamp: new Date().toISOString()
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
      <BetSlipDrawer />
    </div>
  );
}