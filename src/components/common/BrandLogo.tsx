import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  showTagline?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  showTagline = true,
  compact = false,
  onClick,
}) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group inline-flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8101E] rounded-lg ${
        compact ? 'gap-1.5 min-[390px]:gap-2' : 'gap-2.5'
      }`}
      aria-label="TechVerse Home"
    >
      <svg
        width={compact ? 26 : 34}
        height={compact ? 26 : 34}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
        aria-hidden="true"
      >
        <path
          d="M32 6L54 19V45L32 58L10 45V19L32 6Z"
          stroke="#C8101E"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />
        <path d="M32 6L54 19L32 32L10 19L32 6Z" fill="#C8101E" />
        <path
          d="M20 27L32 34.5L44 27V41L32 48.5L20 41V27Z"
          className="fill-[#151515] dark:fill-white"
        />
        <path
          d="M32 34.5V48.5"
          className="stroke-white dark:stroke-[#151515]"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-bold tracking-tight text-[#151515] dark:text-white whitespace-nowrap ${
            compact ? 'text-[16px] min-[390px]:text-[17px]' : 'text-[21px]'
          }`}
        >
          TechVerse
        </span>
        {showTagline && (
          <span className="text-[10.5px] font-medium text-[#666666] dark:text-zinc-400 tracking-tight whitespace-nowrap mt-0.5">
            Discover. Shop. Upgrade.
          </span>
        )}
      </div>
    </Link>
  );
};
