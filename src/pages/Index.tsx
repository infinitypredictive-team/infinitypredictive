import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  Zap, 
  Users, 
  ArrowRight, 
  Star, 
  Target, 
  Shield, 
  DollarSign, 
  Clock, 
  BarChart3,
  Sparkles,
  Rocket,
  Globe,
  Activity
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { FilterBar } from '@/components/markets/filter-bar';
import { MarketCard } from '@/components/markets/market-card';
import { BetSlipDrawer } from '@/components/markets/bet-slip-drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketsApi, marketKeys } from '@/features/markets/api';
import { useUIStore, MarketCategory } from '@/lib/store';
import { cn } from '@/lib/utils';

// Animated stats counter component
function AnimatedCounter({ value, label, color = "text-accent-cyan" }: { 
  value: number; 
  label: string; 
  color?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div className="text-center">
      <div className={cn("text-2xl font-bold transition-all duration-1000", color)}>
        {displayValue.toLocaleString()}
        {label.includes('Volume') && '+'}
        {label.includes('Predictions') && '+'}
      </div>
      <div className="text-sm text-foreground-muted">{label}</div>
    </div>
  );
}

// Real-time ticker component
function LiveTicker({ markets }: { markets: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (markets.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % markets.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [markets.length]);

  if (markets.length === 0) return null;

  const currentMarket = markets[currentIndex];

  return (
    <div className="live-ticker mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
          <span className="text-sm font-medium text-accent-cyan">LIVE TICKER</span>
        </div>
        <div className="text-sm text-foreground-muted">
          {currentMarket?.title?.substring(0, 50)}...
        </div>
        <div className="text-sm font-bold text-accent-cyan">
          {currentMarket?.topOdds?.toFixed(2)}x
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const { activeCategory } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch featured markets with enhanced real-time updates
  const { data: featuredData } = useQuery({
    queryKey: marketKeys.list({ sort: 'liquidity' }),
    queryFn: () => marketsApi.getMarkets({ sort: 'liquidity' }),
    refetchInterval: 10000, // More frequent updates
    staleTime: 5000,
  });

  // Fetch live markets with very frequent updates
  const { data: liveData } = useQuery({
    queryKey: ['markets', 'live'],
    queryFn: () => marketsApi.getMarkets({ sort: 'time' }),
    refetchInterval: 3000, // Very frequent for live markets
    staleTime: 2000,
  });

  const featuredMarkets = featuredData?.items.slice(0, 6) || [];
  const liveMarkets = liveData?.items.filter(m => m.status === 'live').slice(0, 4) || [];

  // Calculate dynamic stats
  const totalVolume = 2400000 + (Math.random() * 100000); // Simulate real-time volume
  const activeMarkets = featuredData?.total || 0;
  const totalPredictions = 15000 + Math.floor(Math.random() * 1000); // Simulate real-time predictions

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="floating-element"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <Header 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="container mx-auto px-4 relative z-10">
        {/* Hero Section with Enhanced Animations */}
        <section className="py-12 md:py-20 text-center relative">
          <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-pulse" />
          <div className="relative z-10">
            {/* Animated badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-primary/20 rounded-full px-4 py-2 mb-6 border border-accent-cyan/30 animate-fade-in">
              <Zap className="h-4 w-4 text-accent-cyan animate-pulse" />
              <span className="text-sm font-medium text-accent-cyan">Real-Time Predictions</span>
              <Sparkles className="h-3 w-3 text-accent-gold animate-spin" />
            </div>
            
            {/* Animated title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Infinity Predictive
              </span>
            </h1>
            
            {/* Animated subtitle */}
            <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Trade on the outcomes of real-world events with real-time data and instant settlements.
            </p>
            
            {/* Animated CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link to="/markets">
                <Button size="lg" className="btn-gradient hover:bg-gradient-primary/90 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Explore Markets
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="border-accent-cyan/30 hover:bg-accent-cyan/10 group">
                  <Rocket className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Live ticker */}
            <LiveTicker markets={liveMarkets} />

            {/* Animated stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-md mx-auto">
              <AnimatedCounter value={Math.floor(totalVolume / 1000000)} label="M+ Volume" color="text-accent-cyan" />
              <AnimatedCounter value={activeMarkets} label="Active Markets" color="text-accent-purple" />
              <AnimatedCounter value={totalPredictions} label="Predictions" color="text-accent-gold" />
            </div>
          </div>
        </section>

        {/* Real-time clock */}
        <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="inline-flex items-center space-x-2 bg-surface-elevated/50 rounded-full px-4 py-2 border border-white/10">
            <Clock className="h-4 w-4 text-accent-cyan" />
            <span className="text-sm font-mono text-foreground">
              {currentTime.toLocaleTimeString()}
            </span>
            <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
          </div>
        </div>

        {/* Categories Filter with Animation */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          <FilterBar />
        </section>

        {/* Live Markets with Enhanced Real-time Features */}
        {liveMarkets.length > 0 && (
          <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-8 bg-live rounded-full live-indicator" />
                <h2 className="text-2xl font-bold">Live Markets</h2>
                <Badge className="bg-live/20 text-live border-live/30 animate-pulse">
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  LIVE
                </Badge>
                <span className="text-sm text-foreground-muted">
                  {liveMarkets.length} active now
                </span>
              </div>
              <Link to="/markets">
                <Button variant="ghost" size="sm" className="hover:text-accent-cyan group">
                  View All 
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {liveMarkets.map((market, index) => (
                <div 
                  key={market.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${1200 + index * 100}ms` }}
                >
                  <MarketCard market={market} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Markets with Enhanced Animations */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '1400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-8 bg-gradient-primary rounded-full" />
              <h2 className="text-2xl font-bold">Featured Markets</h2>
              <Badge className="bg-accent-gold/20 text-accent-gold border-accent-gold/30">
                <Star className="h-3 w-3 mr-1 animate-pulse" />
                HOT
              </Badge>
            </div>
            <Link to="/markets">
              <Button variant="ghost" size="sm" className="hover:text-accent-cyan group">
                View All 
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredMarkets.map((market, index) => (
              <div 
                key={market.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${1600 + index * 150}ms` }}
              >
                <MarketCard market={market} />
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-12 animate-fade-in-up" style={{ animationDelay: '1800ms' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Why Choose Infinity Predictive?
            </h2>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              The most advanced prediction market platform with real-time data, transparent outcomes, and instant settlements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Real-Time Odds",
                description: "Live odds that update instantly based on market sentiment and new information.",
                color: "bg-gradient-primary",
                delay: 0
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Powered by collective intelligence and community predictions.",
                color: "bg-accent-purple",
                delay: 200
              },
              {
                icon: Shield,
                title: "Secure & Transparent",
                description: "All transactions secured by blockchain technology and smart contracts.",
                color: "bg-success",
                delay: 400
              },
              {
                icon: Zap,
                title: "Instant Settlement",
                description: "Automated payouts as soon as outcomes are determined.",
                color: "bg-accent-gold",
                delay: 600
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card text-center transition-all duration-500 hover:scale-105 hover:border-accent-cyan/40 hover:shadow-glow-cyan"
                style={{ animationDelay: `${2000 + feature.delay}ms` }}
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300",
                  feature.color
                )}>
                  <feature.icon className="h-8 w-8 text-background" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-foreground-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Real-time Market Activity */}
        <section className="py-8 animate-fade-in-up" style={{ animationDelay: '2200ms' }}>
          <div className="glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Live Market Activity</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
                <span className="text-sm text-accent-cyan">Real-time</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-accent-cyan">
                  {liveMarkets.length}
                </div>
                <div className="text-xs text-foreground-muted">Live Markets</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent-purple">
                  {featuredMarkets.length}
                </div>
                <div className="text-xs text-foreground-muted">Featured</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent-gold">
                  {Math.floor(Math.random() * 100) + 50}
                </div>
                <div className="text-xs text-foreground-muted">Active Users</div>
              </div>
              <div>
                <div className="text-lg font-bold text-success">
                  {Math.floor(Math.random() * 1000) + 500}
                </div>
                <div className="text-xs text-foreground-muted">Bets Today</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
      <BetSlipDrawer />
    </div>
  );
};

export default Index;
