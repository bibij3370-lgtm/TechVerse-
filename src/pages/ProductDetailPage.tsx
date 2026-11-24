import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  ZoomIn,
  ZoomOut,
  Check,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { catalogService } from '../services/catalogService';
import { useShopStore } from '../store/useShopStore';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/currency';
import { getUnitPriceUsd } from '../utils/pricing';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SmartImage } from '../components/common/SmartImage';
import { EmptyState } from '../components/common/StateViews';
import { ProductCard } from '../components/products/ProductCard';
import { usePageMeta } from '../hooks/usePageMeta';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = slug ? catalogService.getProductBySlug(slug) : undefined;
  const currency = useShopStore((s) => s.currency);
  const wishlist = useShopStore((s) => s.wishlist);
  const recentlyViewed = useShopStore((s) => s.recentlyViewed);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const addToCart = useShopStore((s) => s.addToCart);
  const trackViewed = useShopStore((s) => s.trackViewed);
  const pushToast = useUIStore((s) => s.pushToast);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id
  );

  useEffect(() => {
    setActiveImageIdx(0);
    setIsZoomed(false);
    setQuantity(1);
    setSelectedVariantId(product?.variants?.[0]?.id);
    if (product) {
      trackViewed(product.id);
    }
  }, [product?.id]);

  usePageMeta(
    product ? `${product.name} | TechVerse` : 'Product Not Found | TechVerse',
    product?.shortDescription
  );

  if (!product) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12">
        <EmptyState
          title="Product not found"
          description="This item may have been discontinued or moved. Browse our full catalog for similar gadgets."
          actionLabel="Explore Shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const unitPriceUsd = getUnitPriceUsd(product, selectedVariantId);
  const isWishlisted = wishlist.includes(product.id);
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = availableStock <= 0;

  const related = catalogService.getRelatedProducts(product, 4);
  const recentProducts = recentlyViewed
    .filter((id) => id !== product.id)
    .map((id) => catalogService.getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.description,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: unitPriceUsd.toFixed(2),
      availability: isOutOfStock
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity, selectedVariant?.id, selectedVariant?.label);
    pushToast({
      title: 'Added to Cart',
      description: `${quantity} × ${product.name}`,
      tone: 'success',
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity, selectedVariant?.id, selectedVariant?.label);
    navigate('/checkout');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: product.category, to: `/category/${product.category}` },
          { label: product.name },
        ]}
      />

      {/* Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gallery + Zoom */}
        <div className="lg:col-span-6 lg:sticky lg:top-[128px] space-y-3">
          <div className="relative aspect-square rounded-2xl bg-[#F6F6F6] dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 overflow-hidden flex items-center justify-center">
            <SmartImage
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              loading="eager"
              className={`w-full h-full object-contain p-8 transition-transform duration-300 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            />
            <button
              type="button"
              onClick={() => setIsZoomed((z) => !z)}
              aria-label={isZoomed ? 'Zoom out image' : 'Zoom in image'}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 border border-[#EAEAEA] dark:border-zinc-700 flex items-center justify-center text-[#151515] dark:text-white shadow-sm cursor-pointer"
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`View product angle ${idx + 1}`}
                  className={`w-20 h-20 rounded-xl bg-[#F6F6F6] dark:bg-zinc-900 border p-1.5 overflow-hidden cursor-pointer transition-colors ${
                    activeImageIdx === idx
                      ? 'border-[#C8101E] ring-1 ring-[#C8101E]'
                      : 'border-[#EAEAEA] dark:border-zinc-800'
                  }`}
                >
                  <SmartImage
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Sticky Purchase Details */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#666666] dark:text-zinc-400 font-medium">
              <span className="uppercase tracking-wider">{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">{product.sku}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#151515] dark:text-white mt-1.5 tracking-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-sm">
              <span className="inline-flex items-center gap-1 font-semibold text-[#151515] dark:text-white tabular-nums">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[#666666] dark:text-zinc-400 tabular-nums">
                {product.reviewCount} verified reviews
              </span>
              <span aria-hidden="true" className="text-[#D4D4D8]">|</span>
              <span
                className={`font-semibold ${
                  isOutOfStock ? 'text-[#DC3545]' : 'text-[#218838]'
                }`}
              >
                {isOutOfStock ? 'Currently Out of Stock' : `In Stock (${availableStock} available)`}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-extrabold text-[#151515] dark:text-white tabular-nums">
                {formatPrice(unitPriceUsd, currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-[#888888] line-through tabular-nums">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                  {product.discountPercentage && (
                    <span className="text-xs font-bold text-[#C8101E]">
                      Save {product.discountPercentage}%
                    </span>
                  )}
                </>
              )}
            </div>

            <p className="text-sm text-[#444444] dark:text-zinc-300 mt-4 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#666666] dark:text-zinc-400 mb-2.5">
                Configuration: <span className="text-[#151515] dark:text-white">{selectedVariant?.label}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((variant) => {
                  const active = variant.id === selectedVariantId;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'border-[#C8101E] bg-[#C8101E]/8 text-[#C8101E]'
                          : 'border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#151515] dark:text-zinc-200 hover:border-[#151515]'
                      }`}
                    >
                      {variant.colorHex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15"
                          style={{ backgroundColor: variant.colorHex }}
                          aria-hidden="true"
                        />
                      )}
                      <span>{variant.label}</span>
                      {active && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 h-12 px-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#151515] dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(availableStock || 1, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#151515] dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 min-w-[180px] h-12 rounded-full bg-[#C8101E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#A80D18] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-[#C8101E] bg-[#C8101E]/10 text-[#C8101E]'
                    : 'border-[#EAEAEA] dark:border-zinc-700 text-[#151515] dark:text-white hover:border-[#C8101E]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 rounded-full border border-[#151515] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold text-[#151515] dark:text-white hover:bg-[#151515] hover:text-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Buy Now
              </button>
            )}
          </div>

          {/* Fulfillment Promises */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#EAEAEA] dark:border-zinc-800 text-xs text-[#555555] dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C8101E] shrink-0" aria-hidden="true" />
              <span>Free US/UK/UAE over $100</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#C8101E] shrink-0" aria-hidden="true" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C8101E] shrink-0" aria-hidden="true" />
              <span>2-Year TechVerse Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 pt-8 border-t border-[#EAEAEA] dark:border-zinc-800">
        <section className="lg:col-span-6">
          <h2 className="font-display text-xl font-bold text-[#151515] dark:text-white mb-4">
            Technical Specifications
          </h2>
          <div className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 overflow-hidden divide-y divide-[#EAEAEA] dark:divide-zinc-800">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div
                key={key}
                className="grid grid-cols-3 px-4 py-3 text-xs sm:text-sm bg-white dark:bg-[#141418]"
              >
                <span className="font-medium text-[#666666] dark:text-zinc-400">{key}</span>
                <span className="col-span-2 font-semibold text-[#151515] dark:text-zinc-100">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-6">
          <h2 className="font-display text-xl font-bold text-[#151515] dark:text-white mb-4">
            Customer Reviews
          </h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-3">
              {product.reviews.map((rev) => (
                <article
                  key={rev.id}
                  className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#151515] dark:text-white">{rev.author}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[#218838] font-medium">· Verified Buyer</span>
                      )}
                    </div>
                    <span className="text-xs text-[#777777] tabular-nums">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-[#151515] dark:text-white mt-2">
                    {rev.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555555] dark:text-zinc-400 mt-1">
                    {rev.comment}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 p-6 text-sm text-[#666666] dark:text-zinc-400">
              Rated {product.rating.toFixed(1)} out of 5 across {product.reviewCount} verified TechVerse buyers.
            </div>
          )}
        </section>
      </div>

      {/* Related & Recently Viewed */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-[#151515] dark:text-white mb-4">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {recentProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-[#151515] dark:text-white mb-4">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
