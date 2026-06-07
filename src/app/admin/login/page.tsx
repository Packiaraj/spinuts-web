'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xl mb-1" style={{ color: '#1B4332', fontWeight: 500, letterSpacing: '0.05em' }}>SPINUTS</p>
          <p className="label-tag text-gray-400">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 space-y-4"
          style={{ border: '0.5px solid rgba(0,0,0,0.10)' }}>
          <div>
            <label className="label-tag text-gray-500 block mb-1">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm py-2.5 px-3"
              style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label-tag text-gray-500 block mb-1">Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm py-2.5 px-3"
              style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs py-2 px-3" style={{ backgroundColor: '#fff5f5', border: '0.5px solid #fcc' }}>
              {error}
            </p>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 label-tag transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Restricted access — SpiNuts admin only
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }} />}>
      <LoginForm />
    </Suspense>
  );
}
