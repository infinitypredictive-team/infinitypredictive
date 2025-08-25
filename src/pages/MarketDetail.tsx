import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Share, TrendingUp, Droplets, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useMarket, useOdds, useLiquidity, useMarketStatus } from '@/features/markets/hooks';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

// Countdown component
function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      } else {
        setTimeLeft('Live');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center space-x-1 text-sm">
      <Clock className="h-4 w-4" />
      <span>{timeLeft}</span>
    </div>
  );
}

// Odds row component with flash animation
function OddsRow({ outcome, marketId, marketTitle, isFlashing }: {
  outcome: { id: string; label: string; odds: number };
  marketId: string;
  marketTitle: string;
  isFlashing: boolean;
}) {
  const { addToBetSlip } = useUIStore();

  const handleAddToBetSlip = () => {
    addToBetSlip({
      marketId,
      outcomeId: outcome.id,
      outcomeLabel: outcome.label,
      marketTitle,
      currentOdds: outcome.odds,
    });

    toast({
      title: "Added to Bet Slip",
      description: `${outcome.label} at ${outcome.odds.toFixed(2)}x`,
    });
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 glass-card hover:border-accent-cyan/40 transition-all",
      isFlashing && "animate-pulse border-accent-cyan/60"
    )}>
      <div>
        <h4 className="font-medium">{outcome.label}</h4>
      </div>
      <div className="flex items-center space-x-3">
        <div className={cn(
          "text-lg font-bold transition-all duration-300",
          isFlashing && "text-accent-cyan"
        )}>
          {outcome.odds.toFixed(2)}x
        </div>
        <Button
          onClick={handleAddToBetSlip}
          className="bg-gradient-primary hover:bg-gradient-primary/90"
        >
          Add to Slip
        </Button>
      </div>
    </div>
  );
}

// Liquidity bar component
function LiquidityBar({ total, depth }: { total: number; depth?: Array<{ price: number; size: number }> }) {
  const maxDepth = depth ? Math.max(...depth.map(d => d.size)) : total;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-foreground-muted">Total Liquidity</span>
        <span className="font-bold text-lg">${total.toLocaleString()}</span>
      </div>
      
      {depth && depth.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Market Depth</h4>
          {depth.map((level, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-sm text-foreground-muted w-12">
                {level.price.toFixed(2)}x
              </span>
              <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                  style={{ width: `${(level.size / maxDepth) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-20 text-right">
                ${level.size.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flashingOutcomes, setFlashingOutcomes] = useState<Set<string>>(new Set());

  // Debug logging
  console.log('🎯 Market Detail Debug:', {
    id,
    hasId: !!id,
    url: window.location.href
  });

  if (!id) {
    console.log('❌ No market ID found, redirecting to home');
    navigate('/');
    return null;
  }

  const { data: market, isLoading, error } = useMarket(id);
  const { data: odds, isLoading: oddsLoading } = useOdds(id);
  const { data: liquidity, isLoading: liquidityLoading } = useLiquidity(id);

  // Debug market data
  console.log('📊 Market Detail Data:', {
    id,
    isLoading,
    error: error?.message,
    market: market ? {
      id: market.id,
      title: market.title,
      category: market.category,
      status: market.status,
      outcomesCount: market.outcomes?.length || 0
    } : null,
    odds,
    liquidity
  });

  // Subscribe to market status updates
  useMarketStatus(id);

  // Handle odds flashing animation
  useEffect(() => {
    if (odds && market?.outcomes) {
      const newFlashing = new Set<string>();
      
      odds.forEach(oddsUpdate => {
        const outcome = market.outcomes?.find(o => o.id === oddsUpdate.outcomeId);
        if (outcome && Math.abs(outcome.odds - oddsUpdate.odds) > 0.01) {
          newFlashing.add(oddsUpdate.outcomeId);
        }
      });

      if (newFlashing.size > 0) {
        setFlashingOutcomes(newFlashing);
        setTimeout(() => setFlashingOutcomes(new Set()), 300);
      }
    }
  }, [odds, market?.outcomes]);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: market?.title,
          text: `Check out this prediction market: ${market?.title}`,
          url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Market link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="glass-header">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex space-x-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-error mx-auto" />
          <h2 className="text-xl font-bold">Market Not Found</h2>
          <p className="text-foreground-muted">
            The market you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      sports: 'border-orange-500/50 text-orange-400',
      elections: 'border-blue-500/50 text-blue-400',
      crypto: 'border-yellow-500/50 text-yellow-400',
      entertainment: 'border-pink-500/50 text-pink-400',
      memes: 'border-green-500/50 text-green-400',
    };
    return colors[category as keyof typeof colors] || 'border-accent-cyan/50 text-accent-cyan';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-success text-background';
      case 'scheduled': return 'bg-warning text-background';
      case 'settled': return 'bg-foreground-muted text-background';
      case 'suspended': return 'bg-error text-background';
      default: return 'bg-accent-cyan text-background';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getCategoryColor(market.category)}>
                  {market.category}
                </Badge>
                <Badge className={getStatusColor(market.status)}>
                  {market.status}
                </Badge>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 w-8 p-0"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Market Title & Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">{market.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
              {market.status !== 'live' && (
                <Countdown targetDate={market.startsAt} />
              )}
              {market.status === 'live' && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span>Live</span>
                </div>
              )}
              {market.topOdds && (
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Top Odds: {market.topOdds.toFixed(2)}x</span>
                </div>
              )}
              {market.liquidity && (
                <div className="flex items-center space-x-1">
                  <Droplets className="h-4 w-4" />
                  <span>Liquidity: ${market.liquidity.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="odds" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="odds">Odds</TabsTrigger>
              <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="glass-card">
                <h3 className="font-semibold mb-3">Market Overview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Status:</span>
                    <Badge className={getStatusColor(market.status)}>
                      {market.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Category:</span>
                    <span className="font-medium">{market.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Start Time:</span>
                    <span className="font-medium">
                      {new Date(market.startsAt).toLocaleString()}
                    </span>
                  </div>
                  {market.outcomes && (
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Outcomes:</span>
                      <span className="font-medium">{market.outcomes.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {market.outcomes && market.outcomes.length > 0 && (
                <div className="glass-card">
                  <h3 className="font-semibold mb-3">Quick Bet</h3>
                  <div className="grid gap-3">
                    {market.outcomes.slice(0, 3).map((outcome) => (
                      <OddsRow
                        key={outcome.id}
                        outcome={outcome}
                        marketId={market.id}
                        marketTitle={market.title}
                        isFlashing={flashingOutcomes.has(outcome.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="odds" className="space-y-4">
              {oddsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : market.outcomes && market.outcomes.length > 0 ? (
                <div className="space-y-3">
                  {market.outcomes.map((outcome) => (
                    <OddsRow
                      key={outcome.id}
                      outcome={outcome}
                      marketId={market.id}
                      marketTitle={market.title}
                      isFlashing={flashingOutcomes.has(outcome.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card text-center py-8">
                  <TrendingUp className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                  <p className="text-foreground-muted">No odds available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="liquidity" className="space-y-4">
              {liquidityLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : liquidity ? (
                <div className="glass-card">
                  <LiquidityBar total={liquidity.total} depth={liquidity.depth} />
                </div>
              ) : (
                <div className="glass-card text-center py-8">
                  <Droplets className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                  <p className="text-foreground-muted">No liquidity data available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}