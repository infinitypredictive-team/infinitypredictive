import { Link } from 'react-router-dom';
import { Search, Wallet, Menu, Zap, CheckCircle, AlertCircle, Loader2, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useWallet } from '@/features/wallet/hooks';
import { getCurrentUser, onAuthChange, signOut as mockSignOut } from '@/features/auth/mock';

interface HeaderProps {
  onMenuToggle?: () => void;
  onSearchChange?: (query: string) => void;
  searchValue?: string;
}

export function Header({ onMenuToggle, onSearchChange, searchValue }: HeaderProps) {
  const { connected, connect, disconnect, account, connecting } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [pulseEffect, setPulseEffect] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  // Real-time connection status updates
  useEffect(() => {
    if (connected) {
      setConnectionStatus('connected');
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 2000);
    } else {
      setConnectionStatus('idle');
    }
  }, [connected]);

  // Simulate real-time network status
  useEffect(() => {
    const interval = setInterval(() => {
      if (connected) {
        // Simulate occasional network status checks
        if (Math.random() < 0.1) {
          setPulseEffect(true);
          setTimeout(() => setPulseEffect(false), 1000);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [connected]);

  // Listen to mock auth across pages
  useEffect(() => {
    const apply = () => {
      const u = getCurrentUser();
      setUserEmail(u?.email || null);
      setUserRole((u?.role as any) || null);
    };
    apply();
    const unsub = onAuthChange(apply);
    return () => { unsub(); };
  }, []);

  const handleConnect = async () => {
    if (connected) {
      disconnect();
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    try {
      // Try MetaMask then fallback to demo automatically
      await connect('metamask');
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('error');
      setTimeout(() => setConnectionStatus('idle'), 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <Loader2 className="h-4 w-4 mr-2 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 mr-2 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 mr-2 text-error" />;
      default:
        return <Wallet className="h-4 w-4 mr-2" />;
    }
  };

  const getButtonText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return `${account?.address?.slice(0, 6)}...${account?.address?.slice(-4)}`;
      case 'error':
        return 'Retry';
      default:
        return 'Connect';
    }
  };

  const getButtonClass = () => {
    const baseClass = "relative overflow-hidden transition-all duration-300 group";
    
    switch (connectionStatus) {
      case 'connecting':
        return cn(baseClass, "bg-accent-cyan/20 border-accent-cyan/50 animate-pulse");
      case 'connected':
        return cn(
          baseClass,
          "bg-gradient-primary text-background font-medium",
          pulseEffect && "animate-glow-pulse"
        );
      case 'error':
        return cn(baseClass, "bg-error/20 border-error/50 hover:bg-error/30");
      default:
        return cn(
          baseClass,
          "hover:bg-accent-cyan/10 hover:border-accent-cyan/30",
          "hover:scale-105 transition-transform"
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-background font-bold text-xl">∞</span>
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-primary opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:animate-gradient-shift">
                  Infinity
                </div>
                <div className="text-xs text-foreground-muted font-medium -mt-1 tracking-wider">
                  PREDICTIVE
                </div>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <Input
                placeholder="Search markets..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 bg-surface-elevated/50 border-white/10 focus:border-accent-cyan/50 focus:ring-accent-cyan/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Wallet & Actions */}
          <div className="flex items-center space-x-3">
            {/* Real-time network indicator */}
            {connected && (
              <div className="hidden sm:flex items-center space-x-2 text-xs text-foreground-muted">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>{account?.network || 'Network'}</span>
              </div>
            )}

            {/* Profile / Auth (Mock auth) */}
            {userEmail ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="inline-flex">
                    <User className="h-4 w-4 mr-2" />
                    {userEmail.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem disabled className="opacity-70">Signed in as {userEmail}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">My Dashboard</Link>
                  </DropdownMenuItem>
                  {userRole === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/wallet">Wallet</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await mockSignOut(); window.location.href = '/'; }}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex hover:bg-accent-cyan/10 hover:border-accent-cyan/30"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Enhanced Connect Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnect}
              disabled={isConnecting || connecting}
              className={getButtonClass()}
            >
              {/* Animated background effect */}
              {connectionStatus === 'connected' && (
                <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-sm animate-pulse" />
              )}
              
              {/* Connection icon */}
              {getConnectionIcon()}
              
              {/* Button text */}
              <span className="relative z-10 font-mono text-sm">
                {getButtonText()}
              </span>

              {/* Real-time effects */}
              {connectionStatus === 'connected' && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-3 w-3 text-accent-gold animate-pulse" />
                </div>
              )}

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </Button>

            {/* Real-time status indicator */}
            {connected && (
              <div className="hidden sm:flex items-center space-x-1">
                <div className="w-1 h-1 bg-success rounded-full animate-pulse" />
                <span className="text-xs text-success font-medium">LIVE</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
            <Input
              placeholder="Search markets..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 bg-surface-elevated/50 border-white/10 focus:border-accent-cyan/50 focus:ring-accent-cyan/20"
            />
          </div>
        </div>
      </div>
    </header>
  );
}