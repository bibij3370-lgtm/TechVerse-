export type CurrencyCode = 'USD' | 'GBP' | 'AED' | 'EUR';

export type CountryCode = 'US' | 'UK' | 'UAE';

export type CategorySlug =
  | 'gadgets'
  | 'smart-home'
  | 'audio'
  | 'wearables'
  | 'accessories'
  | 'deals';

export interface ProductVariant {
  id: string;
  label: string;
  colorHex?: string;
  priceDelta?: number;
  stock: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  brand: string;
  category: CategorySlug;
  secondaryCategories?: CategorySlug[];
  description: string;
  price: number;
  originalPrice?: number;
  currency: 'USD';
  images: string[];
  rating: number;
  reviewCount: number;
  wishlistCount: number;
  stock: number;
  sku: string;
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  discountPercentage?: number;
}

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  subtitle: string;
  description: string;
  image?: string;
  isDeals?: boolean;
}

export interface IdeaCollection {
  id: string;
  slug: string;
  title: string;
  ideaCount: number;
  image: string;
  subtitle: string;
  description: string;
  featuredProductIds: string[];
  tips: string[];
}

export interface CartItem {
  productId: string;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
}

export interface CouponDefinition {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotal?: number;
  description: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  addresses: SavedAddress[];
  createdAt: string;
}

export type OrderStatus = 'Confirmed (Demo)' | 'Processing' | 'Shipped' | 'Delivered';

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: OrderStatus;
  isDemoOrder: boolean;
  currency: CurrencyCode;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  deliveryMethod: {
    id: string;
    label: string;
    eta: string;
    costUsd: number;
  };
  paymentMethodLabel: string;
  items: Array<{
    productId: string;
    slug: string;
    name: string;
    image: string;
    variantLabel?: string;
    unitPriceUsd: number;
    quantity: number;
  }>;
  subtotalUsd: number;
  discountUsd: number;
  shippingUsd: number;
  taxUsd: number;
  totalUsd: number;
  couponCode?: string;
}

export type ProductSortOption =
  | 'popularity'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'rating';

export interface ProductFilterState {
  category: CategorySlug | 'all';
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  query: string;
}
