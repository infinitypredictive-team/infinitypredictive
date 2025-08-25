import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Wallet, 
  Download, 
  Activity, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  RefreshCw,
  Target,
  Trophy,
  ArrowLeft,
  Home,
  Settings,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/features/wallet/hooks';
import { onBetsChange, getAllBets, startBetsSimulator, DummyBet } from '@/features/bets/mock-db';
import { getCurrentUser, signOut } from '@/features/auth/mock';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';

// Enhanced mock data with real-time simulation
const generateMockActiveBets = () => [
  {
    id: '1',
    market: 'Real Madrid vs Barcelona - El Clasico Winner',
    outcome: 'Real Madrid',
    stake: 50 + Math.floor(Math.random() * 20),
    odds: 2.1 + (Math.random() * 0.3 - 0.15),
    potentialPayout: 0, // Will be calculated
    status: 'active' as const,
    category: 'sports',
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    change24h: (Math.random() * 20 - 10), // 24h change percentage
    volume24h: Math.floor(Math.random() * 1000) + 100
  },
  {
    id: '2',
    market: 'Bitcoin Price End of August 2024',
    outcome: 'Above $70,000',
    stake: 25 + Math.floor(Math.random() * 15),
    odds: 2.8 + (Math.random() * 0.4 - 0.2),
    potentialPayout: 0, // Will be calculated
    status: 'active' as const,
    category: 'crypto',
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    change24h: (Math.random() * 15 - 7.5),
    volume24h: Math.floor(Math.random() * 2000) + 500
  },
  {
    id: '3',
    market: 'US Presidential Election 2024 Winner',
    outcome: 'Democratic Candidate',
    stake: 100 + Math.floor(Math.random() * 50),
    odds: 1.8 + (Math.random() * 0.2 - 0.1),
    potentialPayout: 0, // Will be calculated
    status: 'active' as const,
    category: 'elections',
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    change24h: (Math.random() * 10 - 5),
    volume24h: Math.floor(Math.random() * 3000) + 1000
  }
];

const generateMockHistory = () => [
  {
    id: '4',
    market: 'Champions League 2024 Winner',
    outcome: 'Manchester City',
    stake: 100,
    odds: 3.1,
    payout: 310,
    status: 'won' as const,
    settledAt: '2024-06-01T20:00:00Z',
    category: 'sports',
    profit: 210
  },
  {
    id: '5',
    market: 'Eurovision 2024 Winner',
    outcome: 'Sweden',
    stake: 20,
    odds: 4.5,
    payout: 0,
    status: 'lost' as const,
    settledAt: '2024-05-11T22:00:00Z',
    category: 'entertainment',
    profit: -20
  },
  {
    id: '6',
    market: 'Ethereum Price Prediction - End of 2024',
    outcome: 'Above $5,000',
    stake: 75,
    odds: 2.5,
    payout: 187.5,
    status: 'won' as const,
    settledAt: '2024-01-01T00:00:00Z',
    category: 'crypto',
    profit: 112.5
  }
];

