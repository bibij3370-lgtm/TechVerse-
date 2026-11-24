# TechVerse PWA

**Discover. Shop. Upgrade.**  
A modern, responsive, installable electronics e-commerce Progressive Web Application built with React, TypeScript, Tailwind CSS, Zustand, React Hook Form + Zod, and `vite-plugin-pwa`.

## Key Features

- **Storefront & Merchandising**: Two-level sticky navigation, live product search with suggestions, interactive hero showcase, category shortcuts, trending product grid, trust strip, editorial upgrade collections, deals banner, and validated newsletter subscription.
- **Full Shopping Flows**: Filterable/sortable catalog (`/shop`, `/category/:slug`, `/new-arrivals`, `/deals`, `/search`), Product Detail Pages with image zoom, variants, specs, reviews & related products, Quick View modal, Wishlist with move-to-cart, persistent Cart Drawer, coupon codes (`TECH10`, `UPGRADE25`, `WELCOME15`), and multi-step Checkout with clear Demo Checkout mode.
- **PWA Capabilities**: Web App Manifest (`standalone` display, `#C8101E` theme color, standard + maskable PNG icons), Workbox Service Worker with runtime font/image caching and offline fallback (`/offline`), `beforeinstallprompt` install button, iOS Safari installation guide, and real-time offline banner.
- **Light & Dark Themes**: Full dual-theme support with accessible contrast.

## Setup & Development

```bash
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` if connecting a live Supabase or Stripe backend:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: Optional Supabase project credentials. When unset, TechVerse operates in local demo auth/order mode (`demo@techverse.example` / `TechVerse2026!`).
- `VITE_STRIPE_PUBLISHABLE_KEY`: Optional payment provider key. When unset, Checkout uses a clearly labeled Demo Checkout mode and never collects raw card data.

## PWA Testing & Production Build

```bash
npm run lint
npm run build
npm run preview
```

Service workers and install prompts require HTTPS or `localhost`. In production builds (`dist/`), `vite-plugin-pwa` generates `manifest.webmanifest` and `sw.js` automatically.
