import { 
  MarketSummary, 
  MarketDetail, 
  GetMarketsParams, 
  GetMarketsResponse,
  OddsUpdate,
  LiquidityData,
  AzuroMarketSummarySchema,
  AzuroMarketDetailSchema,
  AzuroOddsSchema,
  AzuroLiquiditySchema,
  mapAzuroMarket,
  ApiError
} from './types';
import { toast } from '@/components/ui/use-toast';
import { addBet } from '@/features/bets/mock-db';

// Environment configuration - default to real APIs in production, mocks only in dev unless explicitly enabled
const USE_MOCKS = import.meta.env.PROD ? (import.meta.env.VITE_USE_MOCKS === 'true') : (import.meta.env.VITE_USE_MOCKS !== 'false');
const AZURO_API_URL = import.meta.env.VITE_AZURO_API_URL || 'https://api.azuro.org/v1';
const API_KEY = import.meta.env.VITE_AZURO_API_KEY;

// API request headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
});

// Mock data for development (keep existing)
const MOCK_MARKETS: MarketSummary[] = [
  {
    id: '1',
    category: 'sports',
    title: 'Real Madrid vs Barcelona - El Clasico Winner',
    startsAt: '2024-08-20T20:00:00Z',
    status: 'live',
    topOdds: 2.1,
    liquidity: 125000,
    outcomes: [
      { id: '1a', label: 'Real Madrid', odds: 2.1 },
      { id: '1b', label: 'Barcelona', odds: 1.8 },
      { id: '1c', label: 'Draw', odds: 3.2 }
    ]
  },
  {
    id: '2',
    category: 'elections',
    title: '2024 US Presidential Election Winner',
    startsAt: '2024-11-05T00:00:00Z',
    status: 'scheduled',
    topOdds: 1.9,
    liquidity: 2500000,
    outcomes: [
      { id: '2a', label: 'Democratic Candidate', odds: 1.9 },
      { id: '2b', label: 'Republican Candidate', odds: 2.0 }
    ]
  },
  {
    id: '3',
    category: 'crypto',
    title: 'Bitcoin Price End of August 2024',
    startsAt: '2024-08-31T23:59:00Z',
    status: 'live',
    topOdds: 2.8,
    liquidity: 890000,
    outcomes: [
      { id: '3a', label: 'Above $70,000', odds: 2.8 },
      { id: '3b', label: 'Below $70,000', odds: 1.4 }
    ]
  },
  {
    id: '4',
    category: 'entertainment',
    title: 'Next Marvel Movie Box Office Opening Weekend',
    startsAt: '2024-09-15T00:00:00Z',
    status: 'scheduled',
    topOdds: 1.6,
    liquidity: 450000,
    outcomes: [
      { id: '4a', label: 'Over $200M', odds: 1.6 },
      { id: '4b', label: 'Under $200M', odds: 2.4 }
    ]
  },
  {
    id: '5',
    category: 'memes',
    title: 'Will Doge Coin Reach $1 in 2024?',
    startsAt: '2024-12-31T23:59:00Z',
    status: 'scheduled',
    topOdds: 4.5,
    liquidity: 180000,
    outcomes: [
      { id: '5a', label: 'Yes', odds: 4.5 },
      { id: '5b', label: 'No', odds: 1.2 }
    ]
  },
  {
    id: '6',
    category: 'sports',
    title: 'Champions League 2024 Winner',
    startsAt: '2024-06-01T00:00:00Z',
    status: 'scheduled',
    topOdds: 3.2,
    liquidity: 1200000,
    outcomes: [
      { id: '6a', label: 'Manchester City', odds: 2.1 },
      { id: '6b', label: 'Real Madrid', odds: 3.2 },
      { id: '6c', label: 'Bayern Munich', odds: 4.0 },
      { id: '6d', label: 'PSG', odds: 5.5 }
    ]
  },
  {
    id: '7',
    category: 'crypto',
    title: 'Ethereum Price Prediction - End of 2024',
    startsAt: '2024-12-31T23:59:00Z',
    status: 'scheduled',
    topOdds: 2.5,
    liquidity: 750000,
    outcomes: [
      { id: '7a', label: 'Above $5,000', odds: 2.5 },
      { id: '7b', label: 'Below $5,000', odds: 1.7 }
    ]
  },
  {
    id: '8',
    category: 'entertainment',
    title: 'Oscar Best Picture 2024 Winner',
    startsAt: '2024-03-10T00:00:00Z',
    status: 'scheduled',
    topOdds: 2.8,
    liquidity: 320000,
    outcomes: [
      { id: '8a', label: 'Oppenheimer', odds: 1.4 },
      { id: '8b', label: 'Barbie', odds: 2.8 },
      { id: '8c', label: 'Killers of the Flower Moon', odds: 4.2 },
      { id: '8d', label: 'Other', odds: 8.0 }
    ]
  }
];

// Custom error class for API errors
export class AzuroApiError extends Error implements ApiError {
  constructor(
    message: string,
    public code?: string,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'AzuroApiError';
  }
}

