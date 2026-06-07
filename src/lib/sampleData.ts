import { Product } from './types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Black Pepper Whole',
    description: 'Bold, pungent whole black pepper from the hills of Wayanad, Kerala. Hand-picked at peak maturity and sun-dried for 5 days to lock in maximum piperine content. Use whole in marinades, curries, and rasam. Grind fresh for the best aroma.',
    price_inr: 320, price_usd: 4, original_price_inr: 420, original_price_usd: 5,
    category: 'spices', weight: '100g', stock: 50, images: [], origin: 'Wayanad, Kerala', active: true, created_at: '',
  },
  {
    id: '2', name: 'Cardamom Green',
    description: 'Intensely aromatic green cardamom pods hand-picked from the high-altitude estates of Idukki. One of the finest varieties in the world — used in chai, biryanis, sweets, and desserts.',
    price_inr: 580, price_usd: 7, original_price_inr: 750, original_price_usd: 9,
    category: 'spices', weight: '50g', stock: 30, images: [], origin: 'Idukki, Kerala', active: true, created_at: '',
  },
  {
    id: '3', name: 'Cashews W240',
    description: 'Whole cashews, premium W240 grade, sourced directly from cashew processors in Kollam. Creamy, buttery flavour. Perfect for snacking, cooking, or making cashew milk.',
    price_inr: 850, price_usd: 10, original_price_inr: 1050, original_price_usd: 13,
    category: 'nuts', weight: '250g', stock: 40, images: [], origin: 'Kollam, Kerala', active: true, created_at: '',
  },
  {
    id: '4', name: 'Cloves Whole',
    description: 'Fragrant whole cloves with high eugenol content from Thrissur. Strong, sharp, and warming — an essential in garam masala, biryani, and mulled drinks.',
    price_inr: 240, price_usd: 3, original_price_inr: 300, original_price_usd: 4,
    category: 'spices', weight: '50g', stock: 60, images: [], origin: 'Thrissur, Kerala', active: true, created_at: '',
  },
  {
    id: '5', name: 'Ragi / Finger Millet',
    description: 'Nutrient-dense finger millet from traditional farms in Salem, Tamil Nadu. Rich in calcium, iron, and amino acids. Use for porridge, rotis, and health drinks.',
    price_inr: 180, price_usd: 2, category: 'millets', weight: '500g',
    stock: 80, images: [], origin: 'Salem, Tamil Nadu', active: true, created_at: '',
  },
  {
    id: '6', name: 'Almonds Raw',
    description: 'Raw, unsalted whole almonds — rich in healthy fats, protein, and vitamin E. Sourced and packed fresh. Perfect for snacking, soaking overnight, or making almond milk.',
    price_inr: 720, price_usd: 9, original_price_inr: 900, original_price_usd: 11,
    category: 'nuts', weight: '250g', stock: 35, images: [], origin: 'Imported, Packed in India', active: true, created_at: '',
  },
  {
    id: '7', name: 'Cumin Seeds',
    description: 'Earthy, warm cumin seeds from the spice heartland of Rajasthan. Aromatic when tempered in oil. A staple in every Indian kitchen — from dal to raita.',
    price_inr: 150, price_usd: 2, category: 'seeds', weight: '100g',
    stock: 90, images: [], origin: 'Rajasthan', active: true, created_at: '',
  },
  {
    id: '8', name: 'Dates Medjool',
    description: 'Soft, caramel-sweet Medjool dates, premium grade. Naturally sweet, rich in fibre and minerals. Eat as a snack, blend into smoothies, or use in desserts.',
    price_inr: 650, price_usd: 8, original_price_inr: 800, original_price_usd: 10,
    category: 'dry-fruits', weight: '250g', stock: 25, images: [], origin: 'Imported, Packed in India', active: true, created_at: '',
  },
  {
    id: '9', name: 'Cinnamon Sticks',
    description: 'True Ceylon cinnamon (not cassia) sticks with a sweet, delicate flavour. Sourced from Sri Lanka and packed in Kerala. Use in biryanis, desserts, and teas.',
    price_inr: 210, price_usd: 3, original_price_inr: 260, original_price_usd: 4,
    category: 'spices', weight: '50g', stock: 45, images: [], origin: 'Sri Lanka, Packed in Kerala', active: true, created_at: '',
  },
  {
    id: '10', name: 'Pistachios Roasted',
    description: 'Lightly salted, dry-roasted pistachios. Crunchy and satisfying — rich in antioxidants and healthy fats. Great for snacking, garnishing kheer, or trail mixes.',
    price_inr: 980, price_usd: 12, original_price_inr: 1200, original_price_usd: 15,
    category: 'nuts', weight: '200g', stock: 20, images: [], origin: 'Imported, Packed in India', active: true, created_at: '',
  },
  {
    id: '11', name: 'Mustard Seeds Black',
    description: 'Small, pungent black mustard seeds — the cornerstone of South Indian tempering. Sourced from farms in Karnataka. Pop in hot oil to release their nutty flavour.',
    price_inr: 90, price_usd: 1, category: 'seeds', weight: '100g',
    stock: 120, images: [], origin: 'Karnataka', active: true, created_at: '',
  },
  {
    id: '12', name: 'Walnuts Halves',
    description: 'Firm, fresh walnut halves rich in omega-3 fatty acids. Harvested from the valleys of Kashmir. Eat raw, toast lightly, or add to salads and baked goods.',
    price_inr: 890, price_usd: 11, original_price_inr: 1100, original_price_usd: 14,
    category: 'nuts', weight: '250g', stock: 28, images: [], origin: 'Kashmir', active: true, created_at: '',
  },
];
