import type { Product, ProductFilterState, ProductSortOption } from '../types';

export const DEFAULT_FILTERS: ProductFilterState = {
  category: 'all',
  brands: [],
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  inStockOnly: false,
  onSaleOnly: false,
  query: '',
};

export function filterProducts(products: Product[], filters: ProductFilterState): Product[] {
  const q = filters.query.trim().toLowerCase();

  return products.filter((p) => {
    if (filters.category !== 'all') {
      const matchesPrimary = p.category === filters.category;
      const matchesSecondary = p.secondaryCategories?.includes(filters.category);
      const matchesDeals =
        filters.category === 'deals' &&
        ((p.discountPercentage && p.discountPercentage > 0) ||
          (p.originalPrice && p.originalPrice > p.price));

      if (!matchesPrimary && !matchesSecondary && !matchesDeals) {
        return false;
      }
    }

    if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
      return false;
    }

    if (p.price < filters.minPrice || p.price > filters.maxPrice) {
      return false;
    }

    if (filters.minRating > 0 && p.rating < filters.minRating) {
      return false;
    }

    if (filters.inStockOnly && p.stock <= 0) {
      return false;
    }

    if (
      filters.onSaleOnly &&
      !(p.discountPercentage && p.discountPercentage > 0) &&
      !(p.originalPrice && p.originalPrice > p.price)
    ) {
      return false;
    }

    if (q) {
      const haystack = [
        p.name,
        p.shortDescription,
        p.brand,
        p.category,
        p.description,
        p.sku,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }

    return true;
  });
}

export function sortProducts(products: Product[], sort: ProductSortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'newest':
      return copy.sort((a, b) => Number(b.newArrival) - Number(a.newArrival) || b.reviewCount - a.reviewCount);
    case 'popularity':
    default:
      return copy.sort(
        (a, b) =>
          Number(b.trending) - Number(a.trending) ||
          b.wishlistCount - a.wishlistCount ||
          b.reviewCount - a.reviewCount
      );
  }
}
