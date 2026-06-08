'use client';
import { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { Save, Check } from 'lucide-react';

interface SiteContent {
  hero_headline: string;
  hero_subtext: string;
  hero_cta: string;
  story_headline: string;
  story_body1: string;
  story_body2: string;
  story_promise: string;
  gift_title: string;
  gift_subtitle: string;
  trust_1_label: string;
  trust_1_sub: string;
  trust_2_label: string;
  trust_2_sub: string;
  trust_3_label: string;
  trust_3_sub: string;
  trust_4_label: string;
  trust_4_sub: string;
  banner_tag: string;
}

const DEFAULTS: SiteContent = {
  hero_headline: 'Pure spices.\nReal origin.\nNo middlemen.',
  hero_subtext: 'Whole spices and nuts sourced directly from the forests and farms of the Western Ghats. Unprocessed, unadulterated, and delivered to your door.',
  hero_cta: 'Shop All Products',
  story_headline: "From the heart of\nthe Western Ghats.",
  story_body1: "SpiNuts began with a simple belief: the best spices are whole spices, freshly sourced. We work directly with farmers and forest communities deep in the Western Ghats — one of the world's richest biodiversity hotspots — cutting out every layer of middlemen so you get the real thing.",
  story_body2: "Every batch is traceable to its source. Every product is packed within days of harvest. That's the SpiNuts promise.",
  story_promise: 'Read Our Story →',
  gift_title: 'Gift boxes available',
  gift_subtitle: 'Curated spice and nut collections from the Western Ghats, beautifully packed.',
  trust_1_label: 'Farm Direct',
  trust_1_sub: 'No middlemen',
  trust_2_label: 'Western Ghats',
  trust_2_sub: 'Biodiversity hotspot',
  trust_3_label: 'Whole & Pure',
  trust_3_sub: 'Unprocessed, natural',
  trust_4_label: 'Pan India',
  trust_4_sub: 'Fast delivery',
  banner_tag: 'Gift Special',
};

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase.from('site_content').select('key, value');
        if (data && data.length > 0) {
          const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
          setContent((prev) => ({ ...prev, ...map }));
        }
      } catch { /* use defaults */ }
      setLoading(false);
    }
    load();
  }, []);

  async function saveAll() {
    setSaving(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      const rows = Object.entries(content).map(([key, value]) => ({ key, value }));
      await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Save failed: ' + (e instanceof Error ? e.message : 'unknown'));
    }
    setSaving(false);
  }

  function field(key: keyof SiteContent, label: string, multiline = false) {
    return (
      <div>
        <label className="label-tag text-gray-400 block mb-1">{label}</label>
        {multiline ? (
          <textarea
            rows={3}
            value={content[key]}
            onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
            className="w-full text-sm py-2 px-3 bg-white resize-y"
            style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
          />
        ) : (
          <input
            value={content[key]}
            onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
            className="w-full text-sm py-2 px-3 bg-white"
            style={{ border: '0.5px solid rgba(0,0,0,0.15)' }}
          />
        )}
      </div>
    );
  }

  if (loading) return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 flex items-center justify-center text-sm text-gray-400">Loading content...</main>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-medium" style={{ fontWeight: 500 }}>Site Content</h1>
            <p className="text-sm text-gray-500 mt-1">Edit homepage and website text</p>
          </div>
          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 label-tag px-5 py-2.5 transition-colors disabled:opacity-50"
            style={{ backgroundColor: saved ? '#059669' : '#1B4332', color: '#FFF8F0' }}
          >
            {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> {saving ? 'Saving...' : 'Save All'}</>}
          </button>
        </div>

        <div className="space-y-8">
          {/* Hero */}
          <section className="bg-white p-6" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Hero Section</p>
            <div className="space-y-4">
              {field('hero_headline', 'Headline (use \\n for line breaks)', true)}
              {field('hero_subtext', 'Subtext', true)}
              {field('hero_cta', 'Button Text')}
            </div>
          </section>

          {/* Trust bar */}
          <section className="bg-white p-6" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Trust Bar (4 badges)</p>
            <div className="grid grid-cols-2 gap-4">
              {field('trust_1_label', 'Badge 1 — Label')}
              {field('trust_1_sub', 'Badge 1 — Subtext')}
              {field('trust_2_label', 'Badge 2 — Label')}
              {field('trust_2_sub', 'Badge 2 — Subtext')}
              {field('trust_3_label', 'Badge 3 — Label')}
              {field('trust_3_sub', 'Badge 3 — Subtext')}
              {field('trust_4_label', 'Badge 4 — Label')}
              {field('trust_4_sub', 'Badge 4 — Subtext')}
            </div>
          </section>

          {/* Story */}
          <section className="bg-white p-6" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Our Story Section</p>
            <div className="space-y-4">
              {field('story_headline', 'Headline', true)}
              {field('story_body1', 'Paragraph 1', true)}
              {field('story_body2', 'Paragraph 2', true)}
            </div>
          </section>

          {/* Gift / Banner */}
          <section className="bg-white p-6" style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <p className="label-tag mb-4" style={{ color: '#1B4332' }}>Gift Box Banner</p>
            <div className="space-y-4">
              {field('banner_tag', 'Banner Tag (e.g. Diwali Special)')}
              {field('gift_title', 'Title')}
              {field('gift_subtitle', 'Subtitle')}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
