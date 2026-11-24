import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useShopStore } from '../../store/useShopStore';
import { PRODUCTS_BY_ID } from '../../data/products';
import { calculateCartTotals, getUnitPriceUsd } from '../../utils/pricing';
import { formatPrice } from '../../utils/currency';
import { SITE_CONFIG } from '../../config/site';
import { SmartImage } from '../common/SmartImage';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const isOpen = useUIStore((s) => s.isCartDrawerOpen);
  const closeCartDrawer = useUIStore((s) => s.closeCartDrawer);

  const cart = useShopStore((s) => s.cart);
  const currency = useShopStore((s) => s.currency);
  const couponCode = useShopStore((s) => s.couponCode);
  const deliveryMethod = useShopStore((s) => s.deliveryMethod);
  const updateCartQuantity = useShopStore((s) => s.updateCartQuantity);
  const removeFromCart = useShopStore((s) => s.removeFromCart);
  const setCouponCode = useShopStore((s) => s.setCouponCode);

  const [couponInput, setCouponInput] = useState(couponCode);

  if (!isOpen) return null;

  const totals = calculateCartTotals(cart, PRODUCTS_BY_ID, {
    couponCode,
    deliveryMethod,
  });

  const freeShippingProgress = Math.min(
    100,
    Math.round(
      ((SITE_CONFIG.freeShippingThresholdUsd - totals.freeShippingRemainingUsd) /
        SITE_CONFIG.freeShippingThresholdUsd) *
        100
    )
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponCode(couponInput.trim().toUpperCase());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        onClick={closeCartDrawer}
      />
      <aside className="relative z-10 w-full max-w-md h-full bg-white dark:bg-[#121215] border-l border-[#EAEAEA] dark:border-zinc-800 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEAEA] dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C8101E]" aria-hidden="true" />
            <h2 className="font-display text-base font-bold text-[#151515] dark:text-white">
              Your Cart ({totals.itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCartDrawer}
            aria-label="Close shopping cart"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#555555] dark:text-zinc-400 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-[#F9F9FA] dark:bg-zinc-900/70 border-b border-[#EAEAEA] dark:border-zinc-800">
            <p className="text-xs font-medium text-[#333333] dark:text-zinc-300 mb-1.5">
              {totals.freeShippingRemainingUsd === 0
                ? 'Unlocked free standard worldwide shipping!'
                : `Add ${formatPrice(totals.freeShippingRemainingUsd, currency)} more for free standard shipping`}
            </p>
            <div className="w-full h-1.5 rounded-full bg-[#EAEAEA] dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-[#218838] transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 flex items-center justify-center text-[#C8101E] mb-3">
                <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="font-display text-base font-bold text-[#151515] dark:text-white">
                Your cart is empty
              </p>
              <p className="text-xs text-[#666666] dark:text-zinc-400 mt-1 max-w-[240px]">
                Explore trending audio, wearables, and smart gadgets to get started.
              </p>
              <Link
                to="/shop"
                onClick={closeCartDrawer}
                className="mt-5 rounded-full bg-[#C8101E] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#A80D18] transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            cart.map((item) => {
              const product = PRODUCTS_BY_ID[item.productId];
              if (!product) return null;
              const unitPriceUsd = getUnitPriceUsd(product, item.variantId);
              return (
                <div
                  key={`${item.productId}-${item.variantId ?? 'default'}`}
                  className="flex gap-3 pb-4 border-b border-[#EAEAEA] dark:border-zinc-800 last:border-b-0"
                >
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={closeCartDrawer}
                    className="w-20 h-20 rounded-xl bg-[#F6F6F6] dark:bg-zinc-900 shrink-0 overflow-hidden p-1.5"
                  >
                    <SmartImage
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={closeCartDrawer}
                        className="text-sm font-semibold text-[#151515] dark:text-white hover:text-[#C8101E] truncate"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        aria-label={`Remove ${product.name}`}
                        className="p-1 text-[#888888] hover:text-[#DC3545] transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variantLabel && (
                      <p className="text-[11px] text-[#666666] dark:text-zinc-400 mt-0.5 truncate">
                        {item.variantLabel}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center rounded-lg border border-[#EAEAEA] dark:border-zinc-700">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.quantity - 1, item.variantId)
                          }
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="w-8 h-8 flex items-center justify-center text-[#333333] dark:text-zinc-300 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums text-[#151515] dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.quantity + 1, item.variantId)
                          }
                          aria-label={`Increase quantity of ${product.name}`}
                          className="w-8 h-8 flex items-center justify-center text-[#333333] dark:text-zinc-300 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold tabular-nums text-[#151515] dark:text-white">
                        {formatPrice(unitPriceUsd * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#EAEAEA] dark:border-zinc-800 bg-[#F9F9FA] dark:bg-zinc-900/60 space-y-3">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag
                  className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo code (e.g. TECH10)"
                  aria-label="Promo code"
                  className="w-full h-9 rounded-lg border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-8 pr-3 text-xs text-[#151515] dark:text-white focus:outline-none focus:border-[#C8101E]"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 h-9 rounded-lg bg-[#151515] dark:bg-zinc-800 text-white text-xs font-semibold hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {totals.couponError && (
              <p className="text-[11px] text-[#DC3545]">{totals.couponError}</p>
            )}
            {totals.appliedCoupon && (
              <div className="flex items-center justify-between text-[11px] text-[#218838] font-medium">
                <span>
                  Coupon {totals.appliedCoupon.code} ({totals.appliedCoupon.description})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCouponInput('');
                    setCouponCode('');
                  }}
                  className="underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-[#555555] dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#151515] dark:text-zinc-200">
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
                <span>Estimated Shipping</span>
                <span className="tabular-nums font-medium text-[#151515] dark:text-zinc-200">
                  {totals.shippingUsd === 0 ? 'Free' : formatPrice(totals.shippingUsd, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#151515] dark:text-white pt-1.5 border-t border-[#EAEAEA] dark:border-zinc-800">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatPrice(totals.totalUsd, currency)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/cart"
                onClick={closeCartDrawer}
                className="min-h-[42px] rounded-full border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-[#151515] dark:text-white flex items-center justify-center hover:border-[#151515] transition-colors"
              >
                View Cart
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  navigate('/checkout');
                }}
                className="min-h-[42px] rounded-full bg-[#C8101E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#A80D18] transition-colors cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
