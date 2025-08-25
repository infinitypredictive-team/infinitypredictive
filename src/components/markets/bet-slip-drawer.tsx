import { useState } from 'react';
import { X, Trash2, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { usePlaceBet } from '@/features/markets/hooks';
import { marketsApi } from '@/features/markets/api';
import { BetRequestSchema } from '@/features/bets/api';
import { useWallet } from '@/features/wallet/hooks';
import { addBet } from '@/features/bets/mock-db';

export function BetSlipDrawer() {
  const { 
    betSlipItems, 
    betSlipOpen, 
    setBetSlipOpen, 
    removeFromBetSlip, 
    updateStake,
    clearBetSlip,
    demoMode 
  } = useUIStore();
  const { connected, account } = useWallet();
  const placeBet = usePlaceBet();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalStake = betSlipItems.reduce((sum, item) => sum + item.stake, 0);
  const potentialPayout = betSlipItems.reduce((sum, item) => sum + (item.stake * item.currentOdds), 0);
  const potentialProfit = potentialPayout - totalStake;

  const handleSubmitBets = async () => {
    setIsSubmitting(true);
    
    try {
      if (demoMode) {
        // Simulate bet submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: "Bet Simulated",
          description: "Connect a wallet to place it on-chain.",
        });
      } else {
        if (!connected || !account?.address) {
          toast({
            title: "Wallet Required",
            description: "Please connect your wallet to place real bets.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        // Process each bet sequentially with odds verification
        for (const item of betSlipItems) {
          // Re-fetch latest odds for the market
          const latestOdds = await marketsApi.getOdds(item.marketId);
          const outcomeUpdate = latestOdds.find(o => o.outcomeId === item.outcomeId);
          if (!outcomeUpdate) {
            toast({
              title: "Odds Unavailable",
              description: `No current odds for ${item.outcomeLabel}.`,
              variant: "destructive",
            });
            continue;
          }

          // If odds drifted, block and ask to re-add
          const drift = Math.abs(outcomeUpdate.odds - item.currentOdds);
          if (drift > 0.01) {
            toast({
              title: "Odds Changed",
              description: `${item.outcomeLabel} moved to ${outcomeUpdate.odds.toFixed(2)}x. Please review and submit again.`,
              variant: "destructive",
            });
            continue;
          }

          // Validate payload before submission
          const payload = BetRequestSchema.parse({
            marketId: item.marketId,
            outcomeId: item.outcomeId,
            stake: item.stake,
            odds: item.currentOdds,
            walletAddress: account.address,
          });

          await placeBet.mutateAsync(payload);

          // Record into dummy DB for realtime dashboards
          addBet({
            wallet: account.address,
            marketId: item.marketId,
            marketTitle: item.marketTitle,
            outcomeId: item.outcomeId,
            outcomeLabel: item.outcomeLabel,
            stake: item.stake,
            odds: item.currentOdds,
          });
        }
      }
      
      clearBetSlip();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "That didn't go through. Please retry or check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={betSlipOpen} onOpenChange={setBetSlipOpen}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-accent-cyan" />
                <span>Bet Slip</span>
                <span className="text-sm font-normal text-foreground-muted">
                  ({betSlipItems.length})
                </span>
              </DrawerTitle>
              <DrawerDescription>
                Review and place your predictions
              </DrawerDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBetSlipOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {betSlipItems.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
              <p className="text-foreground-muted">Your bet slip is empty</p>
              <p className="text-sm text-foreground-subtle mt-1">
                Add some predictions to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Demo Mode Warning */}
              {demoMode && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                    <div className="text-sm">
                      <p className="text-warning font-medium">Demo Mode</p>
                      <p className="text-foreground-muted mt-1">
                        To place real bets, connect a wallet. You can explore and simulate bets in Demo Mode.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bet Items */}
              {betSlipItems.map((item) => (
                <div key={item.marketId} className="glass-card space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.marketTitle}
                      </h4>
                      <p className="text-accent-cyan text-sm font-medium mt-1">
                        {item.outcomeLabel}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        Odds: {item.currentOdds.toFixed(2)}x
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromBetSlip(item.marketId)}
                      className="h-8 w-8 p-0 text-foreground-muted hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`stake-${item.marketId}`} className="text-xs">
                      Stake Amount
                    </Label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">
                          $
                        </span>
                        <Input
                          id={`stake-${item.marketId}`}
                          type="number"
                          value={item.stake}
                          onChange={(e) => updateStake(item.marketId, Number(e.target.value) || 0)}
                          className="pl-7"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="text-sm text-foreground-muted whitespace-nowrap">
                        Win: ${(item.stake * item.currentOdds).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div className="glass-card border-accent-cyan/20">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Total Stake:</span>
                    <span className="font-medium">${totalStake.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Potential Payout:</span>
                    <span className="font-medium">${potentialPayout.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2">
                    <span className="text-foreground-muted">Potential Profit:</span>
                    <span className={cn(
                      "font-bold",
                      potentialProfit > 0 ? "text-success" : "text-error"
                    )}>
                      ${potentialProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {betSlipItems.length > 0 && (
          <div className="border-t border-white/10 p-4">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={clearBetSlip}
                className="flex-1"
                disabled={isSubmitting}
              >
                Clear All
              </Button>
              <Button
                onClick={handleSubmitBets}
                disabled={isSubmitting || totalStake === 0}
                className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  `${demoMode ? 'Simulate' : 'Place'} Bets ($${totalStake.toFixed(2)})`
                )}
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}