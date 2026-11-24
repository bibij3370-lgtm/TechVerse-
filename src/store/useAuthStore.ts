import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderRecord, SavedAddress, UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  orders: OrderRecord[];
  demoRegisteredUsers: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
  }>;

  loginDemo: (email: string, password: string) => { ok: boolean; error?: string };
  registerDemo: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  requestPasswordReset: (email: string) => { ok: boolean; message: string };
  logout: () => void;
  updateProfile: (name: string) => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  recordOrder: (order: OrderRecord) => void;
}

const DEFAULT_DEMO_ADDRESS: SavedAddress = {
  id: 'addr-1',
  label: 'Home',
  fullName: 'Alex Rivera',
  line1: '742 Evergreen Terrace, Suite 4B',
  city: 'San Francisco',
  postalCode: '94107',
  country: 'United States',
  phone: '+1 (415) 555-0192',
  isDefault: true,
};

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash)}`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [
        {
          id: 'TV-2026-1042',
          createdAt: '2026-11-12T14:22:00.000Z',
          status: 'Delivered',
          isDemoOrder: true,
          currency: 'USD',
          customerEmail: 'demo@techverse.example',
          customerName: 'Alex Rivera',
          shippingAddress: {
            line1: '742 Evergreen Terrace, Suite 4B',
            city: 'San Francisco',
            postalCode: '94107',
            country: 'United States',
            phone: '+1 (415) 555-0192',
          },
          deliveryMethod: {
            id: 'standard',
            label: 'Standard Worldwide Shipping',
            eta: '3–5 business days',
            costUsd: 0,
          },
          paymentMethodLabel: 'Demo Checkout (No live charge)',
          items: [
            {
              productId: 'prod-wireless-earbuds-pro',
              slug: 'wireless-earbuds-pro',
              name: 'Wireless Earbuds Pro',
              image: '',
              variantLabel: 'Pearl White',
              unitPriceUsd: 129.99,
              quantity: 1,
            },
          ],
          subtotalUsd: 129.99,
          discountUsd: 0,
          shippingUsd: 0,
          taxUsd: 10.4,
          totalUsd: 140.39,
        },
      ],
      demoRegisteredUsers: [
        {
          id: 'user-demo-1',
          name: 'Alex Rivera',
          email: 'demo@techverse.example',
          passwordHash: simpleHash('TechVerse2026!'),
        },
      ],

      loginDemo: (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const found = get().demoRegisteredUsers.find((u) => u.email === cleanEmail);
        if (!found || found.passwordHash !== simpleHash(password)) {
          return {
            ok: false,
            error: 'Invalid email or password. Try demo@techverse.example / TechVerse2026!',
          };
        }
        const initials = found.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
        set({
          user: {
            id: found.id,
            name: found.name,
            email: found.email,
            avatarInitials: initials,
            addresses: [DEFAULT_DEMO_ADDRESS],
            createdAt: new Date().toISOString(),
          },
        });
        return { ok: true };
      },

      registerDemo: (name, email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const exists = get().demoRegisteredUsers.some((u) => u.email === cleanEmail);
        if (exists) {
          return { ok: false, error: 'An account with this email already exists.' };
        }
        const id = `user-${Date.now()}`;
        const trimmedName = name.trim();
        const initials = trimmedName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        set((state) => ({
          demoRegisteredUsers: [
            ...state.demoRegisteredUsers,
            {
              id,
              name: trimmedName,
              email: cleanEmail,
              passwordHash: simpleHash(password),
            },
          ],
          user: {
            id,
            name: trimmedName,
            email: cleanEmail,
            avatarInitials: initials || 'TV',
            addresses: [],
            createdAt: new Date().toISOString(),
          },
        }));
        return { ok: true };
      },

      requestPasswordReset: (email) => {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          return { ok: false, message: 'Please enter a valid email address.' };
        }
        return {
          ok: true,
          message: `Demo reset link prepared for ${cleanEmail}. In production with Supabase Auth configured, a real reset email is dispatched.`,
        };
      },

      logout: () => set({ user: null }),

      updateProfile: (name) =>
        set((state) => {
          if (!state.user) return state;
          const clean = name.trim();
          const initials = clean
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
          return {
            user: {
              ...state.user,
              name: clean,
              avatarInitials: initials || state.user.avatarInitials,
            },
          };
        }),

      addAddress: (address) =>
        set((state) => {
          if (!state.user) return state;
          const newAddr: SavedAddress = { ...address, id: `addr-${Date.now()}` };
          const existing = address.isDefault
            ? state.user.addresses.map((a) => ({ ...a, isDefault: false }))
            : state.user.addresses;
          return {
            user: {
              ...state.user,
              addresses: [...existing, newAddr],
            },
          };
        }),

      removeAddress: (id) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: state.user.addresses.filter((a) => a.id !== id),
            },
          };
        }),

      recordOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
    }),
    {
      name: 'techverse-auth-v1',
    }
  )
);
