import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const NotificationToast: React.FC = () => {
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const tone = toast.tone ?? 'success';
        const Icon =
          tone === 'error' ? AlertCircle : tone === 'info' ? Info : CheckCircle2;
        const iconColor =
          tone === 'error'
            ? 'text-[#DC3545]'
            : tone === 'info'
            ? 'text-[#151515] dark:text-white'
            : 'text-[#218838]';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 px-4 py-3 shadow-[0_12px_32px_rgba(21,21,21,0.12)]"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#151515] dark:text-white">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-xs text-[#666666] dark:text-zinc-400 mt-0.5">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 text-[#777777] hover:text-[#151515] dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
