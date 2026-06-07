import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kdffaevtwaitzhlssvcs.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZmZhZXZ0d2FpdHpobHNzdmNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg1Nzc0NywiZXhwIjoyMDk2NDMzNzQ3fQ.W74C9EQqMxZaNCqRiQXZs77rZfXXpYNjreLAOnlmMuM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// High quality specific images per product keyword
const IMAGE_MAP = [
  // Spices
  { match: /pepper|மிளகு/i, img: 'https://images.unsplash.com/photo-1599909631152-0438bdea3e3b?w=800&q=80' },
  { match: /white pepper|வெள்ளை மிளகு/i, img: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80' },
  { match: /cinnamon|இலவங்கப்பட்டை/i, img: 'https://images.unsplash.com/photo-1565692741919-3f4d9af1b9bc?w=800&q=80' },
  { match: /clove|கிராம்பு/i, img: 'https://images.unsplash.com/photo-1599909631152-0438bdea3e3b?w=800&q=80' },
  { match: /bay leaf|பிரியாணி இலை/i, img: 'https://images.unsplash.com/photo-1628191013085-990572b6b5a0?w=800&q=80' },
  { match: /star anise|நட்சத்திர/i, img: 'https://images.unsplash.com/photo-1611784728558-6a7645e72a20?w=800&q=80' },
  { match: /fenugreek|வெந்தயம்/i, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
  { match: /jeera|cumin|சீரகம்/i, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
  { match: /mace|jathipatri|ஜாதிபத்ரி/i, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
  { match: /ginger|சுக்கு/i, img: 'https://images.unsplash.com/photo-1615485290382-441e4aa8a562?w=800&q=80' },
  { match: /kapok|marathi/i, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },

  // Nuts
  { match: /almond|badam|பாதாம்/i, img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80' },
  { match: /cashew|முந்திரி/i, img: 'https://images.unsplash.com/photo-1563412580-89b80d8c8199?w=800&q=80' },
  { match: /pistachio|pista|பிஸ்தா/i, img: 'https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=800&q=80' },
  { match: /walnut|வால்நட்/i, img: 'https://images.unsplash.com/photo-1509610973037-a4e3cc6f5b08?w=800&q=80' },
  { match: /brazil/i, img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80' },
  { match: /pecan/i, img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80' },

  // Seeds
  { match: /chia|சியா/i, img: 'https://images.unsplash.com/photo-1514733670139-4d240b813aff?w=800&q=80' },
  { match: /pumpkin seed|பூசணி விதை/i, img: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4b05?w=800&q=80' },
  { match: /sunflower|சூரியகாந்தி/i, img: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&q=80' },
  { match: /watermelon seed|தர்பூசணி விதை/i, img: 'https://images.unsplash.com/photo-1514733670139-4d240b813aff?w=800&q=80' },
  { match: /flax|ஆளி/i, img: 'https://images.unsplash.com/photo-1514733670139-4d240b813aff?w=800&q=80' },
  { match: /sesame|ellu|எள்ளு/i, img: 'https://images.unsplash.com/photo-1514733670139-4d240b813aff?w=800&q=80' },
  { match: /sabja|basil seed|சப்ஜா/i, img: 'https://images.unsplash.com/photo-1514733670139-4d240b813aff?w=800&q=80' },
  { match: /black cumin|karunjeeragam|கருஞ்சீரகம்/i, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
  { match: /makhana|fox nut|மக்கானா/i, img: 'https://images.unsplash.com/photo-1514733670139-4d240b813aff?w=800&q=80' },

  // Millets
  { match: /millet|idiyappam|dosa|chappati|noodle|pasta|kanji|kozhukattai|puttu|kali/i, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80' },
  { match: /ragi/i, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80' },

  // Dry fruits
  { match: /prune|ப்ரூன்ஸ்/i, img: 'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=800&q=80' },
  { match: /apricot|ஆப்ரிகாட்/i, img: 'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=800&q=80' },
  { match: /black grape|கருப்பு உலர்/i, img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&q=80' },
  { match: /raisin|kismis|கிஸ்மிஸ்/i, img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&q=80' },
  { match: /fig|அத்திப்பழம்/i, img: 'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=800&q=80' },
  { match: /cranberry|கிரான்பெர்ரி/i, img: 'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=800&q=80' },
  { match: /pineapple|அன்னாசி/i, img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&q=80' },
  { match: /mango|மாம்பழம்/i, img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80' },
  { match: /strawberry|ஸ்ட்ராபெரி/i, img: 'https://images.unsplash.com/photo-1543528176-61b239494933?w=800&q=80' },
  { match: /amla|ஆம்லா/i, img: 'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=800&q=80' },
  { match: /date|பேரிச்சம்/i, img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80' },
  { match: /mixed dry|கலப்பு/i, img: 'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=800&q=80' },

  // Gift
  { match: /gift|box/i, img: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80' },
];

function getImage(name) {
  for (const { match, img } of IMAGE_MAP) {
    if (match.test(name)) return img;
  }
  return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80';
}

async function main() {
  const { data: products, error } = await supabase.from('products').select('id, name, images');
  if (error) { console.error(error); return; }

  console.log(`Updating images for ${products.length} products...`);

  for (const p of products) {
    const img = getImage(p.name);
    const { error: err } = await supabase
      .from('products')
      .update({ images: [img] })
      .eq('id', p.id);
    if (err) {
      console.error(`Failed ${p.name}:`, err.message);
    } else {
      console.log(`✓ ${p.name}`);
    }
  }
  console.log('Done!');
}

main();
