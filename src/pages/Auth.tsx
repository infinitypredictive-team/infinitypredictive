import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signOut, getCurrentUser, onAuthChange } from '@/features/auth/mock';

type Role = 'admin' | 'user';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup' && password !== confirm) {
        toast({ title: 'Passwords do not match', variant: 'destructive' });
        return;
      }
      const res = mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password);
      if (!res?.role) {
        toast({ title: mode === 'signin' ? 'Login failed' : 'Sign up failed', description: 'Invalid input', variant: 'destructive' });
        return;
      }
      toast({ title: mode === 'signin' ? 'Welcome back' : 'Account created', description: mode === 'signin' ? `Signed in as ${res.role}` : 'You are signed in' });
      // Role-based redirect
      // Use full reload to avoid any stale routing state
      window.location.href = res.role === 'admin' ? '/admin' : '/dashboard';
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Unexpected error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto glass-card">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h1>
            <button
              className="text-sm text-accent-cyan hover:underline"
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' ? 'Create account' : 'Have an account? Sign in'}
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {mode === 'signup' && (
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>
          <p className="text-xs text-foreground-muted mt-3">Use an email with "admin" in the name (e.g., admin@example.com or user+admin@example.com) to preview the admin redirect. In production this is driven by real roles from your auth backend.</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}


