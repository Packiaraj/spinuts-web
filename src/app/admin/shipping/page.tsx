'use client';
import { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { Save, Check, Truck, MapPin } from 'lucide-react';

interface ShippingConfig {
  shipping_tn_cost: string;
  shipping_tn_free_above: string;
  shipping_other_cost: string;
}

const DEFAULTS: ShippingConfig = {
  shipping_tn_cost: '60',
  shipping_tn_free_above: '799',
  shipping_other_cost: '120',
};

export default function AdminShippingPage() {
  const [config, setConfig] = useState<ShippingConfig>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('site_content')
          .select('key, value')
          .in('key', ['shipping_tn_cost', 'shipping_tn_free_above', 'shipping_other_cost']);
        if (data && data.length > 0) {
          const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
          setConfig((prev) => ({ ...prev, ...map }));
        }
      } catch { /* use defaults */ }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      const rows = Object.entries(config).map(([key, value]) => ({ key, value }));
      await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Save failed: ' + (e instanceof Error ? e.message : 'unknown'));
    }
    setSaving(false);
  }

  const tnCost = Number(config.shipping_tn_cost);
  const tnFreeAbove = Number(config.shipping_tn_free_above);
  const otherCost = Number(config.shipping_other_cost);

  if (loading) return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 flex items-center justify-center text-sm text-gray-400">Loading...</main>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-medium" style={{ fontWeight: 500 }}>Shipping Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Set delivery charges applied at checkout</p>
          </div>
          <button
            onClick={save} disabled={saving}
            className="flex items-center gap-2 label-tag px-5 py-2.5 disabled:opacity-50"
            style={{ backgroundColor: saved ? '#059669' : '#1B4332', color: '#FFF8F0' }}
          >
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}</>}
          </button>
        </div>

        <div className="space-y-6">
          {/* Tamil Nadu */}
          <div className="bg-white p-6" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(27,67,50,0.1)' }}>
                <MapPin size={18} style={{ color: '#1B4332' }} />
              </div>
              <div>
                <p className="font-medium text-sm">Tamil Nadu</p>
                <p className="text-xs text-gray-400">Local / regional delivery</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label-tag text-gray-400 block mb-2">Shipping Cost (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                  <input
                    type="number" min={0}
                    value={config.shipping_tn_cost}
                    onChange={(e) => setConfig((c) => ({ ...c, shipping_tn_cost: e.target.value }))}
                    className="w-full text-sm py-2.5 pl-7 pr-3 bg-white"
                    style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Charged when order is below free threshold</p>
              </div>

              <div>
                <label className="label-tag text-gray-400 block mb-2">Free Shipping Above (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                  <input
                    type="number" min={0}
                    value={config.shipping_tn_free_above}
                    onChange={(e) => setConfig((c) => ({ ...c, shipping_tn_free_above: e.target.value }))}
                    className="w-full text-sm py-2.5 pl-7 pr-3 bg-white"
                    style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Orders at or above this get free delivery</p>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-5 p-4 rounded-sm" style={{ backgroundColor: 'rgba(27,67,50,0.04)', border: '0.5px solid rgba(27,67,50,0.15)' }}>
              <p className="label-tag mb-2" style={{ color: '#1B4332' }}>Preview — what customer sees</p>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Order below ₹{tnFreeAbove} → Shipping: <strong>₹{tnCost}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#059669' }}>✓</span>
                  <span>Order ₹{tnFreeAbove}+ → Shipping: <strong style={{ color: '#059669' }}>FREE 🎉</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Other States */}
          <div className="bg-white p-6" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212,160,23,0.1)' }}>
                <Truck size={18} style={{ color: '#D4A017' }} />
              </div>
              <div>
                <p className="font-medium text-sm">Other States (Pan India)</p>
                <p className="text-xs text-gray-400">All states except Tamil Nadu</p>
              </div>
            </div>

            <div className="max-w-xs">
              <label className="label-tag text-gray-400 block mb-2">Shipping Cost (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                <input
                  type="number" min={0}
                  value={config.shipping_other_cost}
                  onChange={(e) => setConfig((c) => ({ ...c, shipping_other_cost: e.target.value }))}
                  className="w-full text-sm py-2.5 pl-7 pr-3 bg-white"
                  style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Flat rate for all orders outside Tamil Nadu</p>
            </div>

            <div className="mt-5 p-4 rounded-sm" style={{ backgroundColor: 'rgba(212,160,23,0.04)', border: '0.5px solid rgba(212,160,23,0.2)' }}>
              <p className="label-tag mb-2" style={{ color: '#D4A017' }}>Preview — what customer sees</p>
              <div className="text-xs text-gray-600 flex items-center gap-2">
                <span>🚚</span>
                <span>Any order from other states → Shipping: <strong>₹{otherCost}</strong></span>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="p-4 text-xs text-gray-500 flex gap-3"
            style={{ border: '0.5px solid rgba(0,0,0,0.08)', backgroundColor: '#fafafa' }}>
            <span className="text-base">💡</span>
            <div className="space-y-1">
              <p>Shipping is calculated automatically at checkout when the customer enters their state.</p>
              <p>Changes here take effect immediately — no redeploy needed.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