// Generic API response handler
async function handleApiResponse(response: Response): Promise<any> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }
    
    throw new AzuroApiError(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      errorData.code,
      response.status >= 500
    );
  }
  
  return response.json();
}

// Real Azuro API implementations
async function fetchMarketsFromAzuro(params: GetMarketsParams = {}): Promise<GetMarketsResponse> {
  const searchParams = new URLSearchParams();
  if (params.category && params.category !== 'all') searchParams.append('category', params.category);
  if (params.q) searchParams.append('q', params.q);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.sort) searchParams.append('sort', params.sort);
  
  const response = await fetch(`${AZURO_API_URL}/games?${searchParams}`, { 
    headers: getHeaders() 
  });
  const data = await handleApiResponse(response);
  
  const apiData = data as any;
  const markets = apiData.games?.map((market: any) => {
    const validated = AzuroMarketSummarySchema.parse(market);
    return mapAzuroMarket(validated);
  }) || [];
  
  return {
    items: markets,
    nextPage: apiData.nextPage,
    total: apiData.total || markets.length
  };
}

async function fetchMarketByIdFromAzuro(id: string): Promise<MarketDetail | null> {
  const response = await fetch(`${AZURO_API_URL}/games/${id}`, { 
    headers: getHeaders() 
  });
  const data = await handleApiResponse(response);
  
  const validated = AzuroMarketDetailSchema.parse(data);
  return mapAzuroMarket(validated);
}

async function fetchOddsFromAzuro(marketId: string): Promise<OddsUpdate[]> {
  const response = await fetch(`${AZURO_API_URL}/games/${marketId}/odds`, { 
    headers: getHeaders() 
  });
  const data = await handleApiResponse(response);
  
  const apiData = data as any;
  return apiData.odds?.map((odds: any) => {
    const validated = AzuroOddsSchema.parse(odds);
    return {
      outcomeId: validated.outcomeId,
      odds: parseFloat(validated.odds),
      timestamp: Date.now(),
    };
  }) || [];
}

async function fetchLiquidityFromAzuro(marketId: string): Promise<LiquidityData> {
  const response = await fetch(`${AZURO_API_URL}/games/${marketId}/liquidity`, { 
    headers: getHeaders() 
  });
  const data = await handleApiResponse(response);
  
  const validated = AzuroLiquiditySchema.parse(data);
  
  return {
    total: parseFloat(validated.total),
    depth: validated.depth?.map(d => ({
      price: parseFloat(d.price),
      size: parseFloat(d.size),
    })),
  };
}

// Bet placement types
export interface PlaceBetRequest {
  marketId: string;
  outcomeId: string;
  stake: number;
  odds: number;
  walletAddress?: string;
}

export interface BetReceipt {
  receiptId: string;
  txId?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

async function placeBetWithAzuro(request: PlaceBetRequest): Promise<BetReceipt> {
  const response = await fetch(`${AZURO_API_URL}/bets`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      gameId: request.marketId,
      outcomeId: request.outcomeId,
      amount: request.stake.toString(),
      odds: request.odds.toString(),
      address: request.walletAddress,
    }),
  });
  
  const data = await handleApiResponse(response);
  const apiData = data as any;
  
  return {
    receiptId: apiData.id,
    txId: apiData.transactionId,
    status: apiData.status || 'pending',
    timestamp: Date.now(),
  };
}

// Mock API implementation
async function getMockMarkets(params: GetMarketsParams = {}): Promise<GetMarketsResponse> {
  console.log('🔍 getMockMarkets called with params:', params);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filtered = [...MOCK_MARKETS];
  
  console.log('📊 Mock API Debug:', {
    totalMarkets: MOCK_MARKETS.length,
    params,
    initialFiltered: filtered.length
  });
  
  // Filter by category - only filter if category is specified and not 'all'
  if (params.category && params.category !== 'all') {
    filtered = filtered.filter(m => m.category === params.category);
    console.log('📊 After category filter:', {
      category: params.category,
      filteredCount: filtered.length,
      markets: filtered.map(m => ({ id: m.id, title: m.title, category: m.category }))
    });
  } else {
    console.log('📊 No category filter applied (showing all markets)');
  }
  
  // Search filter
  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(m => 
      m.title.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query)
    );
    console.log('🔎 After search filter:', {
      query: params.q,
      filteredCount: filtered.length
    });
  }
  
  // Sort
  if (params.sort === 'liquidity') {
    filtered.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
  } else if (params.sort === 'odds') {
    filtered.sort((a, b) => (b.topOdds || 0) - (a.topOdds || 0));
  } else if (params.sort === 'time') {
    filtered.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }
  
  // Pagination
  const page = params.page || 1;
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);
  
  console.log('📄 Pagination result:', {
    page,
    pageSize,
    start,
    end,
    totalFiltered: filtered.length,
    itemsReturned: items.length,
    hasNextPage: end < filtered.length
  });
  
  const result = {
    items,
    nextPage: end < filtered.length ? page + 1 : undefined,
    total: filtered.length
  };
  
  console.log('✅ Returning result:', {
    itemsCount: result.items.length,
    total: result.total,
    hasNextPage: !!result.nextPage
  });
  
  return result;
}

