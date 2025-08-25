import { Link } from 'react-router-dom';
import { Home, ArrowLeft, BarChart3, TrendingUp, Wallet, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl" />
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-foreground-muted max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to exploring prediction markets.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 group">
                <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Go Home
              </Button>
            </Link>
            <Link to="/markets">
              <Button variant="outline" size="lg" className="border-accent-cyan/30 hover:bg-accent-cyan/10 group">
                <TrendingUp className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Browse Markets
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="glass-card max-w-lg mx-auto">
            <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/markets" 
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <TrendingUp className="h-4 w-4 text-accent-cyan" />
                <span className="text-sm">Markets</span>
              </Link>
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <BarChart3 className="h-4 w-4 text-accent-purple" />
                <span className="text-sm">Portfolio</span>
              </Link>
              <Link 
                to="/wallet" 
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Wallet className="h-4 w-4 text-accent-gold" />
                <span className="text-sm">Wallet</span>
              </Link>
              <Link 
                to="/help" 
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-accent-cyan" />
                <span className="text-sm">Help</span>
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <div className="pt-8">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-foreground-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
