import { z } from 'zod';

// Base Azuro response types
export const AzuroMarketStatusSchema = z.enum(['Created', 'Active', 'Suspended', 'Resolved', 'Canceled']);
export const AzuroConditionStatusSchema = z.enum(['Created', 'Active', 'Suspended', 'Resolved', 'Canceled']);

export const MarketStatusSchema = z.enum(['scheduled', 'live', 'settled', 'suspended']);
export const MarketCategorySchema = z.enum(['sports', 'elections', 'crypto', 'entertainment', 'memes']);

// Azuro API response schemas for validation
export const AzuroMarketSummarySchema = z.object({
  id: z.string(),
  gameId: z.string(),
  title: z.string(),
  startsAt: z.coerce.date(),
  status: AzuroMarketStatusSchema,
  sport: z.object({
    name: z.string(),
    slug: z.string(),
  }),
  league: z.object({
    name: z.string(),
    slug: z.string(),
  }),
  conditions: z.array(z.object({
    id: z.string(),
    status: AzuroConditionStatusSchema,
    outcomes: z.array(z.object({
      id: z.string(),
      name: z.string(),
      odds: z.string(), // Azuro returns as string, needs parsing
    })),
  })),
  liquidity: z.string().optional(), // Azuro returns as string
});

export const AzuroMarketDetailSchema = AzuroMarketSummarySchema.extend({
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const AzuroOddsSchema = z.object({
  outcomeId: z.string(),
  odds: z.string(), // Azuro format
});

export const AzuroLiquiditySchema = z.object({
  total: z.string(), // Azuro format
  depth: z.array(z.object({
    price: z.string(),
    size: z.string(),
  })).optional(),
});

// UI-friendly types (mapped from Azuro)
export const MarketSummarySchema = z.object({
  id: z.string(),
  category: MarketCategorySchema,
  title: z.string(),
  startsAt: z.string(), // ISO string for UI
  status: MarketStatusSchema,
  topOdds: z.number().optional(),
  liquidity: z.number().optional(),
  outcomes: z.array(z.object({
    id: z.string(),
    label: z.string(),
    odds: z.number(),
  })).optional(),
});

export const MarketDetailSchema = MarketSummarySchema.extend({
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const OddsUpdateSchema = z.object({
  outcomeId: z.string(),
  odds: z.number(),
  timestamp: z.number(),
});

export const LiquidityDataSchema = z.object({
  total: z.number(),
  depth: z.array(z.object({
    price: z.number(),
    size: z.number(),
  })).optional(),
});

// Export inferred types
export type AzuroMarketSummary = z.infer<typeof AzuroMarketSummarySchema>;
export type AzuroMarketDetail = z.infer<typeof AzuroMarketDetailSchema>;
export type AzuroOddsUpdate = z.infer<typeof AzuroOddsSchema>;
export type AzuroLiquidityData = z.infer<typeof AzuroLiquiditySchema>;

export type MarketSummary = z.infer<typeof MarketSummarySchema>;
export type MarketDetail = z.infer<typeof MarketDetailSchema>;
export type OddsUpdate = z.infer<typeof OddsUpdateSchema>;
export type LiquidityData = z.infer<typeof LiquidityDataSchema>;

// API request/response types
export interface GetMarketsParams {
  category?: string;
  q?: string;
  page?: number;
  sort?: 'liquidity' | 'odds' | 'time';
  limit?: number;
}

export interface GetMarketsResponse {
  items: MarketSummary[];
  nextPage?: number;
  total: number;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  isRetryable: boolean;
}

// Mapping functions
export function mapAzuroToUIStatus(azuroStatus: string): 'scheduled' | 'live' | 'settled' | 'suspended' {
  switch (azuroStatus) {
    case 'Created':
      return 'scheduled';
    case 'Active':
      return 'live';
    case 'Resolved':
      return 'settled';
    case 'Suspended':
    case 'Canceled':
      return 'suspended';
    default:
      return 'scheduled';
  }
}

export function mapSportToCategory(sportSlug: string): 'sports' | 'elections' | 'crypto' | 'entertainment' | 'memes' {
  // Map Azuro sport slugs to our UI categories
  const sportMappings: Record<string, 'sports' | 'elections' | 'crypto' | 'entertainment' | 'memes'> = {
    'football': 'sports',
    'soccer': 'sports',
    'basketball': 'sports',
    'tennis': 'sports',
    'baseball': 'sports',
    'hockey': 'sports',
    'politics': 'elections',
    'cryptocurrency': 'crypto',
    'bitcoin': 'crypto',
    'ethereum': 'crypto',
    'entertainment': 'entertainment',
    'movies': 'entertainment',
    'tv': 'entertainment',
    'memes': 'memes',
    'doge': 'memes',
  };
  
  return sportMappings[sportSlug.toLowerCase()] || 'sports';
}

export function mapAzuroMarket(azuroMarket: AzuroMarketSummary): MarketSummary {
  const topCondition = azuroMarket.conditions[0];
  const outcomes = topCondition?.outcomes.map(outcome => ({
    id: outcome.id,
    label: outcome.name,
    odds: parseFloat(outcome.odds),
  })) || [];

  return {
    id: azuroMarket.id,
    category: mapSportToCategory(azuroMarket.sport.slug),
    title: azuroMarket.title,
    startsAt: azuroMarket.startsAt.toISOString(),
    status: mapAzuroToUIStatus(azuroMarket.status),
    topOdds: outcomes.length > 0 ? Math.max(...outcomes.map(o => o.odds)) : undefined,
    liquidity: azuroMarket.liquidity ? parseFloat(azuroMarket.liquidity) : undefined,
    outcomes,
  };
}