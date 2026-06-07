'use client';
import { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Product } from '@/lib/types';
import { SAMPLE_PRODUCTS } from '@/lib/sampleData';

const EMPTY: Partial<Product> = {
  name: '', description: '', price_inr: 0, price_usd: 0,
  original_price_inr: undefined, original_price_usd: undefined,
  category: 'spices', weight: '', stock: 0, origin: '', active: true, images: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(EMPTY);
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) setProducts(data);
      } catch { /* sample */ }
    }
    load();
  }, []);

  function openNew() { setEditing(EMPTY); setIsNew(true); setShowForm(true); }
  function openEdit(p: Product) { setEditing(p); setIsNew(false); setShowForm(true); }

  async function save() {
    setSaving(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      if (isNew) {
        const { data } = await supabase.from('products').insert([editing]).select().single();
        if (data) setProducts((prev) => [data, ...prev]);
      } else {
        const { data } = await supabase.from('products').update(editing).eq('id', editing.id).select().single();
        if (data) setProducts((prev) => prev.map((p) => p.id === data.id ? data : p));
      }
    } catch { /* demo mode — just update local state */
      if (isNew) {
        const newP = { ...editing, id: Date.now().toString(), created_at: new Date().toISOString() } as Product;
        setProducts((prev) => [newP, ...prev]);
      } else {
        setProducts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...editing } as Product : p));
      }
    }
    setSaving(false);
    setShowForm(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('products').delete().eq('id', id);
    } catch { /* demo */ }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  const inp = "w-full text-sm py-2 px-3 bg-white";
  const inpStyle = { border: '0.5px solid rgba(0,0,0,0.15)' };

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-medium" style={{ fontWeight: 500 }}>Products</h1>
          <button onClick={openNew}
            className="flex items-center gap-2 label-tag px-4 py-2"
            style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
            <Plus size={14} /> Add Product
          </button>
        </div>

        <div className="bg-white" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                {['Product', 'Category', 'Price (INR)', 'Stock', 'Status', ''].map((h) => (
                  <th key={h} className="label-tag text-left px-4 py-3 text-gray-400 font-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.origin}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="label-tag" style={{ color: '#1B4332' }}>{p.category}</span>
                  </td>
                  <td className="px-4 py-3">₹{p.price_inr}</td>
                  <td className="px-4 py-3">
                    <span style={{ color: p.stock <= 10 ? '#e55' : '#1B4332' }}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="label-tag px-2 py-1"
                      style={{ backgroundColor: p.active ? 'rgba(27,67,50,0.1)' : 'rgba(0,0,0,0.06)',
                        color: p.active ? '#1B4332' : '#888' }}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-[#1B4332]">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
              style={{ border: '0.5px solid rgba(0,0,0,0.1)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-medium" style={{ fontWeight: 500 }}>{isNew ? 'Add Product' : 'Edit Product'}</h2>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label-tag text-gray-400 block mb-1">Product Name</label>
                  <input className={inp} style={inpStyle} value={editing.name || ''}
                    onChange={(e) => setEditing((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="label-tag text-gray-400 block mb-1">Description</label>
                  <textarea rows={3} className={inp} style={inpStyle} value={editing.description || ''}
                    onChange={(e) => setEditing((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div>
                  <label className="label-tag text-gray-400 block mb-1">Category</label>
                  <select className={inp} style={inpStyle} value={editing.category || 'spices'}
                    onChange={(e) => setEditing((f) => ({ ...f, category: e.target.value }))}>
                    {['spices', 'nuts', 'seeds', 'millets', 'dry-fruits'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-tag text-gray-400 block mb-1">Origin</label>
                  <input className={inp} style={inpStyle} value={editing.origin || ''}
                    onChange={(e) => setEditing((f) => ({ ...f, origin: e.target.value }))} />
                </div>
                <div>
                  <label className="label-tag text-gray-400 block mb-1">Price (₹)</label>
                  <input type="number" className={inp} style={inpStyle} value={editing.price_inr || ''}
                    onChange={(e) => setEditing((f) => ({ ...f, price_inr: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="label-tag text-gray-400 block mb-1">Price ($)</label>
                  <input type="number" className={inp} style={inpStyle} value={editing.price_usd || ''}
                    onChange={(e) => setEditing((f) => ({ ...f, price_usd: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="label-tag text-gray-400 block mb-1">Original Price (₹)</label>
                  <input type="number" className={inp} style={inpStyle} value={editing.original_price_inr || ''}
                    onChange={(e) => setEditing((f) => ({ ...f, original_price_inr: Number(e.target.value) || undefined }))} />
                </div>
                <div>
                  <label className="label-tag text-gray-400 block mb-1">Original Price ($)</label>
                  <input type="number" className={inp} style={inpStyle} value={editing.original_price_usd || ''}
                    onChange={(e) => setEditing((f) => ({ ...f, original_price_usd: Number(e.target.value) || undefined }))} />
                </div>
                <div>
                  <label className="label-tag text-gray-400 block mb-1">Weight (e.g. 100g)</label>
                  <input className={inp} style={inpStyle} value={editing.weight || ''}
                    onChange={(e) => setEditing((f) => ({ ...f, weight: e.target.value }))} />
                </div>
                <div>
                  <label className="label-tag text-gray-400 block mb-1">Stock</label>
                  <input type="number" className={inp} style={inpStyle} value={editing.stock || ''}
                    onChange={(e) => setEditing((f) => ({ ...f, stock: Number(e.target.value) }))} />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="active" checked={editing.active ?? true}
                    onChange={(e) => setEditing((f) => ({ ...f, active: e.target.checked }))} />
                  <label htmlFor="active" className="label-tag text-gray-600">Active (visible in store)</label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={save} disabled={saving}
                  className="flex-1 py-3 label-tag disabled:opacity-50"
                  style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-6 py-3 label-tag text-gray-600"
                  style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
