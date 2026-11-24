import React from 'react';
import type { ProductSortOption } from '../../types';

interface ProductSortProps {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
  totalCount: number;
}

export const ProductSort: React.FC<ProductSortProps> = ({
  value,
  onChange,
  totalCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs sm:text-sm text-[#666666] dark:text-zinc-400 tabular-nums">
        Showing <span className="font-semibold text-[#151515] dark:text-white">{totalCount}</span>{' '}
        {totalCount === 1 ? 'product' : 'products'}
      </p>

      <div className="flex items-center gap-2">
        <label
          htmlFor="catalog-sort-select"
          className="text-xs font-medium text-[#666666] dark:text-zinc-400 whitespace-nowrap"
        >
          Sort by:
        </label>
        <select
          id="catalog-sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as ProductSortOption)}
          className="rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs sm:text-sm font-medium text-[#151515] dark:text-zinc-100 focus:outline-none focus:border-[#C8101E] cursor-pointer"
        >
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};
