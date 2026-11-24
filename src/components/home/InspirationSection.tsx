import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { IDEA_COLLECTIONS } from '../../data/ideas';
import { SmartImage } from '../common/SmartImage';

export const InspirationSection: React.FC = () => {
  return (
    <section aria-labelledby="ideas-heading" className="mt-9">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2
          id="ideas-heading"
          className="font-display text-xl sm:text-2xl font-bold text-[#151515] dark:text-white tracking-tight"
        >
          Ideas for Your Next Upgrade
        </h2>
        <Link
          to="/ideas"
          className="text-xs sm:text-sm font-semibold text-[#C8101E] hover:text-[#A80D18] transition-colors whitespace-nowrap"
        >
          See more ideas
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {IDEA_COLLECTIONS.map((idea) => (
          <Link
            key={idea.id}
            to={`/ideas#${idea.slug}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 block"
          >
            <SmartImage
              src={idea.image}
              alt={idea.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Measured contrast scrim */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-end justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display text-sm font-bold text-white leading-snug truncate">
                  {idea.title}
                </h3>
                <p className="text-[11px] font-medium text-zinc-200 tabular-nums mt-0.5">
                  {idea.ideaCount} Ideas
                </p>
              </div>
              <span
                className="w-7 h-7 rounded-full bg-white text-[#151515] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
