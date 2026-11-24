import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Worldwide Shipping',
    description: 'Fast delivery to US, UK & UAE',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: '100% safe & secure checkout',
  },
  {
    icon: RefreshCw,
    title: '30-Day Returns',
    description: 'Hassle-free returns guaranteed',
  },
  {
    icon: Headphones,
    title: 'Premium Support',
    description: '24/7 customer support',
  },
];

export const TrustBenefits: React.FC = () => {
  return (
    <section
      aria-label="Service Benefits"
      className="mt-8 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#F8F8FA] dark:bg-[#141418] px-4 sm:px-6 py-5"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:divide-x lg:divide-[#EAEAEA] dark:lg:divide-zinc-800">
        {BENEFITS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`flex items-center gap-3.5 ${idx > 0 ? 'lg:pl-5' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-700 flex items-center justify-center text-[#C8101E] shrink-0">
                <Icon className="w-5 h-5 stroke-[1.75]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-[#151515] dark:text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#666666] dark:text-zinc-400 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
