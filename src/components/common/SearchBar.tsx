import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { catalogService } from '../../services/catalogService';
import { useShopStore } from '../../store/useShopStore';
import { formatPrice } from '../../utils/currency';
import { SmartImage } from './SmartImage';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
  onNavigate?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  className = '',
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const currency = useShopStore((s) => s.currency);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => (query.trim() ? catalogService.getSearchSuggestions(query, 5) : []),
    [query]
  );

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setIsOpen(false);
    onNavigate?.();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex items-center w-full h-11 rounded-full bg-[#F5F5F5] dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 focus-within:border-[#C8101E] focus-within:bg-white dark:focus-within:bg-zinc-950 transition-colors pl-4 pr-1.5"
      >
        <label htmlFor="techverse-search-input" className="sr-only">
          Search for tech gadgets, ideas and more
        </label>
        <input
          id="techverse-search-input"
          type="search"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search for tech gadgets, ideas and more"
          className="w-full bg-transparent text-sm text-[#151515] dark:text-zinc-100 placeholder:text-[#777777] dark:placeholder:text-zinc-500 focus:outline-none min-w-0"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search query"
            className="p-1.5 text-[#777777] hover:text-[#151515] dark:hover:text-white transition-colors mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Submit search"
          className="w-8 h-8 rounded-full bg-[#151515] dark:bg-[#C8101E] text-white flex items-center justify-center shrink-0 hover:bg-[#C8101E] dark:hover:bg-[#A80D18] transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {isOpen && query.trim().length > 0 && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 shadow-[0_16px_40px_rgba(21,21,21,0.12)] overflow-hidden"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.length > 0 ? (
            <div className="divide-y divide-[#EAEAEA] dark:divide-zinc-800">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate?.();
                    navigate(`/product/${product.slug}`);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F5F5F5] dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F5F5F5] dark:bg-zinc-800 shrink-0">
                    <SmartImage
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#151515] dark:text-zinc-100 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#666666] dark:text-zinc-400 truncate">
                      {product.brand} · {product.category}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-[#151515] dark:text-white shrink-0">
                    {formatPrice(product.price, currency)}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#C8101E] hover:bg-[#F5F5F5] dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
              >
                <span>View all results for &ldquo;{query.trim()}&rdquo;</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="px-4 py-5 text-center text-sm text-[#666666] dark:text-zinc-400">
              No matching gadgets found for &ldquo;{query.trim()}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