async function getMockMarketById(id: string): Promise<MarketDetail | null> {
  console.log('🔍 getMockMarketById called with id:', id);
  console.log('📊 Available mock markets:', MOCK_MARKETS.map(m => ({ id: m.id, title: m.title })));
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const market = MOCK_MARKETS.find(m => m.id === id);
  console.log('🎯 Found market:', market ? { id: market.id, title: market.title } : 'NOT FOUND');
  
  if (!market) {
    console.log('❌ Market not found in mock data');
    return null;
  }
  
  const result = {
    ...market,
    outcomes: market.outcomes || []
  };
  
  console.log('✅ Returning market:', {
    id: result.id,
    title: result.title,
    outcomesCount: result.outcomes.length
  });
  
  return result;
}

async function getMockOdds(marketId: string): Promise<OddsUpdate[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const market = MOCK_MARKETS.find(m => m.id === marketId);
  if (!market?.outcomes) return [];
  
  // Add some random variance to simulate live odds
  return market.outcomes.map(outcome => ({
    outcomeId: outcome.id,
    odds: outcome.odds * (0.95 + Math.random() * 0.1), // ±5% variance
    timestamp: Date.now(),
  }));
}

async function getMockLiquidity(marketId: string): Promise<LiquidityData> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const market = MOCK_MARKETS.find(m => m.id === marketId);
  if (!market) return { total: 0 };
  
  return {
    total: market.liquidity || 0,
    depth: [
      { price: 1.8, size: 50000 },
      { price: 1.9, size: 75000 },
      { price: 2.0, size: 100000 },
      { price: 2.1, size: 80000 },
      { price: 2.2, size: 45000 }
    ]
  };
}

async function placeMockBet(request: PlaceBetRequest): Promise<BetReceipt> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate occasional failures for testing
  if (Math.random() < 0.1) {
    throw new AzuroApiError('Insufficient liquidity', 'INSUFFICIENT_LIQUIDITY', true);
  }
  
  return {
    receiptId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    status: 'confirmed',
    timestamp: Date.now(),
  };
}

// Main API interface - switches between mock and real based on env
export const marketsApi = {
  async getMarkets(params: GetMarketsParams = {}): Promise<GetMarketsResponse> {
    try {
      console.log('Using mocks:', USE_MOCKS); // Debug log
      return USE_MOCKS ? await getMockMarkets(params) : await fetchMarketsFromAzuro(params);
    } catch (error) {
      console.error('Failed to fetch markets:', error);
      // Fallback to mocks if real API fails
      if (!USE_MOCKS) {
        console.log('Falling back to mock data due to API error');
        return await getMockMarkets(params);
      }
      throw error instanceof AzuroApiError ? error : new AzuroApiError('Failed to fetch markets', undefined, true);
    }
  },

  async getMarketById(id: string): Promise<MarketDetail | null> {
    try {
      return USE_MOCKS ? await getMockMarketById(id) : await fetchMarketByIdFromAzuro(id);
    } catch (error) {
      console.error('Failed to fetch market:', error);
      if (!USE_MOCKS) {
        return await getMockMarketById(id);
      }
      throw error instanceof AzuroApiError ? error : new AzuroApiError('Failed to fetch market details', undefined, true);
    }
  },

  async getOdds(marketId: string): Promise<OddsUpdate[]> {
    try {
      return USE_MOCKS ? await getMockOdds(marketId) : await fetchOddsFromAzuro(marketId);
    } catch (error) {
      console.error('Failed to fetch odds:', error);
      if (!USE_MOCKS) {
        return await getMockOdds(marketId);
      }
      throw error instanceof AzuroApiError ? error : new AzuroApiError('Failed to fetch odds', undefined, true);
    }
  },

  async getLiquidity(marketId: string): Promise<LiquidityData> {
    try {
      return USE_MOCKS ? await getMockLiquidity(marketId) : await fetchLiquidityFromAzuro(marketId);
    } catch (error) {
      console.error('Failed to fetch liquidity:', error);
      if (!USE_MOCKS) {
        return await getMockLiquidity(marketId);
      }
      throw error instanceof AzuroApiError ? error : new AzuroApiError('Failed to fetch liquidity', undefined, true);
    }
  },

  async placeBet(request: PlaceBetRequest): Promise<BetReceipt> {
    try {
      return USE_MOCKS ? await placeMockBet(request) : await placeBetWithAzuro(request);
    } catch (error) {
      console.error('Failed to place bet:', error);
      throw error instanceof AzuroApiError ? error : new AzuroApiError('Failed to place bet', undefined, false);
    }
  },
};

// TanStack Query key factory
export const marketKeys = {
  all: ['markets'] as const,
  lists: () => [...marketKeys.all, 'list'] as const,
  list: (params: GetMarketsParams) => [...marketKeys.lists(), params] as const,
  details: () => [...marketKeys.all, 'detail'] as const,
  detail: (id: string) => [...marketKeys.details(), id] as const,
  odds: (id: string) => [...marketKeys.all, 'odds', id] as const,
  liquidity: (id: string) => [...marketKeys.all, 'liquidity', id] as const,
};