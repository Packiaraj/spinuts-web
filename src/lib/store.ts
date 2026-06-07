'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Currency } from './types';

interface StoreState {
  cart: CartItem[];
  currency: Currency;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setCurrency: (c: Currency) => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      currency: 'INR',
      addToCart: (product, qty = 1) => {
        set((s) => {
          const existing = s.cart.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { cart: [...s.cart, { product, quantity: qty }] };
        });
      },
      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((i) => i.product.id !== productId) })),
      updateQty: (productId, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((i) => i.product.id !== productId)
              : s.cart.map((i) =>
                  i.product.id === productId ? { ...i, quantity: qty } : i
                ),
        })),
      clearCart: () => set({ cart: [] }),
      setCurrency: (c) => set({ currency: c }),
      cartTotal: () => {
        const { cart, currency } = get();
        return cart.reduce((sum, i) => {
          const price = currency === 'INR' ? i.product.price_inr : i.product.price_usd;
          return sum + price * i.quantity;
        }, 0);
      },
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'spinuts-cart' }
  )
);
