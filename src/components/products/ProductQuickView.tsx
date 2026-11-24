import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useShopStore } from '../../store/useShopStore';
import { catalogService } from '../../services/catalogService';
import { formatPrice } from '../../utils/currency';
import { getUnitPriceUsd } from '../../utils/pricing';
import { SmartImage } from '../common/SmartImage';

export const ProductQuickView: React.FC = () => {
  const productId = useUIStore((s) => s.quickViewProductId);
  const closeQuickView = useUIStore((s) => s.closeQuickView);
  const pushToast = useUIStore((s) => s.pushToast);

  const currency = useShopStore((s) => s.currency);
  const wishlist = useShopStore((s) => s.wishlist);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const addToCart = useShopStore((s) => s.addToCart);

  const product = productId ? catalogService.getProductById(productId) : undefined;
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setSelectedVariantId(product?.variants?.[0]?.id);
  }, [product?.id]);

  if (!product) return null;

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const unitPriceUsd = getUnitPriceUsd(product, selectedVariantId);
  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0 || (selectedVariant && selectedVariant.stock <= 0);

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product.id, 1, selectedVariant?.id, selectedVariant?.label);
    pushToast({
      title: 'Added to Cart',
      description: `${product.name}${selectedVariant ? ` · ${selectedVariant.label}` : ''}`,
      tone: 'success',
    });
    closeQuickView();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      onClick={closeQuickView}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#141418] border border-[#EAEAEA] dark:border-zinc-800 shadow-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-800/90 border border-[#EAEAEA] dark:border-zinc-700 flex items-center justify-center text-[#151515] dark:text-white hover:border-[#C8101E] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-[#F6F6F6] dark:bg-zinc-900 flex items-center justify-center p-6 min-h-[260px]">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            className="w-full max-h-[280px] object-contain"
          />
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#666666] dark:text-zinc-400">
              {product.brand} · {product.sku}
            </p>
            <h2
              id="quick-view-title"
              className="font-display text-xl font-bold text-[#151515] dark:text-white mt-1"
            >
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mt-2 text-xs text-[#666666] dark:text-zinc-400">
              <span className="inline-flex items-center gap-1 font-semibold text-[#151515] dark:text-zinc-200 tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                {product.rating.toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{product.reviewCount} reviews</span>
              <span aria-hidden="true">·</span>
              <span className={isOutOfStock ? 'text-[#DC3545] font-medium' : 'text-[#218838] font-medium'}>
                {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-bold text-[#151515] dark:text-white tabular-nums">
                {formatPrice(unitPriceUsd, currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[#888888] line-through tabular-nums">
                  {formatPrice(product.originalPrice, currency)}
                </span>
              )}
            </div>

            <p className="text-xs text-[#555555] dark:text-zinc-400 mt-3 leading-relaxed">
              {product.description}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#151515] dark:text-zinc-200 mb-2">
                  Option: {selectedVariant?.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const active = variant.id === selectedVariantId;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#C8101E] bg-[#C8101E]/8 text-[#C8101E]'
                            : 'border-[#EAEAEA] dark:border-zinc-700 text-[#333333] dark:text-zinc-300 hover:border-[#151515]'
                        }`}
                      >
                        {variant.colorHex && (
                          <span
                            className="w-3 h-3 rounded-full border border-black/15"
                            style={{ backgroundColor: variant.colorHex }}
                            aria-hidden="true"
                          />
                        )}
                        <span>{variant.label}</span>
                        {active && <Check className="w-3 h-3" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2.5">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAdd}
                className="flex-1 min-h-[44px] rounded-full bg-[#C8101E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#A80D18] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Unavailable' : 'Add to Cart'}</span>
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-[#C8101E] bg-[#C8101E]/10 text-[#C8101E]'
                    : 'border-[#EAEAEA] dark:border-zinc-700 text-[#333333] dark:text-zinc-200 hover:border-[#C8101E]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
            <Link
              to={`/product/${product.slug}`}
              onClick={closeQuickView}
              className="w-full inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#555555] dark:text-zinc-400 hover:text-[#C8101E] py-1"
            >
              <span>View Full Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
