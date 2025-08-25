import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Market types
export type MarketStatus = 'scheduled' | 'live' | 'settled' | 'suspended';
export type MarketCategory = 'sports' | 'elections' | 'crypto' | 'entertainment' | 'memes';

export interface MarketSummary {
  id: string;
  category: MarketCategory;
  title: string;
  startsAt: string;
  status: MarketStatus;
  topOdds?: number;
  liquidity?: number;
  outcomes?: { id: string; label: string; odds: number }[];
}

export interface BetSlipItem {
  marketId: string;
  outcomeId: string;
  outcomeLabel: string;
  marketTitle: string;
  currentOdds: number;
  stake: number;
}

// UI State Store
interface UIStore {
  // Bet slip
  betSlipItems: BetSlipItem[];
  betSlipOpen: boolean;
  addToBetSlip: (item: Omit<BetSlipItem, 'stake'>) => void;
  removeFromBetSlip: (marketId: string) => void;
  updateStake: (marketId: string, stake: number) => void;
  setBetSlipOpen: (open: boolean) => void;
  clearBetSlip: () => void;

  // Feature flags
  features: {
    leaderboards: boolean;
    tournaments: boolean;
    tracker: boolean;
    rewards: boolean;
  };

  // Navigation
  activeCategory: MarketCategory | 'all';
  setActiveCategory: (category: MarketCategory | 'all') => void;

  // Demo mode
  demoMode: boolean;
  setDemoMode: (demo: boolean) => void;
}

// Parse feature flags from environment (e.g., "leaderboards:true,tournaments:false,tracker:true,rewards:false")
function parseFeatureFlags(): { leaderboards: boolean; tournaments: boolean; tracker: boolean; rewards: boolean } {
	const flagsString = (import.meta as any)?.env?.VITE_FEATURE_FLAGS as string | undefined;
	const defaults = { leaderboards: false, tournaments: false, tracker: false, rewards: false };
	if (!flagsString || typeof flagsString !== 'string') {
		return defaults;
	}
	const entries = flagsString.split(',').map(pair => pair.trim()).filter(Boolean);
	const parsed: Record<string, boolean> = {};
	for (const entry of entries) {
		const [key, value] = entry.split(':').map(s => s?.trim());
		if (!key) continue;
		parsed[key] = String(value).toLowerCase() === 'true';
	}
	return {
		leaderboards: parsed.leaderboards ?? defaults.leaderboards,
		tournaments: parsed.tournaments ?? defaults.tournaments,
		tracker: parsed.tracker ?? defaults.tracker,
		rewards: parsed.rewards ?? defaults.rewards,
	};
}

export const useUIStore = create<UIStore>()(
  subscribeWithSelector((set, get) => ({
    // Bet slip state
    betSlipItems: [],
    betSlipOpen: false,

    addToBetSlip: (item) => {
      const { betSlipItems } = get();
      const existingIndex = betSlipItems.findIndex((i) => i.marketId === item.marketId);
      
      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...betSlipItems];
        newItems[existingIndex] = { ...item, stake: newItems[existingIndex].stake };
        set({ betSlipItems: newItems });
      } else {
        // Add new item
        set({ 
          betSlipItems: [...betSlipItems, { ...item, stake: 10 }],
          betSlipOpen: true 
        });
      }
    },

    removeFromBetSlip: (marketId) => {
      set((state) => ({
        betSlipItems: state.betSlipItems.filter((item) => item.marketId !== marketId)
      }));
    },

    updateStake: (marketId, stake) => {
      set((state) => ({
        betSlipItems: state.betSlipItems.map((item) => 
          item.marketId === marketId ? { ...item, stake } : item
        )
      }));
    },

    setBetSlipOpen: (open) => set({ betSlipOpen: open }),
    clearBetSlip: () => set({ betSlipItems: [], betSlipOpen: false }),

    // Feature flags - read from env
    features: parseFeatureFlags(),

    // Navigation
    activeCategory: 'all',
    setActiveCategory: (category) => set({ activeCategory: category }),

    // Demo mode
    demoMode: true, // Default to demo mode
    setDemoMode: (demo) => set({ demoMode: demo }),
  }))
);

// Wallet store
interface WalletStore {
  connected: boolean;
  address?: string;
  network?: string;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  connected: false,
  address: undefined,
  network: undefined,

  connect: async () => {
    // Mock wallet connection for demo
    set({
      connected: true,
      address: '0x1234...5678',
      network: 'polygon',
    });
  },

  disconnect: () => {
    set({
      connected: false,
      address: undefined,
      network: undefined,
    });
  },
}));