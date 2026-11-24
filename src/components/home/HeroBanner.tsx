import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Truck } from 'lucide-react';
import { SmartImage } from '../common/SmartImage';

interface HeroSlide {
  id: string;
  eyebrow: string;
  headlinePrefix: string;
  headlineAccent: string;
  description: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
  badgeLine1: string;
  badgeLine2: string;
  image: string;
  imageAlt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'latest-gadgets',
    eyebrow: 'Discover. Shop. Upgrade.',
    headlinePrefix: 'Latest Tech',
    headlineAccent: 'Gadgets',
    description: 'Explore cutting-edge gadgets that upgrade your lifestyle.',
    primaryCta: { label: 'Shop Now', to: '/shop' },
    secondaryCta: { label: 'Browse Collection', to: '/new-arrivals' },
    badgeLine1: 'New',
    badgeLine2: 'Arrivals',
    image: '/src/assets/images/hero_tech_gadgets_1795440802685.jpg',
    imageAlt: 'Studio showcase of over-ear headphones, flagship smartphone, smartwatch, and wireless earbuds',
  },
  {
    id: 'studio-audio',
    eyebrow: 'Aether Studio Acoustics',
    headlinePrefix: 'Lossless Sound',
    headlineAccent: 'Anywhere',
    description: 'Active noise cancellation and titanium drivers tuned for deep focus.',
    primaryCta: { label: 'Shop Audio', to: '/category/audio' },
    secondaryCta: { label: 'View Deals', to: '/deals' },
    badgeLine1: 'Save',
    badgeLine2: 'Up to 25%',
    image: '/src/assets/images/prod_headphones_1795440750594.jpg',
    imageAlt: 'Aether Studio wireless active noise-canceling headphones',
  },
  {
    id: 'creator-desk',
    eyebrow: 'Curated Upgrade Kits',
    headlinePrefix: 'Build Your',
    headlineAccent: 'Setup',
    description: 'Precision CNC keyboards, MagSafe docks, and architectural desk gear.',
    primaryCta: { label: 'Explore Ideas', to: '/ideas' },
    secondaryCta: { label: 'Accessories', to: '/category/accessories' },
    badgeLine1: '128+',
    badgeLine2: 'Ideas',
    image: '/src/assets/images/idea_tech_setup_1795440750304.jpg',
    imageAlt: 'Minimalist creator desk setup with laptop, headphones, and mechanical keyboard',
  },
];

export const HeroBanner: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = HERO_SLIDES[activeIndex];

  const handlePrev = () =>
    setActiveIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));

  return (
    <section aria-label="Featured Tech Showcase" className="pt-4 sm:pt-5">
      <div className="relative rounded-2xl overflow-hidden border border-[#EAEAEA] dark:border-zinc-800 bg-[#F4F4F6] dark:bg-[#17171B] shadow-[0_2px_14px_rgba(21,21,21,0.04)]">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[340px] lg:min-h-[410px]">
          {/* Desktop seamless full-bleed backdrop image */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <SmartImage
              src={slide.image}
              alt=""
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7F7F9] via-[#F7F7F9]/95 via-42% to-transparent dark:from-[#17171B] dark:via-[#17171B]/95 dark:via-45% dark:to-[#17171B]/25" />
          </div>

          {/* Left Copy Column */}
          <div className="lg:col-span-6 relative z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#C8101E] tracking-tight">
                {slide.eyebrow}
              </p>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.08] text-[#151515] dark:text-white mt-2 [text-wrap:balance]">
                {slide.headlinePrefix}{' '}
                <span className="block text-[#C8101E]">{slide.headlineAccent}</span>
              </h1>

              <p className="text-sm sm:text-base text-[#555555] dark:text-zinc-300 mt-3.5 max-w-md leading-relaxed">
                {slide.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Link
                  to={slide.primaryCta.to}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C8101E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#A80D18] transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  <span>{slide.primaryCta.label}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link
                  to={slide.secondaryCta.to}
                  className="inline-flex items-center justify-center rounded-full border border-[#D4D4D8] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-3 text-sm font-semibold text-[#151515] dark:text-white hover:border-[#151515] dark:hover:border-white transition-colors whitespace-nowrap shrink-0"
                >
                  {slide.secondaryCta.label}
                </Link>
              </div>
            </div>

            {/* Shipping Locations Line matching Screenshot */}
            <div className="flex flex-wrap items-center gap-4 mt-7 pt-4 text-xs font-medium text-[#333333] dark:text-zinc-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="font-bold text-[#151515] dark:text-white">US</span>
                <span className="text-[#999999]">·</span>
                <span className="font-bold text-[#151515] dark:text-white">UK</span>
                <span className="text-[#999999]">·</span>
                <span className="font-bold text-[#151515] dark:text-white">UAE</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#555555] dark:text-zinc-400">
                <Truck className="w-4 h-4 text-[#C8101E]" aria-hidden="true" />
                <span>Fast Worldwide Shipping</span>
              </span>
            </div>
          </div>

          {/* Right Product Composition Column */}
          <div className="lg:col-span-6 relative min-h-[240px] lg:min-h-full overflow-hidden">
            <SmartImage
              src={slide.image}
              alt={slide.imageAlt}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover object-center lg:hidden"
            />

            {/* Circular New Arrivals Badge */}
            <div
              className="absolute top-5 right-5 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-zinc-900 shadow-lg border border-[#EAEAEA] dark:border-zinc-700 flex flex-col items-center justify-center text-center leading-tight pointer-events-none"
              aria-hidden="true"
            >
              <span className="text-[11px] sm:text-xs font-bold text-[#151515] dark:text-white">
                {slide.badgeLine1}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-[#C8101E]">
                {slide.badgeLine2}
              </span>
            </div>

            {/* Carousel Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xs rounded-full px-2.5 py-1.5 border border-[#EAEAEA] dark:border-zinc-700 shadow-sm">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous featured slide"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#333333] dark:text-zinc-200 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 px-1">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}: ${s.headlinePrefix} ${s.headlineAccent}`}
                    aria-current={idx === activeIndex}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'w-5 bg-[#C8101E]'
                        : 'w-2 bg-[#D4D4D8] dark:bg-zinc-600 hover:bg-[#999999]'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next featured slide"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#333333] dark:text-zinc-200 hover:bg-[#F5F5F5] dark:hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
