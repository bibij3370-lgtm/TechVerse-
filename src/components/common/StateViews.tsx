import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, PackageOpen } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#666666] dark:text-zinc-400">
    <Loader2 className="w-7 h-7 animate-spin text-[#C8101E]" aria-hidden="true" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#F9F9FA] dark:bg-zinc-900/60 px-6 py-14">
    <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border border-[#EAEAEA] dark:border-zinc-700 flex items-center justify-center text-[#C8101E] mb-4">
      {icon ?? <PackageOpen className="w-6 h-6" aria-hidden="true" />}
    </div>
    <h2 className="font-display text-lg font-bold text-[#151515] dark:text-white">{title}</h2>
    <p className="text-sm text-[#666666] dark:text-zinc-400 mt-1.5 max-w-md">{description}</p>
    {actionLabel && actionTo && (
      <Link
        to={actionTo}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] transition-colors whitespace-nowrap"
      >
        {actionLabel}
      </Link>
    )}
    {actionLabel && onAction && !actionTo && (
      <button
        type="button"
        onClick={onAction}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] transition-colors whitespace-nowrap cursor-pointer"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => (
  <div
    role="alert"
    className="flex flex-col items-center justify-center text-center rounded-2xl border border-[#DC3545]/25 bg-[#DC3545]/5 px-6 py-12"
  >
    <AlertTriangle className="w-8 h-8 text-[#DC3545] mb-3" aria-hidden="true" />
    <h2 className="font-display text-lg font-bold text-[#151515] dark:text-white">{title}</h2>
    <p className="text-sm text-[#666666] dark:text-zinc-400 mt-1 max-w-md">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-[#151515] dark:bg-white text-white dark:text-[#151515] px-5 py-2 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
      >
        Try Again
      </button>
    )}
  </div>
);
