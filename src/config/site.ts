import type { CountryCode, CurrencyCode } from '../types';

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { symbol: string; rate: number; label: string; locale: string }
> = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)', locale: 'en-US' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)', locale: 'en-GB' },
  AED: { symbol: 'AED ', rate: 3.67, label: 'AED', locale: 'en-AE' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)', locale: 'de-DE' },
};

export const COUNTRY_DEFAULT_CURRENCY: Record<CountryCode, CurrencyCode> = {
  US: 'USD',
  UK: 'GBP',
  UAE: 'AED',
};

export const SITE_CONFIG = {
  brandName: 'TechVerse',
  tagline: 'Discover. Shop. Upgrade.',
  freeShippingThresholdUsd: 100,
  standardShippingUsd: 9.99,
  expressShippingUsd: 19.99,
  taxRate: 0.08,
  supportEmail: 'support@techverse.example',
  supabaseConfigured: Boolean(
    typeof import.meta !== 'undefined' &&
      import.meta.env?.VITE_SUPABASE_URL &&
      import.meta.env?.VITE_SUPABASE_ANON_KEY
  ),
  stripeConfigured: Boolean(
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY
  ),
};
