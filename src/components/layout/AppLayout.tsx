import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNavigation } from './MobileNavigation';
import { CartDrawer } from '../cart/CartDrawer';
import { ProductQuickView } from '../products/ProductQuickView';
import { NotificationToast } from '../common/NotificationToast';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { InstallAppPrompt } from '../common/InstallAppPrompt';
import { LoadingSpinner } from '../common/StateViews';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0D0D0F] text-[#151515] dark:text-zinc-100 overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-[#C8101E] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        <InstallAppPrompt variant="mobile-banner" />
        <Suspense fallback={<LoadingSpinner label="Loading page..." />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <MobileNavigation />
      <CartDrawer />
      <ProductQuickView />
      <NotificationToast />
      <OfflineIndicator />
    </div>
  );
};
