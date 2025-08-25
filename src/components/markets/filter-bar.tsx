import { Trophy, Vote, Coins, Clapperboard, Smile } from 'lucide-react';
import { MarketCategory, useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all' as const, label: 'All', icon: null },
  { id: 'sports' as const, label: 'Sports', icon: Trophy },
  { id: 'elections' as const, label: 'Elections', icon: Vote },
  { id: 'crypto' as const, label: 'Crypto', icon: Coins },
  { id: 'entertainment' as const, label: 'Entertainment', icon: Clapperboard },
  { id: 'memes' as const, label: 'Memes', icon: Smile },
];

interface FilterBarProps {
  onSortChange?: (sort: 'liquidity' | 'odds' | 'time') => void;
  currentSort?: string;
}

export function FilterBar({ onSortChange, currentSort }: FilterBarProps) {
  const { activeCategory, setActiveCategory } = useUIStore();

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "pill-tab flex-shrink-0 flex items-center space-x-2 whitespace-nowrap",
                isActive && "active"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-foreground-muted">
          Sort by:
        </div>
        <div className="flex gap-2">
          {[
            { id: 'liquidity', label: 'Liquidity' },
            { id: 'odds', label: 'Best Odds' },
            { id: 'time', label: 'Time' },
          ].map((sort) => (
            <button
              key={sort.id}
              onClick={() => onSortChange?.(sort.id as any)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                "border border-white/10 hover:border-white/20",
                currentSort === sort.id
                  ? "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}