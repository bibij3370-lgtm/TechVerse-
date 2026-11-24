import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone?: 'success' | 'error' | 'info';
}

interface UIState {
  isCartDrawerOpen: boolean;
  quickViewProductId: string | null;
  isMobileMenuOpen: boolean;
  isDarkMode: boolean;
  toasts: ToastMessage[];

  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  initTheme: () => void;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isCartDrawerOpen: false,
  quickViewProductId: null,
  isMobileMenuOpen: false,
  isDarkMode: false,
  toasts: [],

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  openQuickView: (productId) => set({ quickViewProductId: productId }),
  closeQuickView: () => set({ quickViewProductId: null }),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),

  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next);
      try {
        localStorage.setItem('techverse-theme', next ? 'dark' : 'light');
      } catch {
        // Ignore storage restrictions
      }
    }
    set({ isDarkMode: next });
  },

  initTheme: () => {
    if (typeof window === 'undefined') return;
    let prefersDark = false;
    try {
      const saved = localStorage.getItem('techverse-theme');
      prefersDark =
        saved === 'dark' ||
        (!saved && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    } catch {
      prefersDark = false;
    }
    document.documentElement.classList.toggle('dark', prefersDark);
    set({ isDarkMode: prefersDark });
  },

  pushToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts.slice(-3), { ...toast, id }],
    }));
    setTimeout(() => {
      get().dismissToast(id);
    }, 2400);
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
