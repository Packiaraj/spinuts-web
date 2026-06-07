'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
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
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xl font-medium mb-1" style={{ color: '#1B4332', fontWeight: 500 }}>SPINUTS</p>
          <p className="label-tag text-gray-400">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 space-y-4"
          style={{ border: '0.5px solid rgba(0,0,0,0.10)' }}>
          <div>
            <label className="label-tag text-gray-500 block mb-1">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm py-2.5 px-3"
              style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
            />
          </div>
          <div>
            <label className="label-tag text-gray-500 block mb-1">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm py-2.5 px-3"
              style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 label-tag transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
