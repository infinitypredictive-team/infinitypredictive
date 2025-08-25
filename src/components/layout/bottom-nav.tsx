import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, BarChart3, Wallet, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
    },
    {
      path: '/markets',
      icon: TrendingUp,
      label: 'Markets',
    },
    {
      path: '/dashboard',
      icon: BarChart3,
      label: 'Portfolio',
    },
    {
      path: '/wallet',
      icon: Wallet,
      label: 'Wallet',
    },
    {
      path: '/help',
      icon: HelpCircle,
      label: 'Help',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/markets' && location.pathname.startsWith('/markets'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 relative",
                  "hover:bg-white/5",
                  isActive 
                    ? "text-accent-cyan" 
                    : "text-foreground-muted hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "scale-110"
                )} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-2 w-1 h-1 bg-accent-cyan rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}