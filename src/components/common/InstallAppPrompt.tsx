import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, Download, MoreVertical, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall, type InstallPlatform } from '../../hooks/usePWAInstall';

interface InstallAppPromptProps {
  variant?: 'header' | 'mobile-banner' | 'drawer' | 'banner';
  onAction?: () => void;
}

export const InstallAppPrompt: React.FC<InstallAppPromptProps> = ({
  variant = 'header',
  onAction,
}) => {
  const { isInstallable, isInstalled, platform, isInIframe, isDismissed, install, dismiss } =
    usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<InstallPlatform>(platform);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    // On mobile viewports when UA is generic desktop in responsive testing, default tab to Android for clear mobile steps
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && platform === 'desktop') {
      setActiveTab('android');
    } else {
      setActiveTab(platform);
    }
  }, [platform]);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        onAction?.();
        return;
      }
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && platform === 'desktop') {
      setActiveTab('android');
    } else {
      setActiveTab(platform);
    }
    setShowGuide(true);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  const guideModal =
    showGuide && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-install-title"
          >
            <div
              className="fixed inset-0"
              aria-hidden="true"
              onClick={() => setShowGuide(false)}
            />
            <div className="relative z-10 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3
                      id="pwa-install-title"
                      className="font-display text-lg font-bold text-[#151515] dark:text-white leading-tight"
                    >
                      Install TechVerse App
                    </h3>
                    <p className="text-xs text-[#666666] dark:text-zinc-400 mt-0.5">
                      Add to your home screen for fast app-like shopping
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuide(false)}
                  aria-label="Close installation guide"
                  className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-full text-[#666666] hover:text-[#151515] dark:text-zinc-400 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Platform Tabs */}
              <div
                className="mt-4 grid grid-cols-3 gap-1.5 rounded-xl bg-[#F5F5F5] dark:bg-zinc-800 p-1"
                role="tablist"
                aria-label="Device install instructions"
              >
                {(
                  [
                    { id: 'android', label: 'Android' },
                    { id: 'ios', label: 'iPhone / iOS' },
                    { id: 'desktop', label: 'Desktop' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-h-[38px] rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-zinc-900 text-[#151515] dark:text-white shadow-xs'
                        : 'text-[#666666] dark:text-zinc-400 hover:text-[#151515] dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'android' && (
                <ol className="mt-4 space-y-3 text-sm text-[#333333] dark:text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tabular font-bold text-[#C8101E]">1.</span>
                    <span>
                      Open TechVerse in <strong>Chrome</strong> and tap the{' '}
                      <MoreVertical className="inline w-4 h-4 mx-0.5 align-text-bottom" aria-hidden="true" />
                      <strong>Menu</strong> button at the top right.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tabular font-bold text-[#C8101E]">2.</span>
                    <span>
                      Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tabular font-bold text-[#C8101E]">3.</span>
                    <span>
                      Confirm <strong>Install</strong> to add the TechVerse icon to your phone.
                    </span>
                  </li>
                </ol>
              )}

              {activeTab === 'ios' && (
                <ol className="mt-4 space-y-3 text-sm text-[#333333] dark:text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tabular font-bold text-[#C8101E]">1.</span>
                    <span>
                      Open TechVerse in <strong>Safari</strong> and tap the{' '}
                      <Share className="inline w-4 h-4 mx-0.5 align-text-bottom" aria-hidden="true" />
                      <strong>Share</strong> icon in the toolbar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tabular font-bold text-[#C8101E]">2.</span>
                    <span>
                      Scroll down and choose <strong>Add to Home Screen</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tabular font-bold text-[#C8101E]">3.</span>
                    <span>
                      Tap <strong>Add</strong> for instant full-screen shopping.
                    </span>
                  </li>
                </ol>
              )}

              {activeTab === 'desktop' && (
                <ol className="mt-4 space-y-3 text-sm text-[#333333] dark:text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tabular font-bold text-[#C8101E]">1.</span>
                    <span>
                      In Chrome or Edge, click the <strong>Install TechVerse</strong> icon on the
                      right side of the address bar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono-tabular font-bold text-[#C8101E]">2.</span>
                    <span>
                      Or open browser Menu → <strong>Cast, save, and share</strong> →{' '}
                      <strong>Install page as app</strong>.
                    </span>
                  </li>
                </ol>
              )}

              {isInIframe && (
                <div className="mt-4 rounded-xl bg-[#F5F5F5] dark:bg-zinc-800/80 border border-[#EAEAEA] dark:border-zinc-700 p-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-[#555555] dark:text-zinc-300 leading-relaxed">
                    Preview mode detected. Open this link directly in mobile Chrome or Safari to
                    install.
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-700 px-3 min-h-[38px] text-xs font-semibold text-[#151515] dark:text-white hover:border-[#C8101E] transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#218838]" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-full bg-[#C8101E] py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>,
          document.body
        )
      : null;

  if (variant === 'mobile-banner') {
    if (isDismissed) return null;
    return (
      <>
        <div
          role="region"
          aria-label="Install TechVerse mobile app"
          className="lg:hidden mx-4 mt-3 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#F9F9FA] dark:bg-zinc-900 px-3 py-2.5 flex items-center justify-between gap-2.5 shadow-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#C8101E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-4.5 h-4.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[#151515] dark:text-white leading-tight truncate">
                TechVerse App
              </p>
              <p className="text-[11px] text-[#666666] dark:text-zinc-400 leading-tight truncate">
                Install for fast mobile shopping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => void handleInstallClick()}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#C8101E] hover:bg-[#A80D18] px-4 min-h-[44px] text-xs font-semibold text-white transition-colors whitespace-nowrap cursor-pointer"
              aria-label="Install TechVerse App"
            >
              <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Install App</span>
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss install banner"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#666666] hover:text-[#151515] dark:text-zinc-400 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {guideModal}
      </>
    );
  }

  if (variant === 'drawer') {
    return (
      <>
        <button
          type="button"
          onClick={() => void handleInstallClick()}
          className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8101E] hover:bg-[#A80D18] px-4 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer"
          aria-label="Install TechVerse App"
        >
          <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Install TechVerse App</span>
        </button>
        {guideModal}
      </>
    );
  }

  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={() => void handleInstallClick()}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEAEA] dark:border-zinc-700 bg-[#F5F5F5] dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-[#151515] dark:text-zinc-100 hover:border-[#C8101E] hover:text-[#C8101E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          aria-label="Install TechVerse App"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Install App</span>
        </button>
        {guideModal}
      </>
    );
  }

  // Banner variant: visible on mobile & desktop until installed or dismissed
  if (isDismissed) return null;

  return (
    <>
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
        <div className="flex items-start sm:items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#151515] dark:text-white">
                Install TechVerse App
              </p>
              <p className="text-xs text-[#666666] dark:text-zinc-400">
                Fast offline browsing, home screen shortcut, and instant checkout.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install banner"
            className="sm:hidden min-w-[44px] min-h-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-full text-[#666666] hover:text-[#151515] dark:hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => void handleInstallClick()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C8101E] px-5 min-h-[44px] text-xs font-semibold text-white hover:bg-[#A80D18] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Install App</span>
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install banner"
            className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center rounded-full text-[#666666] hover:text-[#151515] dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {guideModal}
    </>
  );
};
