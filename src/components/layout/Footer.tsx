import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Star, BadgePercent } from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import type { CountryCode, CurrencyCode } from '../../types';

export const Footer: React.FC = () => {
  const country = useShopStore((s) => s.country);
  const currency = useShopStore((s) => s.currency);
  const setCountry = useShopStore((s) => s.setCountry);
  const setCurrency = useShopStore((s) => s.setCurrency);

  const trustIndicators = [
    {
      icon: ShieldCheck,
      title: '100% Authentic',
      subtitle: 'Genuine products only',
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      subtitle: 'Loved by customers worldwide',
    },
    {
      icon: Star,
      title: 'Top Rated Store',
      subtitle: 'High-quality gadgets you can trust',
    },
    {
      icon: BadgePercent,
      title: 'Price Match Guarantee',
      subtitle: 'Best prices, always',
    },
  ];

  return (
    <footer className="bg-white dark:bg-[#121215] border-t border-[#EAEAEA] dark:border-zinc-800 pb-20 lg:pb-8">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Trust Indicators Bar matching Reference Screenshot */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-[#EAEAEA] dark:border-zinc-800">
          {trustIndicators.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#EAEAEA] dark:border-zinc-700 bg-[#F9F9FA] dark:bg-zinc-900 flex items-center justify-center text-[#C8101E] shrink-0">
                  <Icon className="w-5 h-5 stroke-[1.75]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-[#151515] dark:text-white leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#666666] dark:text-zinc-400 mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-column Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-[#EAEAEA] dark:border-zinc-800">
          <div>
            <h3 className="font-display text-sm font-bold text-[#151515] dark:text-white mb-3">
              Shop
            </h3>
            <ul className="space-y-2 text-sm text-[#555555] dark:text-zinc-400">
              <li>
                <Link to="/shop" className="hover:text-[#C8101E] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-[#C8101E] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=popularity" className="hover:text-[#C8101E] transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-[#C8101E] transition-colors">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-[#151515] dark:text-white mb-3">
              Customer Service
            </h3>
            <ul className="space-y-2 text-sm text-[#555555] dark:text-zinc-400">
              <li>
                <Link to="/contact" className="hover:text-[#C8101E] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/policies#shipping" className="hover:text-[#C8101E] transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/policies#returns" className="hover:text-[#C8101E] transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#C8101E] transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-[#151515] dark:text-white mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-[#555555] dark:text-zinc-400">
              <li>
                <Link to="/about" className="hover:text-[#C8101E] transition-colors">
                  About TechVerse
                </Link>
              </li>
              <li>
                <Link to="/about#story" className="hover:text-[#C8101E] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/policies#privacy" className="hover:text-[#C8101E] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/policies#terms" className="hover:text-[#C8101E] transition-colors">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-[#151515] dark:text-white mb-3">
              Follow us
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {[
                { label: 'Facebook', short: 'f', href: 'https://facebook.com' },
                { label: 'Instagram', short: 'ig', href: 'https://instagram.com' },
                { label: 'X', short: 'X', href: 'https://x.com' },
                { label: 'YouTube', short: 'YT', href: 'https://youtube.com' },
                { label: 'TikTok', short: 'TT', href: 'https://tiktok.com' },
              ].map((soc) => (
                <a
                  key={soc.label}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow TechVerse on ${soc.label}`}
                  className="w-8 h-8 rounded-full bg-[#F5F5F5] dark:bg-zinc-800 border border-[#EAEAEA] dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-[#151515] dark:text-zinc-200 hover:bg-[#C8101E] hover:text-white hover:border-[#C8101E] transition-colors"
                >
                  {soc.short}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="footer-country" className="sr-only">
                Country
              </label>
              <select
                id="footer-country"
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryCode)}
                className="rounded-lg border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-[#151515] dark:text-zinc-200"
              >
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="UAE">UAE</option>
              </select>

              <label htmlFor="footer-currency" className="sr-only">
                Currency
              </label>
              <select
                id="footer-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="rounded-lg border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-[#151515] dark:text-zinc-200"
              >
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666] dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} TechVerse Inc. Discover. Shop. Upgrade.</p>
          <div className="flex items-center gap-2 text-[11px] font-mono-tabular text-[#555555] dark:text-zinc-400">
            <span>VISA</span>
            <span aria-hidden="true">·</span>
            <span>MASTERCARD</span>
            <span aria-hidden="true">·</span>
            <span>AMEX</span>
            <span aria-hidden="true">·</span>
            <span>APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
