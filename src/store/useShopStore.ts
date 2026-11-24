import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CountryCode, CurrencyCode } from '../types';
import { COUNTRY_DEFAULT_CURRENCY } from '../config/site';

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  currency: CurrencyCode;
  country: CountryCode;
  couponCode: string;
  deliveryMethod: 'standard' | 'express' | 'pickup';
  newsletterEmails: string[];

  addToCart: (productId: string, quantity?: number, variantId?: string, variantLabel?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => boolean;
  moveWishlistToCart: (productId: string) => void;
  trackViewed: (productId: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setCountry: (country: CountryCode) => void;
  setCouponCode: (code: string) => void;
  setDeliveryMethod: (method: 'standard' | 'express' | 'pickup') => void;
  subscribeNewsletter: (email: string) => { ok: boolean; message: string };
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: ['prod-smart-watch-9', 'prod-wireless-earbuds-pro'],
      recentlyViewed: [],
      currency: 'USD',
      country: 'US',
      couponCode: '',
      deliveryMethod: 'standard',
      newsletterEmails: [],

      addToCart: (productId, quantity = 1, variantId, variantLabel) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.productId === productId && item.variantId === variantId
          );
          if (existingIndex >= 0) {
            const next = [...state.cart];
            next[existingIndex] = {
              ...next[existingIndex],
              quantity: Math.min(99, next[existingIndex].quantity + quantity),
            };
            return { cart: next };
          }
          return {
            cart: [...state.cart, { productId, variantId, variantLabel, quantity }],
          };
        }),

      removeFromCart: (productId, variantId) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        })),

      updateCartQuantity: (productId, quantity, variantId) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              cart: state.cart.filter(
                (item) => !(item.productId === productId && item.variantId === variantId)
              ),
            };
          }
          return {
            cart: state.cart.map((item) =>
              item.productId === productId && item.variantId === variantId
                ? { ...item, quantity: Math.min(99, quantity) }
                : item
            ),
          };
        }),

      clearCart: () => set({ cart: [], couponCode: '' }),

      toggleWishlist: (productId) => {
        const exists = get().wishlist.includes(productId);
        set((state) => ({
          wishlist: exists
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        }));
        return !exists;
      },

      moveWishlistToCart: (productId) => {
        get().addToCart(productId, 1);
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        }));
      },

      trackViewed: (productId) =>
        set((state) => ({
          recentlyViewed: [
            productId,
            ...state.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, 6),
        })),

      setCurrency: (currency) => set({ currency }),

      setCountry: (country) =>
        set({
          country,
          currency: COUNTRY_DEFAULT_CURRENCY[country],
        }),

      setCouponCode: (couponCode) => set({ couponCode }),

      setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),

      subscribeNewsletter: (rawEmail) => {
        const normalized = rawEmail.trim().toLowerCase();
        if (!normalized) {
          return { ok: false, message: 'Please enter your email address.' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalized)) {
          return { ok: false, message: 'Please enter a valid email address.' };
        }
        if (get().newsletterEmails.includes(normalized)) {
          return {
            ok: false,
            message: 'This email is already subscribed to TechVerse updates.',
          };
        }
        set((state) => ({
          newsletterEmails: [...state.newsletterEmails, normalized],
        }));
        return {
          ok: true,
          message: 'Subscribed! Watch your inbox for curated tech drops & deals.',
        };
      },
    }),
    {
      name: 'techverse-shop-v1',
    }
  )
);
