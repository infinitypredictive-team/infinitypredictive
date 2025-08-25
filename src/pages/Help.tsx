import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Wallet, TrendingUp, DollarSign, Shield, Clock } from 'lucide-react';

const helpData = [
  {
    category: 'Getting Started',
    icon: HelpCircle,
    items: [
      {
        question: 'What is Infinity Predictive?',
        answer: 'Infinity Predictive is a real-time prediction markets platform powered by Azuro. You can trade on the outcomes of real-world events like sports, elections, crypto movements, and entertainment.'
      },
      {
        question: 'How do I start betting?',
        answer: 'Browse markets, select an outcome you want to bet on, add it to your bet slip, set your stake amount, and confirm your bet. You can explore in Demo Mode without connecting a wallet.'
      },
      {
        question: 'What is Demo Mode?',
        answer: 'Demo Mode lets you explore the platform and simulate bets without connecting a wallet or using real money. Perfect for learning how prediction markets work.'
      }
    ]
  },
  {
    category: 'Wallet & Payments',
    icon: Wallet,
    items: [
      {
        question: 'Which wallets are supported?',
        answer: 'We support MetaMask, WalletConnect, and Phantom (coming soon). For real betting, you need to connect a wallet on the Polygon network.'
      },
      {
        question: 'How do I connect my wallet?',
        answer: 'Click "Connect Wallet" in the header, choose your preferred wallet, and follow the connection prompts. Make sure you\'re on the Polygon network.'
      },
      {
        question: 'What if I\'m on the wrong network?',
        answer: 'The app will prompt you to switch to Polygon network. Click the switch button and confirm the network change in your wallet.'
      }
    ]
  },
  {
    category: 'Odds & Liquidity',
    icon: TrendingUp,
    items: [
      {
        question: 'Where do the odds come from?',
        answer: 'Odds are sourced directly from Azuro\'s real-time feed, ensuring accuracy and transparency. They update automatically based on market activity.'
      },
      {
        question: 'What is liquidity?',
        answer: 'Liquidity represents the total amount available for betting on a market. Higher liquidity means you can place larger bets without significantly affecting the odds.'
      },
      {
        question: 'Why do odds change?',
        answer: 'Odds change based on betting activity and new information. When more people bet on one outcome, its odds decrease while others increase.'
      }
    ]
  },
  {
    category: 'Settlement & Payouts',
    icon: DollarSign,
    items: [
      {
        question: 'When do markets settle?',
        answer: 'Markets settle when the outcome is determined. For sports, this is when the game ends. For elections, when results are official. For crypto, at the specified time.'
      },
      {
        question: 'How are payouts calculated?',
        answer: 'Payout = Stake × Odds. If you bet $10 at 2.5x odds and win, you receive $25 (your $10 stake plus $15 profit).'
      },
      {
        question: 'How quickly do I get paid?',
        answer: 'Payouts are automated and processed as soon as markets settle. Funds are sent directly to your connected wallet.'
      }
    ]
  },
  {
    category: 'Security & Safety',
    icon: Shield,
    items: [
      {
        question: 'Is my money safe?',
        answer: 'Yes. All transactions are secured by blockchain technology and smart contracts. Your funds are never held by us - they\'re managed by Azuro\'s decentralized protocol.'
      },
      {
        question: 'What if there\'s a dispute?',
        answer: 'Market outcomes are determined by official sources and verified data. In rare cases of disputes, Azuro\'s governance system handles resolution.'
      }
    ]
  },
  {
    category: 'Technical Support',
    icon: Clock,
    items: [
      {
        question: 'What if my bet fails to submit?',
        answer: 'Check your internet connection and wallet balance. If the problem persists, try refreshing the page or reconnecting your wallet.'
      },
      {
        question: 'How do I export my betting history?',
        answer: 'Go to your Dashboard, click "Export CSV" in the History section to download your complete betting record.'
      }
    ]
  }
];

export default function Help() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-8 bg-gradient-primary rounded-full" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              HELP & FAQ
            </h1>
          </div>
          <p className="text-foreground-muted">
            Everything you need to know about Infinity Predictive
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {helpData.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.category} className="glass-card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Icon className="h-5 w-5 text-background" />
                  </div>
                  <h2 className="text-xl font-bold">{section.category}</h2>
                </div>
                
                <Accordion type="single" collapsible className="space-y-2">
                  {section.items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:bg-white/5 rounded-lg">
                        <span className="text-left font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <p className="text-foreground-muted leading-relaxed">
                          {item.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="mt-12 glass-card text-center">
          <h3 className="text-lg font-semibold mb-2">Still Need Help?</h3>
          <p className="text-foreground-muted mb-4">
            Can't find what you're looking for? Reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="https://t.me/infin8tyCoin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-primary rounded-lg text-background font-medium hover:bg-gradient-primary/90 transition-colors"
            >
              Telegram Support
            </a>
            <a 
              href="https://www.instagram.com/infinitygaming888" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-accent-cyan/30 rounded-lg text-accent-cyan font-medium hover:bg-accent-cyan/10 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
