import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { toast } from '@/components/ui/use-toast';
import { onBetsChange, getAllBets, startBetsSimulator, DummyBet } from '@/features/bets/mock-db';
import { getCurrentUser, signOut } from '@/features/auth/mock';

type AdminStats = {
  totalPlayers: number;
  activePlayers: number;
  totalBets: number;
  volume24h: number;
  pnl24h: number;
};

type AdminBet = {
  id: string;
  wallet: string;
  marketTitle: string;
  outcome: string;
  stake: number;
  odds: number;
  status: 'pending' | 'confirmed' | 'failed' | 'won' | 'lost';
  placedAt: string;
  txId?: string;
};

// Placeholder data source — to be replaced with Supabase or your backend
async function fetchAdminStats(): Promise<AdminStats> {
  return {
    totalPlayers: 1287,
    activePlayers: 214,
    totalBets: 9821,
    volume24h: 43125,
    pnl24h: 2175,
  };
}

async function fetchRecentBets(q?: string): Promise<AdminBet[]> {
  const demo: AdminBet[] = Array.from({ length: 25 }).map((_, i) => ({
    id: `bet_${i + 1}`,
    wallet: `0x${(Math.random().toString(16).slice(2) + '0'.repeat(40)).slice(0, 40)}`,
    marketTitle: ['El Clasico', 'US Election', 'BTC > 70k'][i % 3],
    outcome: ['Home', 'Away', 'Yes'][i % 3],
    stake: Math.round(Math.random() * 1000) / 10,
    odds: Math.round((1.2 + Math.random() * 4) * 100) / 100,
    status: (['pending', 'confirmed', 'failed', 'won', 'lost'] as const)[i % 5],
    placedAt: new Date(Date.now() - i * 3600_000).toISOString(),
    txId: Math.random() > 0.5 ? `0x${Math.random().toString(16).slice(2)}` : undefined,
  }));
  return q ? demo.filter((b) => b.wallet.includes(q) || b.marketTitle.toLowerCase().includes(q.toLowerCase())) : demo;
}

export default function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bets, setBets] = useState<AdminBet[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    startBetsSimulator();
    (async () => {
      try {
        const [s, b] = await Promise.all([fetchAdminStats(), fetchRecentBets()]);
        if (!mounted) return;
        setStats(s);
        setBets(b);
      } catch (e: any) {
        toast({ title: 'Failed to load admin data', description: e?.message || 'Unexpected error', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
    const interval = setInterval(async () => {
      const [s, b] = await Promise.all([fetchAdminStats(), fetchRecentBets(query || undefined)]);
      setStats(s);
      setBets(b);
    }, 10_000);
    const unsub = onBetsChange(() => {
      // reflect dummy bets in the table alongside fetchRecentBets
      const bets = getAllBets();
      const recent: AdminBet[] = bets.slice(0, 25).map(b => ({
        id: b.id,
        wallet: '0x...' ,
        marketTitle: b.marketTitle,
        outcome: b.outcomeLabel,
        stake: b.stake,
        odds: b.odds,
        status: (b.status === 'pending' || b.status === 'confirmed' || b.status === 'active') ? 'confirmed' : (b.status as any),
        placedAt: b.placedAt,
        txId: undefined,
      }));
      setBets(prev => {
        const merged = [...recent, ...prev];
        // de-dup by id
        const seen = new Set<string>();
        const dedup = merged.filter(b => (seen.has(b.id) ? false : (seen.add(b.id), true)));
        return dedup.slice(0, 50);
      });
    });
    return () => { mounted = false; clearInterval(interval); };
  }, [query]);

  const chartData = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({
    hour: `${i}:00`,
    volume: Math.round((Math.sin(i / 3) + 1.2) * 5000 + Math.random() * 800),
  })), []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">ADMIN</h1>
            <div className="flex items-center gap-2">
              <Input placeholder="Search wallet or market..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <Button onClick={() => setQuery('')}>Clear</Button>
              {getCurrentUser() && (
                <Button variant="outline" onClick={async () => { await signOut(); window.location.href = '/'; }}>Sign Out</Button>
              )}
            </div>
          </div>
          <p className="text-foreground-muted">Real-time overview of players, bets and volumes</p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bets">Bets</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader><CardTitle>Total Players</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold">{stats?.totalPlayers ?? '—'}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Active Players</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold">{stats?.activePlayers ?? '—'}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Total Bets</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold">{stats?.totalBets ?? '—'}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>24h Volume ($)</CardTitle></CardHeader>
                <CardContent className="text-2xl font-bold">{stats?.volume24h?.toLocaleString() ?? '—'}</CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Volume (last 24h)</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={{ volume: { label: 'Volume', color: 'hsl(var(--accent-cyan))' } }}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" hide />
                    <YAxis hide />
                    <Area dataKey="volume" type="monotone" stroke="var(--color-volume)" fill="var(--color-volume)" fillOpacity={0.2} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bets" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Recent Bets</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-foreground-muted">
                        <th className="py-2">Bet ID</th>
                        <th className="py-2">Wallet</th>
                        <th className="py-2">Market</th>
                        <th className="py-2">Outcome</th>
                        <th className="py-2">Stake</th>
                        <th className="py-2">Odds</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Placed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bets.map((b) => (
                        <tr key={b.id} className="border-t border-white/10">
                          <td className="py-2 font-mono">{b.id}</td>
                          <td className="py-2 font-mono truncate max-w-[140px]">{b.wallet}</td>
                          <td className="py-2">{b.marketTitle}</td>
                          <td className="py-2">{b.outcome}</td>
                          <td className="py-2">${b.stake.toFixed(2)}</td>
                          <td className="py-2">{b.odds.toFixed(2)}x</td>
                          <td className="py-2">{b.status.toUpperCase()}</td>
                          <td className="py-2">{new Date(b.placedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Players</CardTitle></CardHeader>
              <CardContent>
                <p className="text-foreground-muted">Integrate with your backend (Supabase/Postgres) to list players, cohorts and activity.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}


