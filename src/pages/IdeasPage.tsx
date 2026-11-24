import React from 'react';
import { catalogService } from '../services/catalogService';
import { PRODUCTS_BY_ID } from '../data/products';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SmartImage } from '../components/common/SmartImage';
import { ProductCard } from '../components/products/ProductCard';
import { usePageMeta } from '../hooks/usePageMeta';

export const IdeasPage: React.FC = () => {
  usePageMeta(
    'Ideas for Your Next Upgrade | TechVerse',
    'Curated creator desks, travel tech kits, smart home architecture, and gaming setups.'
  );

  const collections = catalogService.getIdeas();

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Upgrade Ideas' }]} />

      <div className="max-w-2xl mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#151515] dark:text-white tracking-tight">
          Ideas for Your Next Upgrade
        </h1>
        <p className="text-sm sm:text-base text-[#666666] dark:text-zinc-400 mt-2">
          Curated hardware pairings for desk setups, carry-on travel kits, and Matter-enabled living spaces.
        </p>
      </div>

      <div className="space-y-12">
        {collections.map((collection) => {
          const featuredProducts = collection.featuredProductIds
            .map((id) => PRODUCTS_BY_ID[id])
            .filter(Boolean);

          return (
            <section
              key={collection.id}
              id={collection.slug}
              className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-5 relative min-h-[240px]">
                  <SmartImage
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover lg:h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="text-xs font-semibold text-zinc-200 tabular-nums">
                      {collection.ideaCount} Curated Ideas
                    </span>
                    <h2 className="font-display text-2xl font-bold mt-0.5">{collection.title}</h2>
                  </div>
                </div>

                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#C8101E]">{collection.subtitle}</p>
                    <p className="text-sm text-[#555555] dark:text-zinc-300 mt-2 leading-relaxed">
                      {collection.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {collection.tips.map((tip, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[#333333] dark:text-zinc-300"
                        >
                          <span className="font-mono-tabular font-bold text-[#C8101E]">
                            0{idx + 1}.
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {featuredProducts.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-[#EAEAEA] dark:border-zinc-800 bg-[#F9F9FA] dark:bg-zinc-900/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-zinc-400 mb-4">
                    Featured Gear in This Setup
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {featuredProducts.map((p) => (
                      <ProductCard key={p.id} product={p} compact />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
