import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  DollarSign, 
  Clock, 
  Target, 
  BarChart3, 
  Wallet, 
  CheckCircle,
  ArrowRight,
  Play,
  BookOpen,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    step: 1,
    icon: BookOpen,
    title: 'Browse Markets',
    description: 'Explore prediction markets across sports, elections, crypto, entertainment, and more.',
    details: ['Filter by category or search for specific events', 'View live odds that update in real-time', 'Check liquidity to understand market depth']
  },
  {
    step: 2,
    icon: Target,
    title: 'Choose Your Prediction',
    description: 'Select the outcome you believe will happen. Your prediction affects the odds.',
    details: ['Analyze current odds and market sentiment', 'Consider the probability vs. potential payout', 'Understand that odds change based on betting activity']
  },
  {
    step: 3,
    icon: Wallet,
    title: 'Connect Your Wallet',
    description: 'Link your cryptocurrency wallet to place real bets. Demo mode is available for practice.',
    details: ['Ensure you\'re on the Polygon network', 'Have sufficient funds for betting', 'Keep your private keys secure']
  },
  {
    step: 4,
    icon: DollarSign,
    title: 'Place Your Bet',
    description: 'Set your stake amount and confirm your bet. The platform will verify current odds.',
    details: ['Enter your stake amount', 'Review potential payout (Stake × Odds)', 'Submit your bet to the blockchain']
  },
  {
    step: 5,
    icon: Clock,
    title: 'Wait for Outcome',
    description: 'Markets settle when the real-world event concludes.',
    details: ['Track your active bets in the dashboard', 'Monitor odds changes in real-time', 'Markets automatically settle based on official results']
  },
  {
    step: 6,
    icon: CheckCircle,
    title: 'Collect Your Winnings',
    description: 'If your prediction was correct, you automatically receive your payout.',
    details: ['Payouts are processed immediately upon settlement', 'No fees or delays in receiving winnings', 'Transaction history is recorded on the blockchain']
  }
];

const features = [
  {
    icon: TrendingUp,
    title: 'Real-Time Odds',
    description: 'Live odds that update based on market activity and new information.',
    color: 'text-accent-cyan'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Powered by collective intelligence - the wisdom of crowds often outperforms individual experts.',
    color: 'text-accent-purple'
  },
  {
    icon: Shield,
    title: 'Secure & Transparent',
    description: 'All transactions are secured by blockchain technology and smart contracts.',
    color: 'text-success'
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    description: 'Automated payouts as soon as outcomes are determined.',
    color: 'text-accent-gold'
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-primary/20 rounded-full px-4 py-2 mb-6 border border-accent-cyan/30">
            <Play className="h-4 w-4 text-accent-cyan" />
            <span className="text-sm font-medium text-accent-cyan">Getting Started</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              How Prediction Markets Work
            </span>
          </h1>
          
          <p className="text-xl text-foreground-muted max-w-3xl mx-auto mb-8">
            Learn how to trade on the outcomes of real-world events using the power of collective intelligence and blockchain technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/markets">
              <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 group">
                Start Trading
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="outline" size="lg" className="border-accent-cyan/30 hover:bg-accent-cyan/10">
                View FAQ
              </Button>
            </Link>
          </div>
        </section>

        {/* What Are Prediction Markets */}
        <section className="mb-16">
          <div className="glass-card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-background" />
              </div>
              <h2 className="text-2xl font-bold">What Are Prediction Markets?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-foreground-muted leading-relaxed mb-4">
                  Prediction markets are platforms where people can bet on the outcomes of real-world events. 
                  Instead of traditional gambling, these markets aggregate information from many participants 
                  to create accurate forecasts.
                </p>
                <p className="text-foreground-muted leading-relaxed">
                  The key insight is that when people have financial incentives to be right, 
                  they tend to provide more accurate predictions than traditional polls or expert opinions.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-cyan rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-background text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Collective Intelligence</h3>
                    <p className="text-sm text-foreground-muted">The wisdom of crowds often outperforms individual experts</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-purple rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-background text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Financial Incentives</h3>
                    <p className="text-sm text-foreground-muted">People are motivated to provide accurate information</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-gold rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-background text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Real-Time Information</h3>
                    <p className="text-sm text-foreground-muted">Markets instantly reflect new information and sentiment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Get Started */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">How to Get Started</h2>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              Follow these simple steps to start trading on prediction markets
            </p>
          </div>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.step} className="glass-card">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-background" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className="bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30">
                        Step {step.step}
                      </Badge>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    
                    <p className="text-foreground-muted leading-relaxed mb-4">
                      {step.description}
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-foreground-muted">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Features */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Choose Infinity Predictive?</h2>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly design
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-background" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Odds & Payouts Explanation */}
        <section className="mb-16">
          <div className="glass-card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-background" />
              </div>
              <h2 className="text-2xl font-bold">Understanding Odds & Payouts</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">How Odds Work</h3>
                <p className="text-foreground-muted leading-relaxed mb-4">
                  Odds represent the potential payout for a winning bet. For example, 2.5x odds mean 
                  you'll receive 2.5 times your stake if you win.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface-elevated/50 rounded-lg">
                    <span>Stake Amount</span>
                    <span className="font-semibold">$100</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-elevated/50 rounded-lg">
                    <span>Odds</span>
                    <span className="font-semibold text-accent-cyan">2.5x</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success/20 rounded-lg border border-success/30">
                    <span>Potential Payout</span>
                    <span className="font-semibold text-success">$250</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Implied Probability</h3>
                <p className="text-foreground-muted leading-relaxed mb-4">
                  Odds can be converted to probability. Higher odds mean lower probability, 
                  but higher potential reward.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface-elevated/50 rounded-lg">
                    <span>1.5x odds</span>
                    <span className="text-accent-cyan font-semibold">66.7% probability</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-elevated/50 rounded-lg">
                    <span>2.0x odds</span>
                    <span className="text-accent-cyan font-semibold">50.0% probability</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-elevated/50 rounded-lg">
                    <span>5.0x odds</span>
                    <span className="text-accent-cyan font-semibold">20.0% probability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="glass-card">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-foreground-muted mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already trading on the future. 
              Start with demo mode to learn, then connect your wallet for real trading.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/markets">
                <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 group">
                  Explore Markets
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/help">
                <Button variant="outline" size="lg" className="border-accent-cyan/30 hover:bg-accent-cyan/10">
                  Get Help
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