// Real-time stats component with enhanced features
function RealTimeStats({ connected, data, isUpdating }: { 
  connected: boolean; 
  data: any; 
  isUpdating: boolean;
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!connected) return null;

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={cn(
          "glass-card transition-all duration-300 cursor-pointer",
          isUpdating && "ring-2 ring-accent-cyan/50"
        )} onClick={() => setShowDetails(!showDetails)}>
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-accent-cyan" />
            <span className="text-sm text-foreground-muted">Active Stakes</span>
            {isUpdating && <RefreshCw className="h-3 w-3 text-accent-cyan animate-spin" />}
          </div>
          <div className="text-2xl font-bold">${data.totalActive}</div>
          <div className="text-xs text-foreground-muted mt-1">
            {data.activeBetsCount} active bets
          </div>
        </div>
        
        <div className={cn(
          "glass-card transition-all duration-300 cursor-pointer",
          isUpdating && "ring-2 ring-accent-purple/50"
        )} onClick={() => setShowDetails(!showDetails)}>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-accent-purple" />
            <span className="text-sm text-foreground-muted">Potential</span>
            {isUpdating && <RefreshCw className="h-3 w-3 text-accent-purple animate-spin" />}
          </div>
          <div className="text-2xl font-bold">${data.totalPotential}</div>
          <div className="text-xs text-foreground-muted mt-1">
            +${(data.totalPotential - data.totalActive).toFixed(2)} profit
          </div>
        </div>
        
        <div className={cn(
          "glass-card transition-all duration-300 cursor-pointer",
          isUpdating && "ring-2 ring-accent-gold/50"
        )} onClick={() => setShowDetails(!showDetails)}>
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-4 w-4 text-accent-gold" />
            <span className="text-sm text-foreground-muted">All-Time P&L</span>
            {isUpdating && <RefreshCw className="h-3 w-3 text-accent-gold animate-spin" />}
          </div>
          <div className={cn(
            "text-2xl font-bold",
            data.totalProfit >= 0 ? "text-success" : "text-error"
          )}>
            {data.totalProfit >= 0 ? '+' : ''}${data.totalProfit}
          </div>
          <div className="text-xs text-foreground-muted mt-1">
            {data.totalBets} total bets
          </div>
        </div>
        
        <div className={cn(
          "glass-card transition-all duration-300 cursor-pointer",
          isUpdating && "ring-2 ring-accent-cyan/50"
        )} onClick={() => setShowDetails(!showDetails)}>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-foreground-muted" />
            <span className="text-sm text-foreground-muted">Win Rate</span>
            {isUpdating && <RefreshCw className="h-3 w-3 text-accent-cyan animate-spin" />}
          </div>
          <div className="text-2xl font-bold">{data.winRate}%</div>
          <div className="text-xs text-foreground-muted mt-1">
            {data.wins}/{data.totalBets} won
          </div>
        </div>
      </div>

      {/* Live Updates Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-success font-medium">LIVE UPDATES</span>
          <span className="text-xs text-foreground-muted">
            Last update: {currentTime.toLocaleTimeString()}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="hover:bg-accent-cyan/10 hover:text-accent-cyan"
        >
          {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
      </div>

      {/* Detailed Stats (Expandable) */}
      {showDetails && (
        <div className="glass-card p-4 animate-fade-in-up">
          <h4 className="font-semibold mb-3 text-accent-cyan">Portfolio Analytics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-foreground-muted">Total Volume</span>
              <div className="font-medium">${data.totalVolume}</div>
            </div>
            <div>
              <span className="text-foreground-muted">Avg Stake</span>
              <div className="font-medium">${data.avgStake}</div>
            </div>
            <div>
              <span className="text-foreground-muted">Best Win</span>
              <div className="font-medium text-success">+${data.bestWin}</div>
            </div>
            <div>
              <span className="text-foreground-muted">ROI</span>
              <div className={cn(
                "font-medium",
                data.roi >= 0 ? "text-success" : "text-error"
              )}>
                {data.roi >= 0 ? '+' : ''}{data.roi}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced wallet connection component with navigation
function WalletConnection({ onConnect, onBack }: { 
  onConnect: () => void; 
  onBack: () => void;
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'error'>('idle');
  const navigate = useNavigate();

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    try {
      await onConnect();
      setConnectionStatus('idle');
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected!",
      });
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => setConnectionStatus('idle'), 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoHome}
          className="hover:bg-accent-cyan/10 hover:text-accent-cyan"
        >
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </div>

      {/* Main Connect Wallet Section */}
      <div className="glass-card text-center py-12 animate-fade-in-up">
        <div className="relative mb-6">
          <BarChart3 className="h-16 w-16 text-foreground-muted mx-auto" />
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-accent-gold animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Connect Your Wallet
        </h3>
        <p className="text-foreground-muted mb-6 max-w-md mx-auto">
          Connect a wallet to view your real-time portfolio, track your predictions, and manage your betting history
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={handleConnect}
            disabled={isConnecting}
            className={cn(
              "bg-gradient-primary hover:bg-gradient-primary/90 group relative overflow-hidden",
              connectionStatus === 'error' && "bg-error hover:bg-error/90"
            )}
            size="lg"
          >
            {connectionStatus === 'connecting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : connectionStatus === 'error' ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Retry Connection
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Connect Wallet
              </>
            )}
          </Button>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-foreground-muted">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
              <span>Real-time updates</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" />
              <span>Secure connection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Options Section */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Explore Markets */}
        <div className="glass-card p-6 text-center hover:border-accent-cyan/30 transition-all duration-300">
          <Target className="h-8 w-8 text-accent-cyan mx-auto mb-3" />
          <h4 className="font-semibold mb-2">Explore Markets</h4>
          <p className="text-sm text-foreground-muted mb-4">
            Browse prediction markets and see what others are betting on
          </p>
          <Link to="/markets">
            <Button variant="outline" size="sm" className="hover:bg-accent-cyan/10 hover:border-accent-cyan/30">
              Browse Markets
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Learn More */}
        <div className="glass-card p-6 text-center hover:border-accent-purple/30 transition-all duration-300">
          <HelpCircle className="h-8 w-8 text-accent-purple mx-auto mb-3" />
          <h4 className="font-semibold mb-2">Learn How It Works</h4>
          <p className="text-sm text-foreground-muted mb-4">
            Understand how prediction markets work and how to get started
          </p>
          <Link to="/how-it-works">
            <Button variant="outline" size="sm" className="hover:bg-accent-purple/10 hover:border-accent-purple/30">
              Get Started
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Demo Mode Info */}
      <div className="glass-card p-6 border-accent-gold/20">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Zap className="h-4 w-4 text-accent-gold" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Try Demo Mode</h4>
            <p className="text-sm text-foreground-muted mb-3">
              You can explore the platform and simulate bets without connecting a wallet. 
              All features are available in demo mode for practice.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-accent-gold/20 text-accent-gold border-accent-gold/30">
                Browse Markets
              </Badge>
              <Badge className="bg-accent-gold/20 text-accent-gold border-accent-gold/30">
                Simulate Bets
              </Badge>
              <Badge className="bg-accent-gold/20 text-accent-gold border-accent-gold/30">
                Track Performance
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { connected, connect } = useWallet();
  const [activeBets, setActiveBets] = useState(generateMockActiveBets());
  const [history, setHistory] = useState(generateMockHistory());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const navigate = useNavigate();

  // Start dummy DB simulator
  useEffect(() => {
    startBetsSimulator();
  }, []);

  // Subscribe to dummy DB changes for realtime-like updates
  useEffect(() => {
    const unsub = onBetsChange(() => {
      const bets = getAllBets();
      const actives: DummyBet[] = bets.filter(b => b.status === 'active' || b.status === 'confirmed');
      const past: DummyBet[] = bets.filter(b => b.status === 'won' || b.status === 'lost' || b.status === 'cancelled');
      // Map to existing shapes used below
      setActiveBets(actives.map(b => ({
        id: b.id,
        market: b.marketTitle,
        outcome: b.outcomeLabel,
        stake: b.stake,
        odds: b.odds,
        potentialPayout: Math.round(b.stake * b.odds * 100) / 100,
        status: 'active' as const,
        category: 'sports',
        timestamp: b.placedAt,
        change24h: 0,
        volume24h: 0,
      })));
      setHistory(past.map(b => ({
        id: b.id,
        market: b.marketTitle,
        outcome: b.outcomeLabel,
        stake: b.stake,
        odds: b.odds,
        payout: Math.round(b.stake * b.odds * 100) / 100,
        status: b.status === 'won' ? 'won' as const : 'lost' as const,
        settledAt: b.placedAt,
        category: 'sports',
        profit: b.status === 'won' ? Math.round(b.stake * (b.odds - 1) * 100) / 100 : -b.stake,
      })));
      setIsRefreshing(true);
      setLastUpdate(new Date());
      setTimeout(() => setIsRefreshing(false), 800);
    });
    return () => { unsub(); };
  }, []);

  // Real-time data updates
  useEffect(() => {
    if (!connected) return;

    const interval = setInterval(() => {
      setIsRefreshing(true);
      
      // Simulate real-time updates
      setActiveBets(prev => prev.map(bet => ({
        ...bet,
        odds: bet.odds + (Math.random() * 0.1 - 0.05), // Small odds fluctuations
        stake: bet.stake + Math.floor(Math.random() * 5 - 2), // Small stake changes
        change24h: bet.change24h + (Math.random() * 2 - 1), // 24h change fluctuations
        volume24h: bet.volume24h + Math.floor(Math.random() * 50 - 25), // Volume changes
      })));
      
      setLastUpdate(new Date());
      
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [connected]);

  // Calculate real-time stats
  const activeBetsWithPayouts = activeBets.map(bet => ({
    ...bet,
    potentialPayout: Math.round(bet.stake * bet.odds * 100) / 100
  }));

  const totalActive = activeBetsWithPayouts.reduce((sum, bet) => sum + bet.stake, 0);
  const totalPotential = activeBetsWithPayouts.reduce((sum, bet) => sum + bet.potentialPayout, 0);
  const totalProfit = history.reduce((sum, bet) => sum + bet.profit, 0);
  const totalBets = history.length;
  const wins = history.filter(bet => bet.status === 'won').length;
  const winRate = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0;
  const totalVolume = history.reduce((sum, bet) => sum + bet.stake, 0) + totalActive;
  const avgStake = totalBets > 0 ? Math.round(totalVolume / (totalBets + activeBetsWithPayouts.length)) : 0;
  const bestWin = Math.max(...history.map(bet => bet.profit), 0);
  const roi = totalVolume > 0 ? Math.round((totalProfit / totalVolume) * 100) : 0;

  const statsData = {
    totalActive,
    totalPotential,
    totalProfit,
    activeBetsCount: activeBetsWithPayouts.length,
    totalBets,
    wins,
    winRate,
    totalVolume,
    avgStake,
    bestWin,
    roi
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

  const handleExportCSV = () => {
    const csvContent = [
      ['Market', 'Outcome', 'Stake', 'Odds', 'Status', 'Payout', 'Category', 'Date'],
      ...history.map(bet => [
        bet.market,
        bet.outcome,
        bet.stake,
        bet.odds,
        bet.status,
        bet.payout,
        bet.category,
        new Date(bet.settledAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "CSV Exported",
      description: "Your portfolio data has been downloaded.",
    });
  };

  const handleBackToConnect = () => {
    setShowConnectWallet(true);
  };

  const handleBackToDashboard = () => {
    setShowConnectWallet(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-8 bg-gradient-primary rounded-full" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PORTFOLIO
            </h1>
            {connected && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-success font-medium">LIVE</span>
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">
              {getCurrentUser() && (
                <Button size="sm" variant="outline" onClick={async () => { await signOut(); navigate('/'); }}>
                  Sign Out
                </Button>
              )}
            </div>
          </div>
          <p className="text-foreground-muted">
            Track your predictions and performance in real-time
          </p>
          {connected && (
            <p className="text-xs text-foreground-muted mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        {showConnectWallet ? (
          <WalletConnection onConnect={() => connect('metamask')} onBack={handleBackToDashboard} />
        ) : connected ? (
          <div className="space-y-6 animate-fade-in-up">
            {/* Navigation to Connect Wallet */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToConnect}
                className="hover:bg-accent-cyan/10 hover:border-accent-cyan/30"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>

            {/* Real-time Stats */}
            <RealTimeStats connected={connected} data={statsData} isUpdating={isRefreshing} />

            {/* Active Bets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <Target className="h-5 w-5 text-accent-cyan" />
                  <span>Active Positions</span>
                  {isRefreshing && <RefreshCw className="h-4 w-4 text-accent-cyan animate-spin" />}
                </h2>
                <Badge className="bg-live/20 text-live border-live/30">
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  LIVE
                </Badge>
              </div>
              
              {activeBetsWithPayouts.length === 0 ? (
                <div className="glass-card text-center py-8">
                  <TrendingUp className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                  <p className="text-foreground-muted">No active bets</p>
                  <p className="text-sm text-foreground-subtle mt-1">
                    Place some predictions to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBetsWithPayouts.map((bet, index) => (
                    <div 
                      key={bet.id} 
                      className={cn(
                        "glass-card transition-all duration-300",
                        isRefreshing && "ring-1 ring-accent-cyan/30"
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">
                            {bet.market}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs border", getCategoryColor(bet.category))}
                            >
                              {bet.category.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-accent-cyan font-medium">
                              {bet.outcome}
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-live/20 text-live border-live/30">
                          <div className="w-1 h-1 bg-live rounded-full mr-1 animate-pulse" />
                          ACTIVE
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-foreground-muted">Stake</span>
                          <div className="font-medium">${bet.stake}</div>
                        </div>
                        <div>
                          <span className="text-foreground-muted">Odds</span>
                          <div className="font-medium">{bet.odds.toFixed(2)}x</div>
                        </div>
                        <div>
                          <span className="text-foreground-muted">Potential</span>
                          <div className="font-medium text-success">${bet.potentialPayout}</div>
                        </div>
                        <div>
                          <span className="text-foreground-muted">24h Change</span>
                          <div className={cn(
                            "font-medium",
                            bet.change24h >= 0 ? "text-success" : "text-error"
                          )}>
                            {bet.change24h >= 0 ? '+' : ''}{bet.change24h.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bet History */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-accent-gold" />
                  <span>Recent History</span>
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportCSV}
                  className="hover:bg-accent-cyan/10 hover:border-accent-cyan/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              
              {history.length === 0 ? (
                <div className="glass-card text-center py-8">
                  <BarChart3 className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                  <p className="text-foreground-muted">No betting history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((bet, index) => (
                    <div 
                      key={bet.id} 
                      className="glass-card animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">
                            {bet.market}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs border", getCategoryColor(bet.category))}
                            >
                              {bet.category.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-foreground-muted">
                              {bet.outcome}
                            </span>
                          </div>
                        </div>
                        <Badge className={cn(
                          bet.status === 'won' 
                            ? "bg-success/20 text-success border-success/30"
                            : "bg-error/20 text-error border-error/30"
                        )}>
                          {bet.status === 'won' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {bet.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-foreground-muted">Stake</span>
                          <div className="font-medium">${bet.stake}</div>
                        </div>
                        <div>
                          <span className="text-foreground-muted">Odds</span>
                          <div className="font-medium">{bet.odds}x</div>
                        </div>
                        <div>
                          <span className="text-foreground-muted">Result</span>
                          <div className={cn(
                            "font-medium",
                            bet.status === 'won' ? "text-success" : "text-error"
                          )}>
                            {bet.status === 'won' ? `+$${bet.profit}` : `-$${bet.stake}`}
                          </div>
                        </div>
                        <div>
                          <span className="text-foreground-muted">Date</span>
                          <div className="font-medium text-xs">
                            {new Date(bet.settledAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <WalletConnection onConnect={() => connect('metamask')} onBack={() => {}} />
        )}
      </main>

      <BottomNav />
    </div>
  );
}