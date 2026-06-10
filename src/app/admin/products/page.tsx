'use client';
import { useState, useEffect, useRef } from 'react';
import AdminNav from '@/components/AdminNav';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { Product } from '@/lib/types';

const CATEGORY_EMOJI: Record<string, string> = {
  spices: '🌶️', nuts: '🥜', seeds: '🌱', millets: '🌾', 'dry-fruits': '🍇',
};

function ProductThumb({ images, category }: { images: string[]; category: string }) {
  const [err, setErr] = useState(false);
  const src = images?.[0];
  if (src && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="w-full h-full object-cover" onError={() => setErr(true)} />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center text-xl">
      {CATEGORY_EMOJI[category] || '🌿'}
    </div>
  );
}

const EMPTY: Partial<Product> = {
  name: '', description: '', price_inr: 0, price_usd: 0,
  original_price_inr: undefined, original_price_usd: undefined,
  category: 'spices', weight: '', stock: 0, origin: '', active: true, images: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(EMPTY);
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data) setProducts(data);
      } catch { /* ignore */ }
    }
    load();
  }, []);

  function openNew() { setEditing(EMPTY); setIsNew(true); setShowForm(true); }
  function openEdit(p: Product) { setEditing({ ...p }); setIsNew(false); setShowForm(true); }

  async function uploadImage(file: File) {
    setUploading(true);
    const start = Date.now();
    try {
      const { supabase } = await import('@/lib/supabase');

      // Ensure bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === 'products');
      if (!exists) {
        await supabase.storage.createBucket('products', { public: true });
      }

      const ext = file.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('products').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('products').getPublicUrl(path);
      setEditing((f) => ({ ...f, images: [...(f.images || []), data.publicUrl] }));
    } catch (e) {
      // keep spinner visible minimum 600ms so user sees it even on fast failure
      const elapsed = Date.now() - start;
      if (elapsed < 600) await new Promise((r) => setTimeout(r, 600 - elapsed));
      alert('Image upload failed: ' + (e instanceof Error ? e.message : 'unknown error'));
    }
    setUploading(false);
  }

  function removeImage(url: string) {
    setEditing((f) => ({ ...f, images: (f.images || []).filter((i) => i !== url) }));
  }

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
      setShowForm(false);
    } catch (e) {
      alert('Save failed: ' + (e instanceof Error ? e.message : 'unknown error'));
    }
    setSaving(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('products').delete().eq('id', id);
    } catch { /* ignore */ }
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
                {['Image', 'Product', 'Category', 'Price (INR)', 'Stock', 'Status', ''].map((h) => (
                  <th key={h} className="label-tag text-left px-4 py-3 text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 overflow-hidden rounded" style={{ backgroundColor: '#f5f0eb' }}>
                      <ProductThumb images={p.images || []} category={p.category} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.name.split(' / ')[0]}</p>
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
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative"
              style={{ border: '0.5px solid rgba(0,0,0,0.1)' }}>

              {/* Full-form upload overlay */}
              {uploading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(3px)' }}>
                  <div style={{
                    width: 48, height: 48,
                    border: '4px solid #e5e7eb',
                    borderTopColor: '#1B4332',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <p className="label-tag" style={{ color: '#1B4332', letterSpacing: '0.12em' }}>Uploading image…</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <h2 className="font-medium" style={{ fontWeight: 500 }}>{isNew ? 'Add Product' : 'Edit Product'}</h2>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
              </div>

              {/* Image upload */}
              <div className="mb-6">
                <label className="label-tag text-gray-400 block mb-2">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {(editing.images || []).map((url) => (
                    <div key={url} className="relative w-24 h-24 rounded overflow-hidden group" style={{ border: '0.5px solid rgba(0,0,0,0.1)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="product" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X size={18} className="text-white" />
                      </button>
                    </div>
                  ))}
                  {uploading ? (
                    <div className="w-24 h-24 flex flex-col items-center justify-center gap-2"
                      style={{ border: '0.5px dashed rgba(0,0,0,0.2)', borderRadius: 4 }}>
                      {/* Spinning ring */}
                      <div style={{
                        width: 28, height: 28,
                        border: '2.5px solid #e5e7eb',
                        borderTopColor: '#1B4332',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                      <span className="label-tag" style={{ color: '#1B4332', fontSize: '0.55rem' }}>Uploading…</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-24 h-24 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#1B4332] transition-colors"
                      style={{ border: '0.5px dashed rgba(0,0,0,0.2)' }}
                    >
                      <Upload size={18} />
                      <span className="label-tag">Upload</span>
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ''; }}
                  />
                </div>
                <p className="text-xs text-gray-400">First image is shown as the main product photo. JPG/PNG/WEBP.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label-tag text-gray-400 block mb-1">Product Name (English / தமிழ்)</label>
                  <input className={inp} style={inpStyle} value={editing.name || ''}
                    placeholder="e.g. Black Pepper / மிளகு"
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
                <button onClick={save} disabled={saving || uploading}
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
