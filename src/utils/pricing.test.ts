import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotals, validateCoupon } from './pricing';
import { filterProducts, sortProducts, DEFAULT_FILTERS } from './catalog';
import { formatPrice } from './currency';
import type { Product } from '../types';

const sampleProducts: Product[] = [
  {
    id: 'p1',
    slug: 'smart-watch-series-9',
    name: 'Smart Watch Series 9',
    shortDescription: 'AMOLED fitness & health tracking smartwatch',
    brand: 'PulseTech',
    category: 'wearables',
    description: 'Flagship wearable',
    price: 299.99,
    originalPrice: 349.99,
    currency: 'USD',
    images: ['/img/watch.jpg'],
    rating: 4.8,
    reviewCount: 412,
    wishlistCount: 2100,
    stock: 14,
    sku: 'TV-SW-09',
    specifications: { Battery: '36h' },
    featured: true,
    trending: true,
    newArrival: true,
    discountPercentage: 14,
  },
  {
    id: 'p2',
    slug: 'wireless-earbuds-pro',
    name: 'Wireless Earbuds Pro',
    shortDescription: 'Active noise cancelling earbuds',
    brand: 'AetherAudio',
    category: 'audio',
    description: 'Studio ANC',
    price: 129.99,
    currency: 'USD',
    images: ['/img/earbuds.jpg'],
    rating: 4.6,
    reviewCount: 320,
    wishlistCount: 1600,
    stock: 0,
    sku: 'TV-EB-02',
    specifications: { ANC: '45dB' },
    featured: true,
    trending: true,
    newArrival: false,
  },
  {
    id: 'p3',
    slug: '3-in-1-wireless-charger',
    name: '3-in-1 Wireless Charger',
    shortDescription: 'MagSafe aluminum charging stand',
    brand: 'VoltCore',
    category: 'accessories',
    description: 'Fast charging dock',
    price: 49.99,
    originalPrice: 69.99,
    currency: 'USD',
    images: ['/img/charger.jpg'],
    rating: 4.9,
    reviewCount: 185,
    wishlistCount: 980,
    stock: 30,
    sku: 'TV-CH-03',
    specifications: { Output: '15W' },
    featured: false,
    trending: false,
    newArrival: true,
    discountPercentage: 29,
  },
];

const productsById = Object.fromEntries(sampleProducts.map((p) => [p.id, p]));

test('calculateCartTotals computes subtotal, free shipping threshold, tax, and coupon', () => {
  const totals = calculateCartTotals(
    [{ productId: 'p3', quantity: 1 }],
    productsById,
    { deliveryMethod: 'standard' }
  );
  assert.equal(totals.itemCount, 1);
  assert.equal(totals.subtotalUsd, 49.99);
  assert.equal(totals.shippingUsd, 9.99);
  assert.equal(totals.freeShippingRemainingUsd, 50.01);

  const freeShip = calculateCartTotals(
    [{ productId: 'p1', quantity: 1 }],
    productsById,
    { couponCode: 'TECH10', deliveryMethod: 'standard' }
  );
  assert.equal(freeShip.discountUsd, 30);
  assert.equal(freeShip.shippingUsd, 0);
  assert.equal(freeShip.appliedCoupon?.code, 'TECH10');
  assert.equal(freeShip.totalUsd, Math.round((269.99 + 269.99 * 0.08) * 100) / 100);
});

test('validateCoupon rejects invalid and below-minimum coupons', () => {
  const invalid = validateCoupon('NOPE', 200);
  assert.equal(invalid.coupon, null);
  assert.ok(invalid.error?.includes('invalid'));

  const lowSubtotal = validateCoupon('UPGRADE25', 80);
  assert.equal(lowSubtotal.coupon, null);
  assert.ok(lowSubtotal.error?.includes('Minimum order'));
});

test('filterProducts filters by category, stock, deals, and query', () => {
  const audioOnly = filterProducts(sampleProducts, { ...DEFAULT_FILTERS, category: 'audio' });
  assert.equal(audioOnly.length, 1);
  assert.equal(audioOnly[0].id, 'p2');

  const inStockDeals = filterProducts(sampleProducts, {
    ...DEFAULT_FILTERS,
    inStockOnly: true,
    onSaleOnly: true,
  });
  assert.equal(inStockDeals.length, 2);

  const searchWatch = filterProducts(sampleProducts, { ...DEFAULT_FILTERS, query: 'magsafe' });
  assert.equal(searchWatch.length, 1);
  assert.equal(searchWatch[0].id, 'p3');
});

test('sortProducts orders by price and rating accurately', () => {
  const lowToHigh = sortProducts(sampleProducts, 'price-asc');
  assert.deepEqual(
    lowToHigh.map((p) => p.id),
    ['p3', 'p2', 'p1']
  );

  const byRating = sortProducts(sampleProducts, 'rating');
  assert.equal(byRating[0].id, 'p3');
});

test('formatPrice converts currency cleanly', () => {
  assert.equal(formatPrice(100, 'USD'), '$100.00');
  assert.equal(formatPrice(100, 'GBP'), '£79.00');
  assert.equal(formatPrice(100, 'AED'), 'AED 367.00');
});
