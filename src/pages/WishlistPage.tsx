import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { useUIStore } from '../store/useUIStore';
import { PRODUCTS_BY_ID } from '../data/products';
import { formatPrice } from '../utils/currency';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/StateViews';
import { SmartImage } from '../components/common/SmartImage';
import { usePageMeta } from '../hooks/usePageMeta';

export const WishlistPage: React.FC = () => {
  usePageMeta('Your Wishlist | TechVerse', 'Saved gadgets and electronics ready for your next upgrade.');

  const wishlist = useShopStore((s) => s.wishlist);
  const currency = useShopStore((s) => s.currency);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const moveWishlistToCart = useShopStore((s) => s.moveWishlistToCart);
  const pushToast = useUIStore((s) => s.pushToast);

  const items = wishlist.map((id) => PRODUCTS_BY_ID[id]).filter(Boolean);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />

      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#151515] dark:text-white">
          Saved Wishlist ({items.length})
        </h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-6 h-6" />}
          title="Your wishlist is empty"
          description="Save your favorite headphones, wearables, and desk gear to track deals or move them to your cart later."
          actionLabel="Explore Trending Gadgets"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <article
                key={product.id}
                className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-4 flex flex-col justify-between"
              >
                <div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="block aspect-square rounded-xl bg-[#F6F6F6] dark:bg-zinc-900 overflow-hidden mb-3"
                  >
                    <SmartImage
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </Link>
                  <p className="text-[11px] uppercase tracking-wider text-[#666666] dark:text-zinc-400">
                    {product.brand}
                  </p>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-sm font-bold text-[#151515] dark:text-white hover:text-[#C8101E] block mt-0.5"
                  >
                    {product.name}
                  </Link>
                  <p className="text-base font-bold text-[#151515] dark:text-white tabular-nums mt-2">
                    {formatPrice(product.price, currency)}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      moveWishlistToCart(product.id);
                      pushToast({
                        title: 'Moved to Cart',
                        description: product.name,
                        tone: 'success',
                      });
                    }}
                    className="flex-1 min-h-[40px] rounded-full bg-[#C8101E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#A80D18] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Move to Cart'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="w-10 h-10 rounded-full border border-[#EAEAEA] dark:border-zinc-700 flex items-center justify-center text-[#666666] hover:text-[#DC3545] hover:border-[#DC3545] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
