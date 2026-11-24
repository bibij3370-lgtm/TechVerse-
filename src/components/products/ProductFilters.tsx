import React from 'react';
import { Star, RotateCcw } from 'lucide-react';
import type { CategorySlug, ProductFilterState } from '../../types';

interface ProductFiltersProps {
  filters: ProductFilterState;
  availableBrands: string[];
  onChange: (next: ProductFilterState) => void;
  onReset: () => void;
}

const CATEGORIES: Array<{ slug: CategorySlug | 'all'; label: string }> = [
  { slug: 'all', label: 'All Categories' },
  { slug: 'gadgets', label: 'Gadgets' },
  { slug: 'audio', label: 'Audio' },
  { slug: 'smart-home', label: 'Smart Home' },
  { slug: 'wearables', label: 'Wearables' },
  { slug: 'accessories', label: 'Accessories' },
  { slug: 'deals', label: 'Deals & Offers' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  availableBrands,
  onChange,
  onReset,
}) => {
  const toggleBrand = (brand: string) => {
    const exists = filters.brands.includes(brand);
    onChange({
      ...filters,
      brands: exists
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand],
    });
  };

  return (
    <aside className="space-y-6 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-[#151515] dark:text-white">
          Filters
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8101E] hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#666666] dark:text-zinc-400 mb-2.5">
          Category
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onChange({ ...filters, category: cat.slug })}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#C8101E]/10 text-[#C8101E] font-semibold'
                    : 'text-[#333333] dark:text-zinc-300 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#666666] dark:text-zinc-400 mb-2.5">
          Brand
        </h3>
        <div className="space-y-2">
          {availableBrands.map((brand) => {
            const checked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 text-xs text-[#333333] dark:text-zinc-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded border-[#D4D4D8] text-[#C8101E] focus:ring-[#C8101E]"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Max Price */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#666666] dark:text-zinc-400">
            Max Price (USD)
          </h3>
          <span className="text-xs font-bold tabular-nums text-[#151515] dark:text-white">
            ${filters.maxPrice}
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={1000}
          step={25}
          value={filters.maxPrice}
          aria-label="Maximum price in USD"
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-[#C8101E] cursor-pointer"
        />
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#666666] dark:text-zinc-400 mb-2">
          Minimum Rating
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {[0, 4, 4.5, 4.8].map((r) => {
            const active = filters.minRating === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onChange({ ...filters, minRating: r })}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors ${
                  active
                    ? 'border-[#C8101E] bg-[#C8101E] text-white'
                    : 'border-[#EAEAEA] dark:border-zinc-700 text-[#333333] dark:text-zinc-300 hover:border-[#151515]'
                }`}
              >
                {r === 0 ? (
                  'Any'
                ) : (
                  <>
                    <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                    <span className="tabular-nums">{r}+</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2.5 pt-2 border-t border-[#EAEAEA] dark:border-zinc-800">
        <label className="flex items-center justify-between text-xs text-[#333333] dark:text-zinc-300 cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded accent-[#C8101E]"
          />
        </label>
        <label className="flex items-center justify-between text-xs text-[#333333] dark:text-zinc-300 cursor-pointer">
          <span>On Sale / Discounted</span>
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={(e) => onChange({ ...filters, onSaleOnly: e.target.checked })}
            className="w-4 h-4 rounded accent-[#C8101E]"
          />
        </label>
      </div>
    </aside>
  );
};
