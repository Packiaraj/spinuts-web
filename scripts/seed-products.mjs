import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://kdffaevtwaitzhlssvcs.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZmZhZXZ0d2FpdHpobHNzdmNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg1Nzc0NywiZXhwIjoyMDk2NDMzNzQ3fQ.W74C9EQqMxZaNCqRiQXZs77rZfXXpYNjreLAOnlmMuM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// USD price is the Dukaan price (already in USD based on values like 5.99, 14.99)
// INR price = USD * 83 (approximate exchange rate)
function toINR(usd) {
  return Math.round(usd * 83);
}

function mapCategory(cat) {
  const c = cat.toLowerCase().trim();
  if (c === 'spices') return 'spices';
  if (c === 'nuts') return 'nuts';
  if (c === 'seeds') return 'seeds';
  if (c === 'millets') return 'millets';
  if (c === 'dry fruits') return 'dry-fruits';
  if (c === 'gift sets') return 'spices'; // closest match
  return 'spices';
}

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse CSV properly handling quoted fields
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());

    const name = fields[0];
    const category = fields[1];
    const description = fields[2];
    const priceUSD = parseFloat(fields[3]) || 0;
    const discountedUSD = parseFloat(fields[4]) || priceUSD;
    const weight = fields[7] || '';
    const imageUrl = fields[13] || '';
    const weightKg = parseFloat(fields[12]) || 0;

    if (!name || !priceUSD) continue;

    // Discounted price is the selling price, original is the higher one
    const sellPriceUSD = discountedUSD;
    const originalPriceUSD = priceUSD;

    products.push({
      name,
      description,
      price_inr: toINR(sellPriceUSD),
      price_usd: sellPriceUSD,
      original_price_inr: toINR(originalPriceUSD),
      original_price_usd: originalPriceUSD,
      category: mapCategory(category),
      weight,
      stock: 100,
      images: imageUrl ? [imageUrl] : [],
      origin: 'South India',
      active: true,
    });
  }
  return products;
}

async function main() {
  const csv = readFileSync('/Users/packiarajmurugesan/Downloads/SpiNuts_Dukaan_Bulk_Upload_v3_with_images.csv', 'utf-8');
  const products = parseCSV(csv);

  console.log(`Parsed ${products.length} products. Uploading...`);

  // Insert in batches of 20
  for (let i = 0; i < products.length; i += 20) {
    const batch = products.slice(i, i + 20);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error(`Batch ${i}-${i+20} error:`, error.message);
    } else {
      console.log(`✓ Inserted products ${i + 1}–${Math.min(i + 20, products.length)}`);
    }
  }

  console.log('Done!');
}

main();
