import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { catalogService } from '../services/catalogService';
import { DEFAULT_FILTERS, filterProducts, sortProducts } from '../utils/catalog';
import type { CategorySlug, ProductFilterState, ProductSortOption } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/common/StateViews';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductSort } from '../components/products/ProductSort';
import { ProductCard } from '../components/products/ProductCard';
import { usePageMeta } from '../hooks/usePageMeta';

interface CatalogPageProps {
  mode?: 'shop' | 'category' | 'new-arrivals' | 'deals' | 'search';
}

const CATEGORY_TITLES: Record<string, string> = {
  gadgets: 'Latest Tech Gadgets',
  'smart-home': 'Smart Home & Devices',
  audio: 'Audio & Studio Sound',
  wearables: 'Wearables & Fitness',
  accessories: 'Accessories & Charging',
  deals: 'Exclusive Deals',
};

export const CatalogPage: React.FC<CatalogPageProps> = ({ mode = 'shop' }) => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const urlSort = (searchParams.get('sort') as ProductSortOption | null) ?? 'popularity';

  const allProducts = useMemo(() => catalogService.getAllProducts(), []);
  const availableBrands = useMemo(() => catalogService.getBrands(), []);

  const [filters, setFilters] = useState<ProductFilterState>(() => ({
    ...DEFAULT_FILTERS,
    category: mode === 'category' && slug ? (slug as CategorySlug) : mode === 'deals' ? 'deals' : 'all',
    onSaleOnly: mode === 'deals',
    query: mode === 'search' ? urlQuery : '',
  }));

  const [sort, setSort] = useState<ProductSortOption>(
    mode === 'new-arrivals' ? 'newest' : urlSort
  );
  const [visibleCount, setVisibleCount] = useState(8);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      category:
        mode === 'category' && slug
          ? (slug as CategorySlug)
          : mode === 'deals'
          ? 'deals'
          : 'all',
      onSaleOnly: mode === 'deals',
      query: mode === 'search' ? urlQuery : '',
    });
    setSort(mode === 'new-arrivals' ? 'newest' : urlSort);
    setVisibleCount(8);
  }, [mode, slug, urlQuery, urlSort]);

  const pageTitle = useMemo(() => {
    if (mode === 'search') return urlQuery ? `Search: "${urlQuery}"` : 'Search Products';
    if (mode === 'new-arrivals') return 'New Arrivals';
    if (mode === 'deals') return 'Exclusive Deals & Offers';
    if (mode === 'category' && slug) return CATEGORY_TITLES[slug] ?? 'Category';
    return 'Shop All Tech';
  }, [mode, slug, urlQuery]);

  usePageMeta(
    `${pageTitle} | TechVerse`,
    `Browse ${pageTitle.toLowerCase()} at TechVerse with fast shipping, verified ratings, and transparent specs.`
  );

  const filteredProducts = useMemo(() => {
    let base = filterProducts(allProducts, filters);
    if (mode === 'new-arrivals') {
      base = base.filter((p) => p.newArrival);
    }
    return sortProducts(base, sort);
  }, [allProducts, filters, mode, sort]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleReset = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      category:
        mode === 'category' && slug
          ? (slug as CategorySlug)
          : mode === 'deals'
          ? 'deals'
          : 'all',
      onSaleOnly: mode === 'deals',
    });
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: pageTitle },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#151515] dark:text-white tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-sm text-[#666666] dark:text-zinc-400 mt-1">
            {mode === 'deals'
              ? 'Limited-run savings on flagship gadgets and studio accessories.'
              : mode === 'new-arrivals'
              ? 'Latest hardware releases engineered for your daily setup.'
              : 'Explore authentic electronics across audio, wearables, smart home, and creator gear.'}
          </p>
        </div>

        <div className="w-full md:w-80">
          <SearchBar initialQuery={filters.query} />
        </div>
      </div>

      {/* Mobile Filter Trigger */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-[#151515] dark:text-white cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#C8101E]" aria-hidden="true" />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Catalog Filters"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 w-[85vw] max-w-sm h-full bg-white dark:bg-[#121215] p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-base font-bold text-[#151515] dark:text-white">
                Filter Products
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-2 text-[#555555] dark:text-zinc-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductFilters
              filters={filters}
              availableBrands={availableBrands}
              onChange={setFilters}
              onReset={handleReset}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="hidden lg:block lg:col-span-3 sticky top-[128px]">
          <ProductFilters
            filters={filters}
            availableBrands={availableBrands}
            onChange={setFilters}
            onReset={handleReset}
          />
        </div>

        <div className="lg:col-span-9 space-y-5">
          <ProductSort
            value={sort}
            onChange={setSort}
            totalCount={filteredProducts.length}
          />

          {visibleProducts.length === 0 ? (
            <EmptyState
              title="No matching products found"
              description="Try adjusting your price range, clearing brand filters, or searching for a different keyword."
              actionLabel="Reset All Filters"
              onAction={handleReset}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 8)}
                    className="rounded-full border border-[#151515] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-8 py-2.5 text-sm font-semibold text-[#151515] dark:text-white hover:bg-[#151515] hover:text-white dark:hover:bg-[#C8101E] transition-colors cursor-pointer"
                  >
                    Load More Products ({filteredProducts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
