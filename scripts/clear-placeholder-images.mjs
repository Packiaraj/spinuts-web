import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kdffaevtwaitzhlssvcs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZmZhZXZ0d2FpdHpobHNzdmNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg1Nzc0NywiZXhwIjoyMDk2NDMzNzQ3fQ.W74C9EQqMxZaNCqRiQXZs77rZfXXpYNjreLAOnlmMuM'
);

const { data: products } = await supabase.from('products').select('id, name, images');

let cleared = 0;
for (const p of products || []) {
  const hasRealImage = (p.images || []).some(url =>
    url.includes('supabase.co/storage')
  );
  if (!hasRealImage && (p.images || []).length > 0) {
    await supabase.from('products').update({ images: [] }).eq('id', p.id);
    console.log(`Cleared: ${p.name}`);
    cleared++;
  }
}
console.log(`\nDone. Cleared ${cleared} products with placeholder images.`);
