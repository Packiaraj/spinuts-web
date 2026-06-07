'use client';
import { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { Customer } from '@/lib/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
        if (data) setCustomers(data);
      } catch { /* no db */ }
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">
        <h1 className="text-xl font-medium mb-8" style={{ fontWeight: 500 }}>Customers</h1>

        {customers.length === 0 ? (
          <div className="bg-white p-16 text-center" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <p className="text-gray-400 text-sm">No customers yet. Connect Supabase to see data.</p>
          </div>
        ) : (
          <div className="bg-white" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                  {['Name', 'Email', 'Phone', 'Country', 'Joined'].map((h) => (
                    <th key={h} className="label-tag text-left px-4 py-3 text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}
                    className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.email}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3">
                      <span className="label-tag" style={{ color: '#1B4332' }}>{c.country}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
