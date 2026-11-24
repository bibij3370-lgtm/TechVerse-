import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { IdeasPage } from './pages/IdeasPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { AccountPage, OrderDetailPage, OrdersPage, ProtectedRoute } from './pages/AccountPage';
import { useUIStore } from './store/useUIStore';

const loadCheckoutPage = () => import('./pages/CheckoutPage');
const loadAuthPage = () => import('./pages/AuthPage');
const loadInfoPages = () => import('./pages/InfoPages');

const CheckoutPage = lazy(() => loadCheckoutPage().then((m) => ({ default: m.CheckoutPage })));
const AuthPage = lazy(() => loadAuthPage().then((m) => ({ default: m.AuthPage })));
const AboutPage = lazy(() => loadInfoPages().then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => loadInfoPages().then((m) => ({ default: m.ContactPage })));
const FaqPage = lazy(() => loadInfoPages().then((m) => ({ default: m.FaqPage })));
const PoliciesPage = lazy(() => loadInfoPages().then((m) => ({ default: m.PoliciesPage })));
const OfflinePage = lazy(() => loadInfoPages().then((m) => ({ default: m.OfflinePage })));
const NotFoundPage = lazy(() => loadInfoPages().then((m) => ({ default: m.NotFoundPage })));

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
};

export default function App() {
  const initTheme = useUIStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();

    // Warm secondary route chunks during browser idle time for instant navigation
    const preloadSecondaryRoutes = () => {
      void loadCheckoutPage();
      void loadAuthPage();
      void loadInfoPages();
    };

    if (typeof window !== 'undefined') {
      if (typeof window.requestIdleCallback === 'function') {
        const idleId = window.requestIdleCallback(preloadSecondaryRoutes, { timeout: 1200 });
        return () => window.cancelIdleCallback(idleId);
      }
      const timer = globalThis.setTimeout(preloadSecondaryRoutes, 200);
      return () => globalThis.clearTimeout(timer);
    }
  }, [initTheme]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CatalogPage mode="shop" />} />
          <Route path="/category/:slug" element={<CatalogPage mode="category" />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/search" element={<CatalogPage mode="search" />} />
          <Route path="/new-arrivals" element={<CatalogPage mode="new-arrivals" />} />
          <Route path="/deals" element={<CatalogPage mode="deals" />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
