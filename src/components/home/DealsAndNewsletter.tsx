import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { catalogService } from '../../services/catalogService';

export const DealsAndNewsletter: React.FC = () => {
  const subscribeNewsletter = useShopStore((s) => s.subscribeNewsletter);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const localCheck = subscribeNewsletter(email);
      if (!localCheck.ok) {
        setFeedback(localCheck);
        return;
      }
      const res = await catalogService.submitNewsletter(email);
      if (!res.ok) {
        setFeedback({ ok: false, message: 'Unable to subscribe right now. Please retry.' });
        return;
      }
      setFeedback(localCheck);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-label="Exclusive Deals and Newsletter" className="mt-9 mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Left: Bold Red Exclusive Deals Banner */}
        <div className="lg:col-span-5 rounded-2xl bg-[#C8101E] text-white p-6 sm:p-8 flex items-center gap-5 shadow-[0_6px_24px_rgba(200,16,30,0.18)]">
          <div className="w-16 h-16 rounded-full bg-white text-[#C8101E] flex items-center justify-center shrink-0 shadow-sm">
            <Gift className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-xl sm:text-2xl font-extrabold leading-tight">
              Exclusive Deals for You!
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1.5 leading-relaxed">
              Save more on top-rated gadgets handpicked just for you.
            </p>
            <Link
              to="/deals"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs sm:text-sm font-bold text-[#C8101E] hover:bg-zinc-100 transition-colors whitespace-nowrap"
            >
              <span>Shop Deals</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Right: Newsletter Signup */}
        <div className="lg:col-span-7 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#F7F7F9] dark:bg-[#141418] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <h2 className="font-display text-xl font-bold text-[#151515] dark:text-white">
              Get the Latest Tech &amp; Deals
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] dark:text-zinc-400 mt-1">
              Join our newsletter and never miss an update.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col sm:flex-row gap-2.5 max-w-md">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-h-[44px] rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm text-[#151515] dark:text-white placeholder:text-[#888888] focus:outline-none focus:border-[#C8101E]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[44px] rounded-xl bg-[#C8101E] px-6 text-sm font-semibold text-white hover:bg-[#A80D18] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {feedback && (
              <div
                role="status"
                className={`mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium ${
                  feedback.ok ? 'text-[#218838]' : 'text-[#DC3545]'
                }`}
              >
                {feedback.ok ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}
          </div>

          {/* Crisp Newsletter Envelope Illustration */}
          <div className="hidden sm:flex items-center justify-center shrink-0" aria-hidden="true">
            <svg width="108" height="96" viewBox="0 0 108 96" fill="none">
              <rect
                x="14"
                y="14"
                width="80"
                height="56"
                rx="10"
                transform="rotate(-6 14 14)"
                className="fill-white dark:fill-zinc-800 stroke-[#EAEAEA] dark:stroke-zinc-700"
                strokeWidth="2"
              />
              <path
                d="M16 40L54 64L92 40V78C92 82.4183 88.4183 86 84 86H24C19.5817 86 16 82.4183 16 78V40Z"
                fill="#C8101E"
              />
              <path
                d="M16 40L54 64L92 40"
                stroke="#A80D18"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="54" cy="36" r="12" fill="#C8101E" />
              <path
                d="M49 36L52.5 39.5L59.5 32.5"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
