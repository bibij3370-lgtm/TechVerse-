import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Home,
  Store,
  Heart,
  ShoppingBag,
  User,
  X,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { SECONDARY_NAV_ITEMS } from '../../data/categories';
import { BrandLogo } from '../common/BrandLogo';
import { SearchBar } from '../common/SearchBar';
import { InstallAppPrompt } from '../common/InstallAppPrompt';
import type { CountryCode, CurrencyCode } from '../../types';

export const MobileNavigation: React.FC = () => {
  const cart = useShopStore((s) => s.cart);
  const wishlist = useShopStore((s) => s.wishlist);
  const country = useShopStore((s) => s.country);
  const currency = useShopStore((s) => s.currency);
  const setCountry = useShopStore((s) => s.setCountry);
  const setCurrency = useShopStore((s) => s.setCurrency);
  const user = useAuthStore((s) => s.user);

  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <>
      {/* Mobile Slide-Over Hamburger Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 w-[86vw] max-w-[340px] h-full bg-white dark:bg-[#121215] border-r border-[#EAEAEA] dark:border-zinc-800 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#EAEAEA] dark:border-zinc-800">
              <BrandLogo showTagline={false} compact onClick={() => setMobileMenuOpen(false)} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#333333] dark:text-zinc-300 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-[#EAEAEA] dark:border-zinc-800">
              <SearchBar onNavigate={() => setMobileMenuOpen(false)} />
            </div>

            <nav className="p-4 space-y-1 flex-1" aria-label="Mobile Categories">
              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#777777] dark:text-zinc-500">
                Browse TechVerse
              </p>
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop All Products', to: '/shop' },
                { label: 'New Arrivals', to: '/new-arrivals' },
                { label: 'Upgrade Ideas', to: '/ideas' },
                { label: 'Exclusive Deals', to: '/deals' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-3 rounded-xl text-sm font-medium text-[#151515] dark:text-zinc-100 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#999999]" aria-hidden="true" />
                </Link>
              ))}

              <p className="px-2 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#777777] dark:text-zinc-500">
                Categories
              </p>
              {SECONDARY_NAV_ITEMS.map((cat) => (
                <Link
                  key={cat.slug}
                  to={cat.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-3 rounded-xl text-sm text-[#333333] dark:text-zinc-300 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800"
                >
                  <span>{cat.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#999999]" aria-hidden="true" />
                </Link>
              ))}

              <p className="px-2 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#777777] dark:text-zinc-500">
                Support & Info
              </p>
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact Support', to: '/contact' },
                { label: 'FAQs', to: '/faq' },
                { label: 'Policies', to: '/policies' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-3 rounded-xl text-sm text-[#555555] dark:text-zinc-400 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#999999]" aria-hidden="true" />
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-[#EAEAEA] dark:border-zinc-800 space-y-3 bg-[#F9F9FA] dark:bg-zinc-900/50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {(['US', 'UK', 'UAE'] as CountryCode[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCountry(c)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        country === c
                          ? 'bg-[#151515] dark:bg-[#C8101E] text-white'
                          : 'bg-white dark:bg-zinc-800 text-[#555555] dark:text-zinc-300 border border-[#EAEAEA] dark:border-zinc-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <select
                  aria-label="Select currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="rounded-lg border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-xs font-semibold text-[#151515] dark:text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#555555] dark:text-zinc-400">
                  Appearance
                </span>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-lg border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-[#151515] dark:text-white cursor-pointer"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
              <InstallAppPrompt variant="drawer" />
            </div>
          </aside>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar (56px high, 44px+ targets) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-[#121215]/95 backdrop-blur-md border-t border-[#EAEAEA] dark:border-zinc-800 pb-safe"
      >
        <div className="grid grid-cols-5 h-[56px]">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-h-[44px] gap-0.5 text-[10px] font-medium ${
                isActive ? 'text-[#C8101E] font-semibold' : 'text-[#555555] dark:text-zinc-400'
              }`
            }
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-h-[44px] gap-0.5 text-[10px] font-medium ${
                isActive ? 'text-[#C8101E] font-semibold' : 'text-[#555555] dark:text-zinc-400'
              }`
            }
          >
            <Store className="w-5 h-5" aria-hidden="true" />
            <span>Shop</span>
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center min-h-[44px] gap-0.5 text-[10px] font-medium ${
                isActive ? 'text-[#C8101E] font-semibold' : 'text-[#555555] dark:text-zinc-400'
              }`
            }
          >
            <div className="relative">
              <Heart className="w-5 h-5" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-[#151515] dark:bg-white text-white dark:text-[#151515] text-[9px] font-bold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span>Wishlist</span>
          </NavLink>

          <button
            type="button"
            onClick={openCartDrawer}
            className="relative flex flex-col items-center justify-center min-h-[44px] gap-0.5 text-[10px] font-medium text-[#555555] dark:text-zinc-400 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-[#C8101E] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>

          <NavLink
            to={user ? '/account' : '/login'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-h-[44px] gap-0.5 text-[10px] font-medium ${
                isActive ? 'text-[#C8101E] font-semibold' : 'text-[#555555] dark:text-zinc-400'
              }`
            }
          >
            <User className="w-5 h-5" aria-hidden="true" />
            <span>Account</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};
