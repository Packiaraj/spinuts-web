'use client';
import { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { Order } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  pending: '#888', confirmed: '#1B4332', processing: '#D4A017',
  shipped: '#2563eb', delivered: '#059669', cancelled: '#e55',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data) setOrders(data);
      } catch { /* no db */ }
    }
    load();
  }, []);

  async function updateStatus(id: string, status: Order['status']) {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('orders').update({ status }).eq('id', id);
    } catch { /* demo */ }
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">
        <h1 className="text-xl font-medium mb-8" style={{ fontWeight: 500 }}>Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-16 text-center" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <p className="text-gray-400 text-sm">No orders yet. Connect Supabase to see live orders.</p>
          </div>
        ) : (
          <div className="bg-white" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                  {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Date', 'Action'].map((h) => (
                    <th key={h} className="label-tag text-left px-4 py-3 text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}
                    className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-400">#{o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.customer_name}</p>
                      <p className="text-xs text-gray-400">{o.customer_email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: '#1B4332' }}>₹{o.total}</td>
                    <td className="px-4 py-3">
                      <span className="label-tag">{o.payment_method}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="label-tag px-2 py-1"
                        style={{ color: STATUS_COLORS[o.status], border: `0.5px solid ${STATUS_COLORS[o.status]}` }}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value as Order['status'])}
                        className="text-xs py-1 px-2 bg-white"
                        style={{ border: '0.5px solid rgba(0,0,0,0.12)' }}>
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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
