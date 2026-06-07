export interface Product {
  id: string;
  name: string;
  description: string;
  price_inr: number;
  price_usd: number;
  original_price_inr?: number;
  original_price_usd?: number;
  category: string;
  weight: string;
  stock: number;
  images: string[];
  origin: string;
  active: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_id?: string;
  items: CartItem[];
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'razorpay' | 'stripe' | 'cod';
  payment_status: 'pending' | 'paid' | 'failed';
  address: Address;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  created_at: string;
}

export type Category = 'all' | 'spices' | 'nuts' | 'seeds' | 'millets' | 'dry-fruits';
export type Currency = 'INR' | 'USD';
