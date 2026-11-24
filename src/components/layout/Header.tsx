import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  Sun,
  Moon,
  Cpu,
  Home as HomeIcon,
  Headphones,
  Watch,
  Laptop,
  Tag,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { SearchBar } from '../common/SearchBar';
import { SECONDARY_NAV_ITEMS } from '../../data/categories';
import { useShopStore } from '../../store/useShopStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import type { CountryCode, CurrencyCode } from '../../types';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  gadgets: <Cpu className="w-4 h-4" aria-hidden="true" />,
  'smart-home': <HomeIcon className="w-4 h-4" aria-hidden="true" />,
  audio: <Headphones className="w-4 h-4" aria-hidden="true" />,
  wearables: <Watch className="w-4 h-4" aria-hidden="true" />,
  accessories: <Laptop className="w-4 h-4" aria-hidden="true" />,
  deals: <Tag className="w-4 h-4" aria-hidden="true" />,
};

export const Header: React.FC = () => {
  const location = useLocation();
  const cart = useShopStore((s) => s.cart);
  const wishlist = useShopStore((s) => s.wishlist);
  const country = useShopStore((s) => s.country);
  const currency = useShopStore((s) => s.currency);
  const setCountry = useShopStore((s) => s.setCountry);
  const setCurrency = useShopStore((s) => s.setCurrency);
  const user = useAuthStore((s) => s.user);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const topNavLinks = [
    { label: 'Home', to: '/' },
    { label: 'Today', to: '/new-arrivals' },
    { label: 'Following', to: '/ideas' },
    { label: 'Shop', to: '/shop' },
  ];

  const isSecondaryActive = (to: string, slug: string) => {
    if (location.pathname === '/' && slug === 'gadgets') return true;
    return location.pathname === to || location.pathname === `/category/${slug}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-md border-b border-[#EAEAEA] dark:border-zinc-800">
      {/* Mobile Compact Header (52px high to stay strictly within 15% mobile sticky cap) */}
      <div className="flex lg:hidden items-center justify-between h-[52px] px-2.5 sm:px-3 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#151515] dark:text-zinc-100 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <BrandLogo showTagline={false} compact />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#333333] dark:text-zinc-300 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link
            to="/search"
            aria-label="Search products"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#333333] dark:text-zinc-300 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={openCartDrawer}
            aria-label={`Open shopping cart (${cartCount} items)`}
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#151515] dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C8101E] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Top Header */}
      <div className="hidden lg:block max-w-[1360px] mx-auto px-6">
        <div className="flex items-center justify-between gap-6 h-[68px]">
          <BrandLogo />

          <div className="flex-1 max-w-[480px]">
            <SearchBar />
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <nav aria-label="Primary" className="flex items-center gap-5">
              {topNavLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#C8101E] font-semibold after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-[#C8101E]'
                        : 'text-[#333333] dark:text-zinc-300 hover:text-[#151515] dark:hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="h-5 w-px bg-[#EAEAEA] dark:bg-zinc-800" aria-hidden="true" />

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Light theme' : 'Dark theme'}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#333333] dark:text-zinc-300 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>

              <Link
                to={user ? '/account' : '/login'}
                aria-label={user ? `Account (${user.name})` : 'Sign in to Account'}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#151515] dark:text-zinc-200 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 transition-colors"
              >
                {user ? (
                  <span className="w-7 h-7 rounded-full bg-[#151515] dark:bg-[#C8101E] text-white text-[11px] font-bold flex items-center justify-center">
                    {user.avatarInitials}
                  </span>
                ) : (
                  <User className="w-[19px] h-[19px]" />
                )}
              </Link>

              <Link
                to="/wishlist"
                aria-label={`Wishlist (${wishlistCount} saved items)`}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#151515] dark:text-zinc-200 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 transition-colors"
              >
                <Heart className="w-[19px] h-[19px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#151515] dark:bg-white text-white dark:text-[#151515] text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCartDrawer}
                aria-label={`Shopping cart (${cartCount} items)`}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#151515] dark:text-zinc-200 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-[19px] h-[19px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C8101E] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Secondary Category Bar */}
        <div className="flex items-center justify-between h-11 border-t border-[#EAEAEA] dark:border-zinc-800/80 text-[13px]">
          <nav aria-label="Categories" className="flex items-center gap-6 overflow-x-auto">
            {SECONDARY_NAV_ITEMS.map((item) => {
              const active = isSecondaryActive(item.to, item.slug);
              return (
                <Link
                  key={item.slug}
                  to={item.to}
                  className={`relative inline-flex items-center gap-1.5 py-2.5 whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'text-[#151515] dark:text-white font-semibold after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#C8101E]'
                      : 'text-[#555555] dark:text-zinc-400 hover:text-[#151515] dark:hover:text-white font-medium'
                  }`}
                >
                  <span className={active ? 'text-[#C8101E]' : 'text-[#777777] dark:text-zinc-500'}>
                    {CATEGORY_ICONS[item.slug]}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 shrink-0 text-xs text-[#555555] dark:text-zinc-400">
            <div className="flex items-center gap-1.5" role="group" aria-label="Region">
              {(['US', 'UK', 'UAE'] as CountryCode[]).map((code, idx) => (
                <React.Fragment key={code}>
                  {idx > 0 && <span className="text-[#D4D4D8] dark:text-zinc-700">|</span>}
                  <button
                    type="button"
                    onClick={() => setCountry(code)}
                    className={`px-1 py-0.5 rounded transition-colors cursor-pointer ${
                      country === code
                        ? 'font-bold text-[#151515] dark:text-white'
                        : 'hover:text-[#151515] dark:hover:text-zinc-200'
                    }`}
                  >
                    {code}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <label htmlFor="header-currency-select" className="sr-only">
              Currency
            </label>
            <select
              id="header-currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent border border-[#EAEAEA] dark:border-zinc-700 rounded-md px-2 py-1 text-xs font-medium text-[#151515] dark:text-zinc-200 focus:outline-none focus:border-[#C8101E] cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED</option>
              <option value="EUR">EUR (€)</option>
            </select>

            <Link
              to="/wishlist"
              className="inline-flex items-center gap-1 text-[#333333] dark:text-zinc-300 hover:text-[#C8101E] transition-colors whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Favorites</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
