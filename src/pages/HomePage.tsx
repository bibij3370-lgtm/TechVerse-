import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryShortcuts } from '../components/home/CategoryShortcuts';
import { TrendingProducts } from '../components/home/TrendingProducts';
import { TrustBenefits } from '../components/home/TrustBenefits';
import { InspirationSection } from '../components/home/InspirationSection';
import { DealsAndNewsletter } from '../components/home/DealsAndNewsletter';
import { InstallAppPrompt } from '../components/common/InstallAppPrompt';
import { usePageMeta } from '../hooks/usePageMeta';

export const HomePage: React.FC = () => {
  usePageMeta(
    'TechVerse – Discover. Shop. Upgrade. | Tech Gadgets Store',
    'Discover cutting-edge audio, wearables, smart home devices, and accessories at TechVerse. Fast worldwide shipping and 30-day returns.'
  );

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pb-8">
      <HeroBanner />
      <CategoryShortcuts />
      <TrendingProducts />
      <TrustBenefits />
      <InspirationSection />
      <DealsAndNewsletter />
      <div className="hidden lg:block mb-4">
        <InstallAppPrompt variant="banner" />
      </div>
    </div>
  );
};
