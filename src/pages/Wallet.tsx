import { Wallet as WalletIcon, Shield, Zap, ExternalLink } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet, useWalletBalance } from '@/features/wallet/hooks';
import { SUPPORTED_NETWORKS } from '@/features/wallet/adapters';

export default function Wallet() {
  const { connected, account, connect, disconnect, signMessage, switchNetwork } = useWallet();
  const { data: liveBalance } = useWalletBalance();

  const walletOptions = [
    {
      name: 'MetaMask',
      description: 'Most popular Ethereum wallet',
      icon: '🦊',
      recommended: true,
    },
    {
      name: 'WalletConnect',
      description: 'Connect with 300+ wallets',
      icon: '🔗',
      recommended: false,
    },
    {
      name: 'Phantom',
      description: 'For Solana-based betting',
      icon: '👻',
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-8 bg-gradient-primary rounded-full" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              WALLET
            </h1>
          </div>
          <p className="text-foreground-muted">
            Connect your wallet to start placing real predictions
          </p>
        </div>

        {connected ? (
          /* Connected State */
          <div className="space-y-6">
            {/* Wallet Info */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <WalletIcon className="h-5 w-5 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Connected Wallet</h3>
                    <p className="text-sm text-foreground-muted">MetaMask</p>
                  </div>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">
                  CONNECTED
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-sm text-foreground-muted">Address</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{account?.address}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-sm text-foreground-muted">Network</span>
                  <span className="text-sm font-medium capitalize">{account?.network}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-foreground-muted">Balance</span>
                  <span className="text-sm font-medium">{(liveBalance ?? account?.balance ?? 0).toFixed(4)} {account?.network === 'Gnosis Chain' ? 'XDAI' : 'MATIC'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card text-center">
                <div className="w-12 h-12 bg-accent-cyan/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-accent-cyan" />
                </div>
                <h3 className="font-medium mb-1">Deposit</h3>
                <p className="text-sm text-foreground-muted mb-3">Add funds to your wallet</p>
                <Button size="sm" variant="outline">
                  Deposit
                </Button>
              </div>
              
              <div className="glass-card text-center">
                <div className="w-12 h-12 bg-accent-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <WalletIcon className="h-6 w-6 text-accent-purple" />
                </div>
                <h3 className="font-medium mb-1">Withdraw</h3>
                <p className="text-sm text-foreground-muted mb-3">Transfer to external wallet</p>
                <Button size="sm" variant="outline">
                  Withdraw
                </Button>
              </div>
            </div>

            {/* Network & Security Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <h4 className="font-semibold mb-2">Network</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted">Current:</span>
                  <span className="text-sm font-medium">{account?.network}</span>
                </div>
                {account?.chainId !== (Number((import.meta as any)?.env?.VITE_CHAIN_ID) || SUPPORTED_NETWORKS.polygon.chainId) && (
                  <div className="mt-3">
                    <Button size="sm" onClick={() => switchNetwork(Number((import.meta as any)?.env?.VITE_CHAIN_ID) || SUPPORTED_NETWORKS.polygon.chainId)}>
                      Switch Network
                    </Button>
                  </div>
                )}
              </div>
              <div className="glass-card p-4">
                <h4 className="font-semibold mb-2">Security</h4>
                <p className="text-sm text-foreground-muted mb-3">Verify wallet ownership by signing a message.</p>
                <Button size="sm" variant="outline" onClick={async () => {
                  try {
                    const signature = await signMessage(`Login to Infinity Predictive at ${new Date().toISOString()}`);
                    console.log('Signature:', signature);
                  } catch (e) {}
                }}>
                  Sign Message
                </Button>
              </div>
            </div>

            {/* Disconnect */}
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={disconnect}
                className="w-full border-error/30 text-error hover:bg-error/10"
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>
        ) : (
          /* Disconnected State */
          <div className="space-y-6">
            {/* Demo Mode Info */}
            <div className="glass-card border-accent-gold/20">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="h-5 w-5 text-accent-gold" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Demo Mode Active</h3>
                  <p className="text-sm text-foreground-muted">
                    You're currently in demo mode. Connect a wallet to place real bets with actual funds. 
                    All simulated bets will help you learn without any financial risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Options */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Choose Your Wallet</h2>
              <div className="space-y-3">
                {walletOptions.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => connect('metamask')}
                    className="w-full glass-card hover:border-accent-cyan/30 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{wallet.icon}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{wallet.name}</h3>
                            {wallet.recommended && (
                              <Badge className="bg-accent-gold/20 text-accent-gold border-accent-gold/30 text-xs">
                                RECOMMENDED
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground-muted">{wallet.description}</p>
                        </div>
                      </div>
                      <div className="text-accent-cyan">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Why Connect */}
            <div className="glass-card">
              <h3 className="font-semibold mb-3">Why Connect a Wallet?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-cyan rounded-full mt-2 flex-shrink-0" />
                  <p className="text-foreground-muted">
                    <strong className="text-foreground">Real Betting:</strong> Place actual bets with real money and earn profits from correct predictions.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-purple rounded-full mt-2 flex-shrink-0" />
                  <p className="text-foreground-muted">
                    <strong className="text-foreground">Instant Payouts:</strong> Automated withdrawals as soon as markets settle.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="text-foreground-muted">
                    <strong className="text-foreground">Portfolio Tracking:</strong> View your complete betting history and performance analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}