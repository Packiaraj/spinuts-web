'use client';
import { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { Product } from '@/lib/types';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase
          .from('products')
          .select('id, name, category, stock, active, price_inr, weight')
          .order('category', { ascending: true });
        if (data) setProducts(data as Product[]);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  async function updateStock(id: string, stock: number) {
    setSaving(id);
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('products').update({ stock }).eq('id', id);
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock } : p));
    } catch { /* ignore */ }
    setSaving(null);
  }

  async function toggleActive(id: string, active: boolean) {
    setSaving(id);
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('products').update({ active }).eq('id', id);
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, active } : p));
    } catch { /* ignore */ }
    setSaving(null);
  }

  const lowStock = products.filter((p) => p.stock <= 10 && p.active);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-xl font-medium" style={{ fontWeight: 500 }}>Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage stock levels and product visibility</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <p className="label-tag text-gray-400 mb-1">Total Products</p>
            <p className="text-2xl font-medium" style={{ color: '#1B4332' }}>{products.length}</p>
          </div>
          <div className="bg-white p-5" style={{ border: '0.5px solid rgba(220,80,80,0.3)', backgroundColor: lowStock.length > 0 ? '#fff8f8' : 'white' }}>
            <p className="label-tag text-gray-400 mb-1">Low Stock (≤10)</p>
            <p className="text-2xl font-medium" style={{ color: lowStock.length > 0 ? '#e55' : '#1B4332' }}>{lowStock.length}</p>
          </div>
          <div className="bg-white p-5" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <p className="label-tag text-gray-400 mb-1">Out of Stock</p>
            <p className="text-2xl font-medium" style={{ color: outOfStock.length > 0 ? '#e55' : '#1B4332' }}>{outOfStock.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400 py-12 text-center">Loading inventory...</div>
        ) : (
          <div className="bg-white" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                  {['Product', 'Category', 'Weight', 'Price (₹)', 'Stock', 'Visible', ''].map((h) => (
                    <th key={h} className="label-tag text-left px-4 py-3 text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name.split(' / ')[0]}</p>
                      {p.name.includes(' / ') && (
                        <p className="text-xs text-gray-400">{p.name.split(' / ')[1]}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="label-tag" style={{ color: '#1B4332' }}>{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.weight}</td>
                    <td className="px-4 py-3">₹{p.price_inr}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        defaultValue={p.stock}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== p.stock) updateStock(p.id, val);
                        }}
                        className="w-20 text-sm py-1 px-2 text-center"
                        style={{
                          border: `0.5px solid ${p.stock <= 10 ? '#e55' : 'rgba(0,0,0,0.15)'}`,
                          color: p.stock === 0 ? '#e55' : p.stock <= 10 ? '#f90' : 'inherit',
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(p.id, !p.active)}
                        disabled={saving === p.id}
                        className="label-tag px-3 py-1 transition-colors"
                        style={{
                          backgroundColor: p.active ? 'rgba(27,67,50,0.1)' : 'rgba(0,0,0,0.06)',
                          color: p.active ? '#1B4332' : '#888',
                          border: '0.5px solid transparent',
                        }}
                      >
                        {p.active ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {saving === p.id && <span className="label-tag text-gray-400">Saving...</span>}
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
