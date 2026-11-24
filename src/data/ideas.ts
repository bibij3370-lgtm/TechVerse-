import type { IdeaCollection } from '../types';

export const IDEA_COLLECTIONS: IdeaCollection[] = [
  {
    id: 'idea-tech-setup',
    slug: 'tech-setup-ideas',
    title: 'Tech Setup Ideas',
    ideaCount: 128,
    image: '/src/assets/images/idea_tech_setup_1795440750304.jpg',
    subtitle: 'Architectural creator desks built for deep focus and zero cable clutter.',
    description:
      'Pair CNC-milled wireless peripherals, calibrated desk lighting, and lossless studio monitoring for a workspace that inspires daily craft.',
    featuredProductIds: [
      'prod-aether-anc-headphones',
      'prod-keyforge-75-keyboard',
      'prod-3in1-wireless-charger',
      'prod-aramid-usbc-kit',
    ],
    tips: [
      'Route power through a single 3-in-1 magnetic charging pedestal to eliminate nightstand and desk cable sprawl.',
      'Elevate displays to eye level and reserve desk mat space for a compact 75% tactile mechanical keyboard.',
      'Use closed-back ANC over-ear headphones during deep engineering or editing blocks.',
    ],
  },
  {
    id: 'idea-travel-tech',
    slug: 'travel-tech-essentials',
    title: 'Travel Tech Essentials',
    ideaCount: 96,
    image: '/src/assets/images/idea_travel_tech_1795440802950.jpg',
    subtitle: 'Carry-on hardware engineered for flights, remote sprints, and field shoots.',
    description:
      'Compact power, foldable aerial imaging, pocket-sized active noise cancellation, and ruggedized audio built to fit cleanly inside one sling.',
    featuredProductIds: [
      'prod-wireless-earbuds-pro',
      'prod-smartphone-gimbal',
      'prod-4k-camera-drone',
      'prod-aramid-usbc-kit',
    ],
    tips: [
      'Pack braided USB-C multiport hubs so hotel TVs, SD cards, and fast chargers stay on one universal standard.',
      'A sub-250g foldable 4K drone unlocks aerial storytelling without bulky Pelican cases.',
      'Dual-device Bluetooth earbuds switch effortlessly between in-flight tablets and phones.',
    ],
  },
  {
    id: 'idea-smart-home',
    slug: 'smart-home-inspiration',
    title: 'Smart Home Inspiration',
    ideaCount: 74,
    image: '/src/assets/images/idea_smart_home_1795440750256.jpg',
    subtitle: 'Calm, voice-responsive living spaces with Matter-ready ambient hardware.',
    description:
      'Blend woven acoustic hubs and automated room routines seamlessly into natural timber, linen, and sunlit architectural interiors.',
    featuredProductIds: [
      'prod-ambient-smart-hub',
      'prod-portable-speaker',
      'prod-3in1-wireless-charger',
    ],
    tips: [
      'Position spatial smart hubs centrally on open shelving for 360-degree room acoustics.',
      'Automate evening dimming and morning focus playlists using Thread/Matter scenes.',
    ],
  },
  {
    id: 'idea-gaming-gear',
    slug: 'gaming-gear',
    title: 'Gaming Gear',
    ideaCount: 155,
    image: '/src/assets/images/idea_gaming_gear_1795440862504.jpg',
    subtitle: 'Low-latency wireless rigs, crisp acoustics, and restrained ambient lighting.',
    description:
      'High-polling mechanical switches, studio-grade spatial headsets, and clean desk ergonomics without garish plastic clutter.',
    featuredProductIds: [
      'prod-keyforge-75-keyboard',
      'prod-aether-anc-headphones',
      'prod-portable-speaker',
    ],
    tips: [
      'Choose gasket-mounted 75% mechanical boards for extra mouse sweep real estate.',
      'Warm indirect wall sconces reduce eye fatigue during late-night ultrawide sessions.',
    ],
  },
  {
    id: 'idea-minimal-desk',
    slug: 'minimal-desk-setup',
    title: 'Minimal Desk Setup',
    ideaCount: 87,
    image: '/src/assets/images/idea_minimal_desk_1795440861846.jpg',
    subtitle: 'Tactile wool felt mats, monochrome silhouettes, and distraction-free focus.',
    description:
      'Strip back visual noise with matte anodized finishes, pocketable wireless earbuds, and single-cable desktop docks.',
    featuredProductIds: [
      'prod-wireless-earbuds-pro',
      'prod-3in1-wireless-charger',
      'prod-smart-watch-9',
    ],
    tips: [
      'Anchor your desk zone with a neutral wool felt pad to dampen acoustics and frame essential tools.',
      'Keep only three daily tools within reach: tablet/laptop, audio case, and wireless dock.',
    ],
  },
];
