import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { PRODUCTS_BY_ID } from '../data/products';
import { calculateCartTotals, COUPONS, getUnitPriceUsd } from '../utils/pricing';
import { formatPrice } from '../utils/currency';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/StateViews';
import { SmartImage } from '../components/common/SmartImage';
import { usePageMeta } from '../hooks/usePageMeta';

export const CartPage: React.FC = () => {
  usePageMeta('Shopping Cart | TechVerse', 'Review your selected TechVerse items, apply promo codes, and proceed to checkout.');

  const navigate = useNavigate();
  const cart = useShopStore((s) => s.cart);
  const currency = useShopStore((s) => s.currency);
  const couponCode = useShopStore((s) => s.couponCode);
  const deliveryMethod = useShopStore((s) => s.deliveryMethod);
  const updateCartQuantity = useShopStore((s) => s.updateCartQuantity);
  const removeFromCart = useShopStore((s) => s.removeFromCart);
  const setCouponCode = useShopStore((s) => s.setCouponCode);
  const setDeliveryMethod = useShopStore((s) => s.setDeliveryMethod);

  const [couponInput, setCouponInput] = useState(couponCode);

  const totals = calculateCartTotals(cart, PRODUCTS_BY_ID, {
    couponCode,
    deliveryMethod,
  });

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shopping Cart' }]} />

      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#151515] dark:text-white mb-6">
        Shopping Cart ({totals.itemCount})
      </h1>

      {cart.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-6 h-6" />}
          title="Your shopping cart is empty"
          description="Discover trending smartwatches, noise-canceling audio, and desktop upgrades."
          actionLabel="Start Shopping"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const product = PRODUCTS_BY_ID[item.productId];
              if (!product) return null;
              const unitPriceUsd = getUnitPriceUsd(product, item.variantId);
              return (
                <div
                  key={`${item.productId}-${item.variantId ?? 'default'}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Link
                      to={`/product/${product.slug}`}
                      className="w-24 h-24 rounded-xl bg-[#F6F6F6] dark:bg-zinc-900 shrink-0 p-2 overflow-hidden"
                    >
                      <SmartImage
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </Link>
                    <div className="min-w-0">
                      <p className="text-xs text-[#666666] dark:text-zinc-400 uppercase tracking-wider">
                        {product.brand}
                      </p>
                      <Link
                        to={`/product/${product.slug}`}
                        className="text-base font-bold text-[#151515] dark:text-white hover:text-[#C8101E] block truncate"
                      >
                        {product.name}
                      </Link>
                      {item.variantLabel && (
                        <p className="text-xs text-[#666666] dark:text-zinc-400 mt-0.5">
                          {item.variantLabel}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-[#151515] dark:text-zinc-200 tabular-nums mt-1">
                        {formatPrice(unitPriceUsd, currency)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="inline-flex items-center rounded-xl border border-[#EAEAEA] dark:border-zinc-700">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.quantity - 1, item.variantId)
                        }
                        aria-label={`Decrease quantity for ${product.name}`}
                        className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.quantity + 1, item.variantId)
                        }
                        aria-label={`Increase quantity for ${product.name}`}
                        className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-base font-extrabold tabular-nums min-w-[84px] text-right">
                      {formatPrice(unitPriceUsd * item.quantity, currency)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      aria-label={`Remove ${product.name} from cart`}
                      className="p-2 text-[#777777] hover:text-[#DC3545] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="lg:col-span-4 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#F9F9FA] dark:bg-[#141418] p-6 space-y-5 sticky top-[128px]">
            <h2 className="font-display text-lg font-bold text-[#151515] dark:text-white">
              Order Summary
            </h2>

            <div>
              <label
                htmlFor="cart-delivery-select"
                className="block text-xs font-semibold uppercase tracking-wider text-[#666666] dark:text-zinc-400 mb-2"
              >
                Delivery Method
              </label>
              <select
                id="cart-delivery-select"
                value={deliveryMethod}
                onChange={(e) =>
                  setDeliveryMethod(e.target.value as 'standard' | 'express' | 'pickup')
                }
                className="w-full rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium text-[#151515] dark:text-white"
              >
                <option value="standard">Standard Worldwide (Free over $100)</option>
                <option value="express">Express Courier (1–2 Days · $19.99)</option>
                <option value="pickup">TechVerse Hub Pickup (Free)</option>
              </select>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCouponCode(couponInput.trim().toUpperCase());
              }}
              className="space-y-2"
            >
              <label
                htmlFor="cart-coupon-input"
                className="block text-xs font-semibold uppercase tracking-wider text-[#666666] dark:text-zinc-400"
              >
                Promo Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag
                    className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    id="cart-coupon-input"
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="TECH10 or UPGRADE25"
                    className="w-full h-10 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-[#151515] dark:bg-zinc-800 text-white text-xs font-semibold hover:bg-[#333333] cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <p className="text-[11px] text-[#666666] dark:text-zinc-400">
                Available codes: {COUPONS.map((c) => c.code).join(', ')}
              </p>
              {totals.couponError && (
                <p className="text-xs text-[#DC3545]">{totals.couponError}</p>
              )}
              {totals.appliedCoupon && (
                <p className="text-xs text-[#218838] font-medium">
                  Applied {totals.appliedCoupon.code}: {totals.appliedCoupon.description}
                </p>
              )}
            </form>

            <div className="space-y-2 pt-3 border-t border-[#EAEAEA] dark:border-zinc-800 text-sm">
              <div className="flex justify-between text-[#555555] dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#151515] dark:text-white">
                  {formatPrice(totals.subtotalUsd, currency)}
                </span>
              </div>
              {totals.discountUsd > 0 && (
                <div className="flex justify-between text-[#218838]">
                  <span>Discount</span>
                  <span className="tabular-nums font-medium">
                    -{formatPrice(totals.discountUsd, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#555555] dark:text-zinc-400">
                <span>Shipping</span>
                <span className="tabular-nums font-medium text-[#151515] dark:text-white">
                  {totals.shippingUsd === 0 ? 'Free' : formatPrice(totals.shippingUsd, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#555555] dark:text-zinc-400">
                <span>Estimated Tax (8%)</span>
                <span className="tabular-nums font-medium text-[#151515] dark:text-white">
                  {formatPrice(totals.taxUsd, currency)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#151515] dark:text-white pt-2 border-t border-[#EAEAEA] dark:border-zinc-800">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(totals.totalUsd, currency)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full min-h-[46px] rounded-full bg-[#C8101E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#A80D18] transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};
