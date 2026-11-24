import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
  loading = 'lazy',
  fetchPriority = 'auto',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F5F5F5] to-[#EAEAEA] dark:from-zinc-800 dark:to-zinc-900 text-[#666666] dark:text-zinc-400 p-4 text-center"
        role="img"
        aria-label={alt}
      >
        <Package className="w-8 h-8 stroke-[1.5] text-[#C8101E]" aria-hidden="true" />
        <span className="text-xs font-medium line-clamp-2 max-w-[140px]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
