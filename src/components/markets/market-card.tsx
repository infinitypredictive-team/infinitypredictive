import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Droplets, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarketSummary, useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

interface MarketCardProps {
  market: MarketSummary;
  className?: string;
}

export function MarketCard({ market, className }: MarketCardProps) {
  const { addToBetSlip } = useUIStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time updates for demo
  useEffect(() => {
    if (market.status === 'live') {
      const interval = setInterval(() => {
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 500);
      }, 10000); // Update every 10 seconds for live markets
      
      return () => clearInterval(interval);
    }
  }, [market.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-live/20 text-live border-live/30';
      case 'scheduled':
        return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30';
      case 'settled':
        return 'bg-success/20 text-success border-success/30';
      case 'suspended':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-surface-elevated text-foreground-muted border-white/10';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      sports: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
      elections: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30',
      crypto: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
      entertainment: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
      memes: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30',
    };
    return colors[category as keyof typeof colors] || colors.crypto;
  };

  const formatLiquidity = (amount?: number) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const bestOutcome = market.outcomes && market.outcomes.length > 0
    ? market.outcomes.reduce((best, current) => (current.odds > best.odds ? current : best), market.outcomes[0])
    : undefined;

  const handleAddToBetSlip = (e: React.MouseEvent) => {
    e.preventDefault();
    if (bestOutcome) {
      addToBetSlip({
        marketId: market.id,
        outcomeId: bestOutcome.id,
        outcomeLabel: bestOutcome.label,
        marketTitle: market.title,
        currentOdds: bestOutcome.odds,
      });
    }
  };

  return (
    <Link to={`/market/${market.id}`} className={className}>
      <div className={cn(
        "market-card group transition-all duration-300",
        isUpdating && "ring-2 ring-accent-cyan/50"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs font-medium border", getCategoryColor(market.category))}
            >
              {market.category.toUpperCase()}
            </Badge>
            <Badge 
              variant="outline"
              className={cn("text-xs font-medium border", getStatusColor(market.status))}
            >
              {market.status === 'live' && (
                <div className="w-2 h-2 rounded-full bg-live mr-1 live-indicator" />
              )}
              {market.status.toUpperCase()}
            </Badge>
            {isUpdating && (
              <div className="flex items-center space-x-1 text-accent-cyan text-xs">
                <Zap className="h-3 w-3 animate-pulse" />
                <span>LIVE</span>
              </div>
            )}
          </div>
          
          {bestOutcome && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddToBetSlip}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-accent-cyan/20 hover:text-accent-cyan"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-accent-cyan transition-colors">
          {market.title}
        </h3>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-foreground-muted mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>{market.topOdds ? `${market.topOdds.toFixed(2)}x` : 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Droplets className="h-4 w-4" />
              <span>{formatLiquidity(market.liquidity)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>
              {market.status === 'live' 
                ? 'Live now' 
                : formatDistanceToNow(new Date(market.startsAt), { addSuffix: true })
              }
            </span>
          </div>
        </div>

        {/* Best Outcome */}
        {bestOutcome && (
          <div className="bg-surface-elevated/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {bestOutcome.label}
              </span>
              <div className="bg-gradient-primary/20 px-2 py-1 rounded text-sm font-bold text-accent-cyan border border-accent-cyan/20">
                {bestOutcome.odds.toFixed(2)}x
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}