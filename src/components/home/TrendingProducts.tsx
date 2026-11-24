import React from 'react';
import { Link } from 'react-router-dom';
import { catalogService } from '../../services/catalogService';
import { ProductCard } from '../products/ProductCard';

export const TrendingProducts: React.FC = () => {
  const trending = catalogService.getTrendingProducts(6);

  return (
    <section aria-labelledby="trending-heading" className="mt-9">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2
          id="trending-heading"
          className="font-display text-xl sm:text-2xl font-bold text-[#151515] dark:text-white tracking-tight"
        >
          Trending Products
        </h2>
        <Link
          to="/shop"
          className="text-xs sm:text-sm font-semibold text-[#C8101E] hover:text-[#A80D18] transition-colors whitespace-nowrap"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {trending.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
