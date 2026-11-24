import { SITE_CONFIG } from '../config/site';
import type { CartItem, CouponDefinition, Product } from '../types';

export const COUPONS: CouponDefinition[] = [
  {
    code: 'TECH10',
    type: 'percent',
    value: 10,
    minSubtotal: 50,
    description: '10% off orders $50+',
  },
  {
    code: 'UPGRADE25',
    type: 'fixed',
    value: 25,
    minSubtotal: 150,
    description: '$25 off orders $150+',
  },
  {
    code: 'WELCOME15',
    type: 'percent',
    value: 15,
    minSubtotal: 100,
    description: '15% off first order $100+',
  },
];

export interface CartTotals {
  itemCount: number;
  subtotalUsd: number;
  discountUsd: number;
  shippingUsd: number;
  taxUsd: number;
  totalUsd: number;
  freeShippingRemainingUsd: number;
  appliedCoupon: CouponDefinition | null;
  couponError: string | null;
}

export function getUnitPriceUsd(product: Product, variantId?: string): number {
  if (!variantId || !product.variants) {
    return product.price;
  }
  const found = product.variants.find((v) => v.id === variantId);
  return Math.round((product.price + (found?.priceDelta ?? 0)) * 100) / 100;
}

export function validateCoupon(
  rawCode: string | undefined,
  subtotalUsd: number
): { coupon: CouponDefinition | null; error: string | null } {
  const code = rawCode?.trim().toUpperCase();
  if (!code) {
    return { coupon: null, error: null };
  }
  const coupon = COUPONS.find((c) => c.code === code);
  if (!coupon) {
    return { coupon: null, error: `Coupon "${code}" is invalid or expired.` };
  }
  if (coupon.minSubtotal && subtotalUsd < coupon.minSubtotal) {
    return {
      coupon: null,
      error: `Minimum order of $${coupon.minSubtotal.toFixed(2)} required for ${coupon.code}.`,
    };
  }
  return { coupon, error: null };
}

export function calculateCartTotals(
  items: CartItem[],
  productsById: Record<string, Product>,
  options: {
    couponCode?: string;
    deliveryMethod?: 'standard' | 'express' | 'pickup';
  } = {}
): CartTotals {
  let itemCount = 0;
  let subtotalUsd = 0;

  for (const item of items) {
    const product = productsById[item.productId];
    if (!product || item.quantity <= 0) continue;
    const unitPrice = getUnitPriceUsd(product, item.variantId);
    itemCount += item.quantity;
    subtotalUsd += unitPrice * item.quantity;
  }

  subtotalUsd = Math.round(subtotalUsd * 100) / 100;

  const { coupon, error: couponError } = validateCoupon(options.couponCode, subtotalUsd);

  let discountUsd = 0;
  if (coupon) {
    discountUsd =
      coupon.type === 'percent'
        ? Math.round(subtotalUsd * (coupon.value / 100) * 100) / 100
        : Math.min(subtotalUsd, coupon.value);
  }

  const discountedSubtotal = Math.max(0, Math.round((subtotalUsd - discountUsd) * 100) / 100);

  let shippingUsd = 0;
  if (items.length > 0 && discountedSubtotal > 0) {
    if (options.deliveryMethod === 'express') {
      shippingUsd = SITE_CONFIG.expressShippingUsd;
    } else if (options.deliveryMethod === 'pickup') {
      shippingUsd = 0;
    } else {
      shippingUsd =
        discountedSubtotal >= SITE_CONFIG.freeShippingThresholdUsd
          ? 0
          : SITE_CONFIG.standardShippingUsd;
    }
  }

  const taxUsd = Math.round(discountedSubtotal * SITE_CONFIG.taxRate * 100) / 100;
  const totalUsd = Math.round((discountedSubtotal + shippingUsd + taxUsd) * 100) / 100;
  const freeShippingRemainingUsd = Math.max(
    0,
    Math.round((SITE_CONFIG.freeShippingThresholdUsd - discountedSubtotal) * 100) / 100
  );

  return {
    itemCount,
    subtotalUsd,
    discountUsd,
    shippingUsd,
    taxUsd,
    totalUsd,
    freeShippingRemainingUsd,
    appliedCoupon: coupon,
    couponError,
  };
}
