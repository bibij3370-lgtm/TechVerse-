import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { CATEGORY_SHORTCUTS } from '../../data/categories';
import { SmartImage } from '../common/SmartImage';

export const CategoryShortcuts: React.FC = () => {
  return (
    <section aria-label="Product Categories" className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {CATEGORY_SHORTCUTS.map((cat) => {
          const to = cat.isDeals ? '/deals' : `/category/${cat.slug}`;
          return (
            <Link
              key={cat.slug}
              to={to}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 rounded-2xl bg-[#F7F7F8] dark:bg-[#141418] border border-[#EAEAEA] dark:border-zinc-800 px-3.5 py-3.5 transition-[transform,background-color,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-[0_8px_22px_rgba(21,21,21,0.06)]"
            >
              <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-zinc-800 border border-[#EAEAEA] dark:border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
                  {cat.isDeals ? (
                    <div className="w-8 h-8 rounded-lg bg-[#C8101E] text-white flex items-center justify-center">
                      <Tag className="w-4 h-4" aria-hidden="true" />
                    </div>
                  ) : (
                    <SmartImage
                      src={cat.image || ''}
                      alt={cat.name}
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <span
                  className="sm:hidden w-7 h-7 rounded-full bg-[#C8101E] text-white flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <div className="hidden sm:block min-w-0">
                  <h2 className="font-display text-sm font-bold text-[#151515] dark:text-white truncate">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-[#666666] dark:text-zinc-400 truncate mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="sm:hidden min-w-0">
                <h2 className="font-display text-sm font-bold text-[#151515] dark:text-white leading-tight">
                  {cat.name}
                </h2>
                <p className="text-xs text-[#666666] dark:text-zinc-400 mt-0.5 leading-tight">
                  {cat.subtitle}
                </p>
              </div>

              <span
                className="hidden sm:flex w-7 h-7 rounded-full bg-[#C8101E] text-white items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
