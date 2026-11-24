import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  WifiOff,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BrandLogo } from '../components/common/BrandLogo';
import { usePageMeta } from '../hooks/usePageMeta';
import { SITE_CONFIG } from '../config/site';

export const AboutPage: React.FC = () => {
  usePageMeta('About TechVerse | Discover. Shop. Upgrade.');
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About TechVerse' }]} />
      <div className="space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
          Built for Everyday Tech Upgrades
        </h1>
        <p className="text-base text-[#555555] dark:text-zinc-300 leading-relaxed">
          TechVerse is a curated consumer electronics storefront focused on studio-grade audio, precision wearables, Matter-ready smart home hardware, and tactile workspace accessories.
        </p>
      </div>
      <section id="story" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: '100% Authentic Hardware',
            body: 'Every device ships factory-sealed directly from authorized hardware engineering partners.',
          },
          {
            title: 'Fast Regional Hubs',
            body: 'Fulfillment centers across the US, UK, and UAE ensure rapid tracked delivery.',
          },
          {
            title: '30-Day Trial Guarantee',
            body: 'Test your desk or audio upgrade in your real workflow with zero-hassle returns.',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-5"
          >
            <h2 className="font-display text-base font-bold text-[#151515] dark:text-white">
              {card.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] dark:text-zinc-400 mt-2 leading-relaxed">
              {card.body}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  usePageMeta('Contact Us | TechVerse');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4">
          <h1 className="font-display text-3xl font-extrabold">Contact Support</h1>
          <p className="text-sm text-[#666666] dark:text-zinc-400 leading-relaxed">
            Questions about compatibility, regional shipping, or warranty coverage? Reach our hardware specialists anytime.
          </p>
          <div className="space-y-3 pt-2 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#C8101E]" />
              <span>{SITE_CONFIG.supportEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#C8101E]" />
              <span>24/7 Live Ticket Support</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#C8101E]" />
              <span>San Francisco · London · Dubai</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-6">
          {sent ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#218838] mx-auto" />
              <h2 className="font-display text-xl font-bold">Inquiry Received</h2>
              <p className="text-sm text-[#666666] dark:text-zinc-400">
                Thanks {name}, our team will respond to {email} shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="text-xs font-semibold text-[#C8101E] hover:underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim() || !email.trim() || !message.trim()) return;
                setSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold mb-1.5">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="contact-msg" className="block text-xs font-semibold mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3.5 text-sm"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  usePageMeta('Frequently Asked Questions | TechVerse');
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    {
      q: 'How fast is shipping to the US, UK, and UAE?',
      a: 'Standard worldwide shipping arrives in 3–5 business days (free on orders over $100 USD). Express air courier delivers in 1–2 business days.',
    },
    {
      q: 'What is your return and warranty policy?',
      a: 'All TechVerse products qualify for 30-day hassle-free returns in original packaging and carry a 2-year hardware warranty.',
    },
    {
      q: 'Can I install TechVerse as an app on iOS, Android, or Desktop?',
      a: 'Yes! TechVerse is a Progressive Web App. Tap "Install App" in the header or use Safari Share -> Add to Home Screen on iOS.',
    },
    {
      q: 'Which promo codes are currently active?',
      a: 'Try TECH10 (10% off $50+), WELCOME15 (15% off $100+), or UPGRADE25 ($25 off $150+) inside the cart drawer or cart page.',
    },
  ];

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQs' }]} />
      <h1 className="font-display text-3xl font-extrabold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.q}
              className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm sm:text-base font-bold cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-[#555555] dark:text-zinc-400 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PoliciesPage: React.FC = () => {
  usePageMeta('Store Policies | TechVerse');
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Policies' }]} />
      <h1 className="font-display text-3xl font-extrabold">Store Policies</h1>
      {[
        {
          id: 'shipping',
          title: 'Shipping Information',
          body: 'Orders placed before 2:00 PM local hub time dispatch the same business day across US, UK, and UAE fulfillment hubs.',
        },
        {
          id: 'returns',
          title: '30-Day Returns & Exchanges',
          body: 'Return eligible items within 30 days of delivery for a full refund or instant hardware exchange.',
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          body: 'TechVerse never caches private account data or checkout details in public service worker caches.',
        },
        {
          id: 'terms',
          title: 'Terms & Conditions',
          body: 'All product specifications and pricing are verified at order confirmation. Demo checkout orders do not process real charges.',
        },
      ].map((sec) => (
        <section
          key={sec.id}
          id={sec.id}
          className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-6"
        >
          <h2 className="font-display text-lg font-bold">{sec.title}</h2>
          <p className="text-sm text-[#555555] dark:text-zinc-400 mt-2 leading-relaxed">
            {sec.body}
          </p>
        </section>
      ))}
    </div>
  );
};

export const OfflinePage: React.FC = () => {
  usePageMeta('Offline Mode | TechVerse');
  return (
    <div className="max-w-lg mx-auto px-4 py-14 text-center space-y-5">
      <div className="flex justify-center">
        <BrandLogo />
      </div>
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center mx-auto">
          <WifiOff className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-extrabold">You are currently offline</h1>
        <p className="text-sm text-[#666666] dark:text-zinc-400 leading-relaxed">
          TechVerse has cached the storefront shell and recently viewed product assets so you can keep browsing. Reconnect to complete checkout or sync your account.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
          <Link
            to="/shop"
            className="rounded-full border border-[#EAEAEA] dark:border-zinc-700 px-6 py-2.5 text-sm font-semibold"
          >
            Browse Cached Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  usePageMeta('Page Not Found | TechVerse');
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
      <p className="font-mono-tabular text-sm font-bold text-[#C8101E]">404</p>
      <h1 className="font-display text-3xl font-extrabold">Page not found</h1>
      <p className="text-sm text-[#666666] dark:text-zinc-400">
        The page you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18]"
      >
        Back to Homepage
      </Link>
    </div>
  );
};
