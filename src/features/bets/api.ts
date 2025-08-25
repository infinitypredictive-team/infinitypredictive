import { z } from 'zod';

// Bet-related schemas
export const BetRequestSchema = z.object({
  marketId: z.string(),
  outcomeId: z.string(),
  stake: z.number().positive(),
  odds: z.number().positive(),
  walletAddress: z.string().optional(),
});

export const BetReceiptSchema = z.object({
  receiptId: z.string(),
  txId: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'failed']),
  timestamp: z.number(),
  marketId: z.string(),
  outcomeId: z.string(),
  stake: z.number(),
  odds: z.number(),
  potentialPayout: z.number(),
});

export const UserBetSchema = z.object({
  id: z.string(),
  marketId: z.string(),
  marketTitle: z.string(),
  outcomeId: z.string(),
  outcomeLabel: z.string(),
  stake: z.number(),
  odds: z.number(),
  potentialPayout: z.number(),
  status: z.enum(['active', 'won', 'lost', 'cancelled']),
  placedAt: z.string(),
  settledAt: z.string().optional(),
  actualPayout: z.number().optional(),
});

export type BetRequest = z.infer<typeof BetRequestSchema>;
export type BetReceipt = z.infer<typeof BetReceiptSchema>;
export type UserBet = z.infer<typeof UserBetSchema>;

// Mock user bets for demo
const MOCK_USER_BETS: UserBet[] = [
  {
    id: 'bet_1',
    marketId: '1',
    marketTitle: 'Real Madrid vs Barcelona - El Clasico Winner',
    outcomeId: '1a',
    outcomeLabel: 'Real Madrid',
    stake: 50,
    odds: 2.1,
    potentialPayout: 105,
    status: 'active',
    placedAt: '2024-08-14T10:30:00Z',
  },
  {
    id: 'bet_2',
    marketId: '3',
    marketTitle: 'Bitcoin Price End of August 2024',
    outcomeId: '3a',
    outcomeLabel: 'Above $70,000',
    stake: 25,
    odds: 2.8,
    potentialPayout: 70,
    status: 'active',
    placedAt: '2024-08-13T15:45:00Z',
  },
  {
    id: 'bet_3',
    marketId: '6',
    marketTitle: 'Champions League 2024 Winner',
    outcomeId: '6a',
    outcomeLabel: 'Manchester City',
    stake: 100,
    odds: 3.1,
    potentialPayout: 310,
    status: 'won',
    placedAt: '2024-05-15T09:20:00Z',
    settledAt: '2024-06-01T22:30:00Z',
    actualPayout: 310,
  },
  {
    id: 'bet_4',
    marketId: '5',
    marketTitle: 'Will Doge Coin Reach $1 in 2024?',
    outcomeId: '5a',
    outcomeLabel: 'Yes',
    stake: 10,
    odds: 4.5,
    potentialPayout: 45,
    status: 'lost',
    placedAt: '2024-07-20T14:15:00Z',
    settledAt: '2024-08-01T00:00:00Z',
    actualPayout: 0,
  },
];

// User bets API
export const betsApi = {
  async getUserBets(walletAddress?: string): Promise<UserBet[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!walletAddress) {
      // Return demo data for non-connected users
      return MOCK_USER_BETS;
    }
    
    // In real implementation, fetch user's actual bets
    // For now, return mock data
    return MOCK_USER_BETS;
  },

  async getActiveBets(walletAddress?: string): Promise<UserBet[]> {
    const allBets = await this.getUserBets(walletAddress);
    return allBets.filter(bet => bet.status === 'active');
  },

  async getBetHistory(walletAddress?: string): Promise<UserBet[]> {
    const allBets = await this.getUserBets(walletAddress);
    return allBets.filter(bet => ['won', 'lost', 'cancelled'].includes(bet.status));
  },

  async getBetById(betId: string): Promise<UserBet | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return MOCK_USER_BETS.find(bet => bet.id === betId) || null;
  },

  // Export bets to CSV
  exportBetsToCSV(bets: UserBet[]): string {
    const headers = [
      'Bet ID',
      'Market',
      'Outcome',
      'Stake',
      'Odds',
      'Potential Payout',
      'Status',
      'Placed At',
      'Settled At',
      'Actual Payout'
    ];

    const rows = bets.map(bet => [
      bet.id,
      bet.marketTitle,
      bet.outcomeLabel,
      bet.stake.toString(),
      bet.odds.toString(),
      bet.potentialPayout.toString(),
      bet.status,
      bet.placedAt,
      bet.settledAt || '',
      bet.actualPayout?.toString() || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  },

  // Download CSV file
  downloadBetsCSV(bets: UserBet[], filename: string = 'my-bets.csv') {
    const csvContent = this.exportBetsToCSV(bets);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

// Bet calculation utilities
export const betMath = {
  // Calculate potential payout (stake × odds)
  calculatePayout(stake: number, odds: number): number {
    return stake * odds;
  },

  // Calculate potential profit (payout - stake)
  calculateProfit(stake: number, odds: number): number {
    return this.calculatePayout(stake, odds) - stake;
  },

  // Calculate implied probability from decimal odds
  calculateImpliedProbability(odds: number): number {
    return 1 / odds;
  },

  // Calculate break-even win rate
  calculateBreakEvenRate(odds: number): number {
    return this.calculateImpliedProbability(odds) * 100;
  },

  // Format currency values
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  // Format odds display
  formatOdds(odds: number): string {
    return `${odds.toFixed(2)}x`;
  },

  // Calculate total portfolio value
  calculatePortfolioValue(bets: UserBet[]): {
    totalStaked: number;
    activeBets: number;
    potentialWinnings: number;
    realizedPnL: number;
  } {
    const activeBets = bets.filter(bet => bet.status === 'active');
    const settledBets = bets.filter(bet => ['won', 'lost', 'cancelled'].includes(bet.status));

    const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0);
    const activeBetsCount = activeBets.length;
    const potentialWinnings = activeBets.reduce((sum, bet) => sum + bet.potentialPayout, 0);
    const realizedPnL = settledBets.reduce((sum, bet) => {
      const payout = bet.actualPayout || 0;
      return sum + (payout - bet.stake);
    }, 0);

    return {
      totalStaked,
      activeBets: activeBetsCount,
      potentialWinnings,
      realizedPnL,
    };
  }
};