import type { CategoryMeta } from '../types';

export const CATEGORY_SHORTCUTS: CategoryMeta[] = [
  {
    slug: 'audio',
    name: 'Audio',
    subtitle: 'Premium Sound',
    description: 'Studio ANC headphones, lossless earbuds, and portable Bluetooth speakers.',
    image: '/src/assets/images/prod_headphones_1795440750594.jpg',
  },
  {
    slug: 'smart-home',
    name: 'Smart Devices',
    subtitle: 'Smarter Living',
    description: 'Ambient voice hubs, connected lighting, and intelligent home automation.',
    image: '/src/assets/images/prod_smarthub_1795440749971.jpg',
  },
  {
    slug: 'wearables',
    name: 'Wearables',
    subtitle: 'Track. Achieve.',
    description: 'AMOLED smartwatches, precision health sensors, and endurance bands.',
    image: '/src/assets/images/prod_smartwatch_1795440751359.jpg',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    subtitle: 'Designed for You',
    description: 'Aramid MagSafe cases, GaN chargers, USB-C hubs, and mechanical keyboards.',
    image: '/src/assets/images/prod_accessories_1795440749733.jpg',
  },
  {
    slug: 'deals',
    name: 'Deals',
    subtitle: 'Top Deals Today',
    description: 'Limited-run markdowns on flagship tech gadgets and creator bundles.',
    isDeals: true,
  },
];

export const SECONDARY_NAV_ITEMS: Array<{ slug: string; label: string; to: string }> = [
  { slug: 'gadgets', label: 'Gadgets', to: '/category/gadgets' },
  { slug: 'smart-home', label: 'Smart Home', to: '/category/smart-home' },
  { slug: 'audio', label: 'Audio', to: '/category/audio' },
  { slug: 'wearables', label: 'Wearables', to: '/category/wearables' },
  { slug: 'accessories', label: 'Accessories', to: '/category/accessories' },
  { slug: 'deals', label: 'Sale', to: '/deals' },
];
