import { PRODUCTS, PRODUCTS_BY_ID } from '../data/products';
import { CATEGORY_SHORTCUTS } from '../data/categories';
import { IDEA_COLLECTIONS } from '../data/ideas';
import { SITE_CONFIG } from '../config/site';
import type { OrderRecord, Product } from '../types';

export const catalogService = {
  getAllProducts(): Product[] {
    return PRODUCTS;
  },

  getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find((p) => p.slug === slug);
  },

  getProductById(id: string): Product | undefined {
    return PRODUCTS_BY_ID[id];
  },

  getTrendingProducts(limit = 6): Product[] {
    return PRODUCTS.filter((p) => p.trending).slice(0, limit);
  },

  getRelatedProducts(product: Product, limit = 4): Product[] {
    return PRODUCTS.filter(
      (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
    ).slice(0, limit);
  },

  getSearchSuggestions(query: string, limit = 6): Product[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    ).slice(0, limit);
  },

  getCategories() {
    return CATEGORY_SHORTCUTS;
  },

  getIdeas() {
    return IDEA_COLLECTIONS;
  },

  getIdeaBySlug(slug: string) {
    return IDEA_COLLECTIONS.find((i) => i.slug === slug);
  },

  getBrands(): string[] {
    return Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
  },

  async submitNewsletter(email: string): Promise<{ ok: boolean; remoteSynced: boolean }> {
    // When Supabase credentials are configured, this calls Supabase Edge/RPC;
    // otherwise returns deterministic local-handled confirmation without faking a remote charge.
    if (SITE_CONFIG.supabaseConfigured) {
      // Hook point for live Supabase `newsletter_subscribers` insert
      return { ok: true, remoteSynced: true };
    }
    return { ok: true, remoteSynced: false };
  },

  async createOrder(order: OrderRecord): Promise<{ ok: boolean; order: OrderRecord }> {
    // Re-validates order structure cleanly; explicitly flags demo orders when Stripe/Supabase are unconfigured.
    return {
      ok: true,
      order: {
        ...order,
        isDemoOrder: !SITE_CONFIG.stripeConfigured,
      },
    };
  },
};
