import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useShopStore } from '../../store/useShopStore';
import { useUIStore } from '../../store/useUIStore';
import { formatCompactCount, formatPrice } from '../../utils/currency';
import { SmartImage } from '../common/SmartImage';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, compact = false }) => {
  const currency = useShopStore((s) => s.currency);
  const wishlist = useShopStore((s) => s.wishlist);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const addToCart = useShopStore((s) => s.addToCart);
  const openQuickView = useUIStore((s) => s.openQuickView);
  const pushToast = useUIStore((s) => s.pushToast);

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;
  const hasDiscount =
    (product.discountPercentage && product.discountPercentage > 0) ||
    (product.originalPrice && product.originalPrice > product.price);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    pushToast({
      title: added ? 'Added to Wishlist' : 'Removed from Wishlist',
      description: product.name,
      tone: 'info',
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultVariant = product.variants?.[0];
    addToCart(product.id, 1, defaultVariant?.id, defaultVariant?.label);
    pushToast({
      title: 'Added to Cart',
      description: product.name,
      tone: 'success',
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.id);
  };

  return (
    <article className="group flex flex-col rounded-2xl bg-white dark:bg-[#141418] border border-[#EAEAEA] dark:border-zinc-800/90 p-3 transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(21,21,21,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
      {/* Product Image Surface */}
      <div className="relative aspect-square w-full rounded-xl bg-[#F6F6F6] dark:bg-zinc-900 overflow-hidden mb-3">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Single subtle top-left tag max (No badge spam) */}
        {isOutOfStock ? (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-[#151515]/85 text-white px-2 py-0.5 text-[11px] font-semibold">
            Out of Stock
          </span>
        ) : hasDiscount && product.discountPercentage ? (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-[#C8101E] text-white px-2 py-0.5 text-[11px] font-semibold tabular-nums">
            -{product.discountPercentage}%
          </span>
        ) : null}

        {/* Action Overlay Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={
              isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
            }
            aria-pressed={isWishlisted}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-[#C8101E] border-[#C8101E] text-white'
                : 'bg-white/90 dark:bg-zinc-800/90 border-[#EAEAEA] dark:border-zinc-700 text-[#333333] dark:text-zinc-200 hover:border-[#C8101E] hover:text-[#C8101E]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-800/90 border border-[#EAEAEA] dark:border-zinc-700 text-[#333333] dark:text-zinc-200 flex items-center justify-center hover:border-[#151515] dark:hover:border-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 min-w-0">
        {!compact && (
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#666666] dark:text-zinc-400 mb-0.5">
            <span className="uppercase tracking-wide font-medium truncate">{product.brand}</span>
            <span className="inline-flex items-center gap-1 tabular-nums shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span>{product.rating.toFixed(1)}</span>
            </span>
          </div>
        )}

        <Link
          to={`/product/${product.slug}`}
          className="text-[13.5px] font-semibold text-[#151515] dark:text-zinc-100 hover:text-[#C8101E] transition-colors truncate"
          title={product.name}
        >
          {product.name}
        </Link>

        {!compact && (
          <p className="text-xs text-[#666666] dark:text-zinc-400 line-clamp-1 mt-0.5">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-2 pt-1 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-sm font-bold text-[#151515] dark:text-white tabular-nums">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-[#888888] line-through tabular-nums">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] text-[#666666] dark:text-zinc-400 tabular-nums shrink-0">
            <Heart className="w-3 h-3 fill-[#C8101E] text-[#C8101E]" aria-hidden="true" />
            <span>{formatCompactCount(product.wishlistCount + (isWishlisted ? 1 : 0))}</span>
          </span>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`mt-2.5 w-full min-h-[38px] rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            isOutOfStock
              ? 'bg-[#F5F5F5] dark:bg-zinc-800 text-[#999999] dark:text-zinc-500 cursor-not-allowed'
              : 'bg-[#F5F5F5] dark:bg-zinc-800 text-[#151515] dark:text-zinc-100 hover:bg-[#C8101E] hover:text-white dark:hover:bg-[#C8101E]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isOutOfStock ? 'Unavailable' : 'Add to Cart'}</span>
        </button>
      </div>
    </article>
  );
});
