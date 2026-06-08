import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kdffaevtwaitzhlssvcs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZmZhZXZ0d2FpdHpobHNzdmNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg1Nzc0NywiZXhwIjoyMDk2NDMzNzQ3fQ.W74C9EQqMxZaNCqRiQXZs77rZfXXpYNjreLAOnlmMuM'
);

// Update site content
const rows = [
  { key: 'hero_headline', value: 'Pure spices.\nReal origin.\nNo middlemen.' },
  { key: 'hero_subtext', value: 'Whole spices and nuts sourced directly from the forests and farms of the Western Ghats. Unprocessed, unadulterated, and delivered to your door.' },
  { key: 'hero_cta', value: 'Shop All Products' },
  { key: 'story_headline', value: 'From the heart of\nthe Western Ghats.' },
  { key: 'story_body1', value: "SpiNuts began with a simple belief: the best spices are whole spices, freshly sourced. We work directly with farmers and forest communities deep in the Western Ghats — one of the world's richest biodiversity hotspots — cutting out every layer of middlemen so you get the real thing." },
  { key: 'story_body2', value: "Every batch is traceable to its source. Every product is packed within days of harvest. That's the SpiNuts promise." },
  { key: 'story_promise', value: 'Read Our Story →' },
  { key: 'gift_title', value: 'Gift boxes available' },
  { key: 'gift_subtitle', value: 'Curated spice and nut collections from the Western Ghats, beautifully packed.' },
  { key: 'trust_1_label', value: 'Farm Direct' },
  { key: 'trust_1_sub', value: 'No middlemen' },
  { key: 'trust_2_label', value: 'Western Ghats' },
  { key: 'trust_2_sub', value: 'Biodiversity hotspot' },
  { key: 'trust_3_label', value: 'Whole & Pure' },
  { key: 'trust_3_sub', value: 'Unprocessed, natural' },
  { key: 'trust_4_label', value: 'Pan India' },
  { key: 'trust_4_sub', value: 'Fast delivery' },
  { key: 'banner_tag', value: 'Gift Special' },
];

const { error: contentErr } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
if (contentErr) console.error('Content error:', contentErr.message);
else console.log(`✓ Updated ${rows.length} content entries`);

// Update all product origins to "Western Ghats"
const { error: originErr } = await supabase.from('products').update({ origin: 'Western Ghats' }).neq('id', '00000000-0000-0000-0000-000000000000');
if (originErr) console.error('Origin error:', originErr.message);
else console.log('✓ Updated all product origins to "Western Ghats"');
