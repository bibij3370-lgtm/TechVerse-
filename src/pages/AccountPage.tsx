import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { LogOut, MapPin, Package, Plus, Trash2, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/currency';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/StateViews';
import { usePageMeta } from '../hooks/usePageMeta';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AccountPage: React.FC = () => {
  usePageMeta('My Account | TechVerse', 'Manage your TechVerse profile, saved addresses, and orders.');

  const user = useAuthStore((s) => s.user);
  const orders = useAuthStore((s) => s.orders);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const addAddress = useAuthStore((s) => s.addAddress);
  const removeAddress = useAuthStore((s) => s.removeAddress);
  const pushToast = useUIStore((s) => s.pushToast);
  const navigate = useNavigate();

  const [nameInput, setNameInput] = useState(user?.name || '');
  const [addrLabel, setAddrLabel] = useState('Office');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrZip, setAddrZip] = useState('');

  if (!user) return <Navigate to="/login" replace />;

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine1.trim() || !addrCity.trim() || !addrZip.trim()) return;
    addAddress({
      label: addrLabel.trim() || 'Saved',
      fullName: user.name,
      line1: addrLine1.trim(),
      city: addrCity.trim(),
      postalCode: addrZip.trim(),
      country: 'United States',
      phone: '+1 (555) 010-9900',
    });
    setAddrLine1('');
    setAddrCity('');
    setAddrZip('');
    pushToast({ title: 'Address saved', tone: 'success' });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Account' }]} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#C8101E] text-white font-display font-bold flex items-center justify-center text-base">
            {user.avatarInitials}
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold">{user.name}</h1>
            <p className="text-xs text-[#666666] dark:text-zinc-400">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="inline-flex items-center gap-2 rounded-full border border-[#EAEAEA] dark:border-zinc-700 px-4 py-2 text-xs font-semibold hover:border-[#DC3545] hover:text-[#DC3545] cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile + Addresses */}
        <div className="lg:col-span-6 space-y-6">
          <section className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-5 space-y-4">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-[#C8101E]" />
              <span>Profile Details</span>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!nameInput.trim()) return;
                updateProfile(nameInput);
                pushToast({ title: 'Profile updated', tone: 'success' });
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                aria-label="Full name"
                className="flex-1 h-10 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm"
              />
              <button
                type="submit"
                className="px-4 h-10 rounded-xl bg-[#151515] dark:bg-[#C8101E] text-white text-xs font-semibold cursor-pointer"
              >
                Save
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-5 space-y-4">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C8101E]" />
              <span>Saved Addresses</span>
            </h2>
            {user.addresses.length === 0 ? (
              <p className="text-xs text-[#666666] dark:text-zinc-400">No saved addresses yet.</p>
            ) : (
              <div className="space-y-2.5">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-sm">{addr.label}</p>
                      <p className="text-[#555555] dark:text-zinc-400">{addr.line1}</p>
                      <p className="text-[#555555] dark:text-zinc-400">
                        {addr.city}, {addr.postalCode} · {addr.country}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddress(addr.id)}
                      aria-label={`Delete ${addr.label} address`}
                      className="p-1.5 text-[#777777] hover:text-[#DC3545] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddAddress} className="pt-3 border-t border-[#EAEAEA] dark:border-zinc-800 space-y-2.5">
              <p className="text-xs font-semibold">Add New Address</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  placeholder="Label (e.g. Office)"
                  aria-label="Address label"
                  className="h-9 rounded-lg border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-xs"
                />
                <input
                  value={addrZip}
                  onChange={(e) => setAddrZip(e.target.value)}
                  placeholder="Postal Code"
                  aria-label="Postal Code"
                  className="h-9 rounded-lg border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-xs"
                />
              </div>
              <input
                value={addrLine1}
                onChange={(e) => setAddrLine1(e.target.value)}
                placeholder="Street address"
                aria-label="Street address"
                className="w-full h-9 rounded-lg border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-xs"
              />
              <div className="flex gap-2">
                <input
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  placeholder="City"
                  aria-label="City"
                  className="flex-1 h-9 rounded-lg border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#C8101E] px-3.5 h-9 text-xs font-semibold text-white cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Recent Orders */}
        <section className="lg:col-span-6 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <Package className="w-4 h-4 text-[#C8101E]" />
              <span>Recent Orders</span>
            </h2>
            <Link to="/account/orders" className="text-xs font-semibold text-[#C8101E] hover:underline">
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-[#666666] dark:text-zinc-400">No orders placed yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((ord) => (
                <Link
                  key={ord.id}
                  to={`/account/orders/${ord.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 p-3.5 hover:border-[#C8101E] transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold font-mono-tabular">#{ord.id}</p>
                    <p className="text-xs text-[#666666] dark:text-zinc-400 mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString()} · {ord.status}
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">
                    {formatPrice(ord.totalUsd, ord.currency)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export const OrdersPage: React.FC = () => {
  usePageMeta('Order History | TechVerse');
  const orders = useAuthStore((s) => s.orders);

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Account', to: '/account' },
          { label: 'Orders' },
        ]}
      />
      <h1 className="font-display text-2xl font-extrabold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your completed and demo orders will appear here."
          actionLabel="Browse Shop"
          actionTo="/shop"
        />
      ) : (
        <div className="space-y-3">
          {orders.map((ord) => (
            <Link
              key={ord.id}
              to={`/account/orders/${ord.id}`}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-5 hover:border-[#C8101E] transition-colors"
            >
              <div>
                <p className="text-base font-bold font-mono-tabular">Order #{ord.id}</p>
                <p className="text-xs text-[#666666] dark:text-zinc-400 mt-0.5">
                  {new Date(ord.createdAt).toLocaleString()} · {ord.items.length} item(s) · {ord.status}
                </p>
              </div>
              <span className="text-base font-extrabold tabular-nums">
                {formatPrice(ord.totalUsd, ord.currency)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orders = useAuthStore((s) => s.orders);
  const order = orders.find((o) => o.id === id);

  usePageMeta(order ? `Order #${order.id} | TechVerse` : 'Order Not Found | TechVerse');

  if (!order) {
    return (
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10">
        <EmptyState
          title="Order not found"
          description="We could not locate this order ID in your local history."
          actionLabel="View Orders"
          actionTo="/account/orders"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Orders', to: '/account/orders' },
          { label: `#${order.id}` },
        ]}
      />

      <div className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAEAEA] dark:border-zinc-800">
          <div>
            <h1 className="font-display text-2xl font-extrabold font-mono-tabular">
              Order #{order.id}
            </h1>
            <p className="text-xs text-[#666666] dark:text-zinc-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()} · {order.status}
            </p>
          </div>
          <span className="text-xl font-extrabold tabular-nums">
            {formatPrice(order.totalUsd, order.currency)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <p className="font-bold uppercase tracking-wider text-xs text-[#777777] mb-1">
              Shipping Address
            </p>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-[#555555] dark:text-zinc-400">{order.shippingAddress.line1}</p>
            <p className="text-[#555555] dark:text-zinc-400">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode} ·{' '}
              {order.shippingAddress.country}
            </p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-xs text-[#777777] mb-1">
              Payment &amp; Fulfillment
            </p>
            <p className="font-semibold">{order.deliveryMethod.label}</p>
            <p className="text-[#555555] dark:text-zinc-400">{order.paymentMethodLabel}</p>
          </div>
        </div>

        <div className="divide-y divide-[#EAEAEA] dark:divide-zinc-800 border-t border-[#EAEAEA] dark:border-zinc-800">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4 text-sm">
              <div>
                <Link
                  to={`/product/${item.slug}`}
                  className="font-semibold hover:text-[#C8101E]"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-[#666666] dark:text-zinc-400">
                  Qty {item.quantity} {item.variantLabel ? `· ${item.variantLabel}` : ''}
                </p>
              </div>
              <span className="font-bold tabular-nums">
                {formatPrice(item.unitPriceUsd * item.quantity, order.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
