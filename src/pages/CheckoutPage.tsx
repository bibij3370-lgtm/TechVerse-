import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Lock, ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { useAuthStore } from '../store/useAuthStore';
import { PRODUCTS_BY_ID } from '../data/products';
import { calculateCartTotals, getUnitPriceUsd } from '../utils/pricing';
import { formatPrice } from '../utils/currency';
import { catalogService } from '../services/catalogService';
import { SITE_CONFIG } from '../config/site';
import type { OrderRecord } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/StateViews';
import { SmartImage } from '../components/common/SmartImage';
import { usePageMeta } from '../hooks/usePageMeta';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Phone number is required'),
});

const addressSchema = z.object({
  line1: z.string().min(4, 'Street address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type ContactValues = z.infer<typeof contactSchema>;
type AddressValues = z.infer<typeof addressSchema>;

const STEPS = [
  'Contact',
  'Shipping',
  'Delivery',
  'Payment',
  'Review',
  'Confirmed',
];

export const CheckoutPage: React.FC = () => {
  usePageMeta('Checkout | TechVerse', 'Secure multi-step TechVerse checkout.');

  const cart = useShopStore((s) => s.cart);
  const currency = useShopStore((s) => s.currency);
  const couponCode = useShopStore((s) => s.couponCode);
  const deliveryMethod = useShopStore((s) => s.deliveryMethod);
  const setDeliveryMethod = useShopStore((s) => s.setDeliveryMethod);
  const clearCart = useShopStore((s) => s.clearCart);

  const user = useAuthStore((s) => s.user);
  const recordOrder = useAuthStore((s) => s.recordOrder);

  const defaultAddr = user?.addresses?.[0];

  const [step, setStep] = useState(1);
  const [contactData, setContactData] = useState<ContactValues>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: defaultAddr?.phone || '',
  });
  const [addressData, setAddressData] = useState<AddressValues>({
    line1: defaultAddr?.line1 || '',
    line2: defaultAddr?.line2 || '',
    city: defaultAddr?.city || '',
    postalCode: defaultAddr?.postalCode || '',
    country: defaultAddr?.country || 'United States',
  });
  const [paymentMode, setPaymentMode] = useState<'demo-card' | 'demo-wallet'>('demo-card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactData,
  });

  const addressForm = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: addressData,
  });

  const totals = calculateCartTotals(cart, PRODUCTS_BY_ID, {
    couponCode,
    deliveryMethod,
  });

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10">
        <EmptyState
          title="Nothing in your cart to checkout"
          description="Add tech gadgets or accessories to your cart before starting checkout."
          actionLabel="Browse Shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  const deliveryOptions = [
    {
      id: 'standard' as const,
      label: 'Standard Worldwide Shipping',
      eta: '3–5 business days',
      costUsd:
        totals.subtotalUsd - totals.discountUsd >= SITE_CONFIG.freeShippingThresholdUsd
          ? 0
          : SITE_CONFIG.standardShippingUsd,
    },
    {
      id: 'express' as const,
      label: 'Express Air Courier',
      eta: '1–2 business days',
      costUsd: SITE_CONFIG.expressShippingUsd,
    },
    {
      id: 'pickup' as const,
      label: 'TechVerse Hub Pickup',
      eta: 'Ready within 4 hours',
      costUsd: 0,
    },
  ];

  const selectedDeliveryObj =
    deliveryOptions.find((d) => d.id === deliveryMethod) || deliveryOptions[0];

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const orderItems = cart
        .map((item) => {
          const p = PRODUCTS_BY_ID[item.productId];
          if (!p) return null;
          return {
            productId: p.id,
            slug: p.slug,
            name: p.name,
            image: p.images[0],
            variantLabel: item.variantLabel,
            unitPriceUsd: getUnitPriceUsd(p, item.variantId),
            quantity: item.quantity,
          };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x));

      const orderDraft: OrderRecord = {
        id: `TV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        status: 'Confirmed (Demo)',
        isDemoOrder: !SITE_CONFIG.stripeConfigured,
        currency,
        customerEmail: contactData.email,
        customerName: contactData.fullName,
        shippingAddress: {
          line1: addressData.line1,
          line2: addressData.line2,
          city: addressData.city,
          postalCode: addressData.postalCode,
          country: addressData.country,
          phone: contactData.phone,
        },
        deliveryMethod: selectedDeliveryObj,
        paymentMethodLabel:
          paymentMode === 'demo-card'
            ? 'Demo Checkout · Simulated Card (No live charge)'
            : 'Demo Checkout · Simulated Express Wallet (No live charge)',
        items: orderItems,
        subtotalUsd: totals.subtotalUsd,
        discountUsd: totals.discountUsd,
        shippingUsd: totals.shippingUsd,
        taxUsd: totals.taxUsd,
        totalUsd: totals.totalUsd,
        couponCode: totals.appliedCoupon?.code,
      };

      const res = await catalogService.createOrder(orderDraft);
      recordOrder(res.order);
      setConfirmedOrder(res.order);
      clearCart();
      setStep(6);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#151515] dark:text-white">
          Checkout
        </h1>
        {!SITE_CONFIG.stripeConfigured && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8101E]">
            <Info className="w-4 h-4" aria-hidden="true" />
            Demo Mode Active · No real payment is charged
          </span>
        )}
      </div>

      {/* Stepper Indicator */}
      <ol className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
        {STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const active = step === stepNum;
          const completed = step > stepNum;
          return (
            <li
              key={label}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold flex items-center gap-2 ${
                active
                  ? 'border-[#C8101E] bg-[#C8101E]/8 text-[#C8101E]'
                  : completed
                  ? 'border-[#218838]/30 bg-[#218838]/8 text-[#218838]'
                  : 'border-[#EAEAEA] dark:border-zinc-800 text-[#777777] dark:text-zinc-500'
              }`}
            >
              <span className="font-mono-tabular">0{stepNum}</span>
              <span className="truncate">{label}</span>
            </li>
          );
        })}
      </ol>

      {step === 6 && confirmedOrder ? (
        <div className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-6 sm:p-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 text-[#218838] mb-3">
            <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                {confirmedOrder.isDemoOrder ? 'Demo Order Recorded' : 'Order Confirmed'}
              </p>
              <h2 className="font-display text-2xl font-extrabold text-[#151515] dark:text-white">
                Order #{confirmedOrder.id}
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#555555] dark:text-zinc-300 leading-relaxed">
            Thank you, <strong>{confirmedOrder.customerName}</strong>. Your simulated order receipt has been saved to{' '}
            <strong>{confirmedOrder.customerEmail}</strong> and your TechVerse order history. No live payment was processed.
          </p>

          <div className="mt-6 rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#F9F9FA] dark:bg-zinc-900/60 p-4 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-[#666666] dark:text-zinc-400">Ship To</span>
              <span className="font-medium text-right">
                {confirmedOrder.shippingAddress.line1}, {confirmedOrder.shippingAddress.city}{' '}
                {confirmedOrder.shippingAddress.postalCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666] dark:text-zinc-400">Delivery</span>
              <span className="font-medium">{confirmedOrder.deliveryMethod.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666] dark:text-zinc-400">Total</span>
              <span className="font-extrabold tabular-nums">
                {formatPrice(confirmedOrder.totalUsd, confirmedOrder.currency)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to={`/account/orders/${confirmedOrder.id}`}
              className="rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] transition-colors"
            >
              View Order Details
            </Link>
            <Link
              to="/shop"
              className="rounded-full border border-[#EAEAEA] dark:border-zinc-700 px-6 py-2.5 text-sm font-semibold text-[#151515] dark:text-white hover:border-[#151515]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-6">
            {/* Step 1: Contact */}
            {step === 1 && (
              <form
                onSubmit={contactForm.handleSubmit((data) => {
                  setContactData(data);
                  setStep(2);
                })}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-bold">1. Contact Information</h2>
                <p className="text-xs text-[#666666] dark:text-zinc-400">
                  {user
                    ? `Signed in as ${user.email}`
                    : 'Checking out as a guest. Have an account? Sign in anytime.'}
                </p>

                <div>
                  <label htmlFor="co-name" className="block text-xs font-semibold mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="co-name"
                    {...contactForm.register('fullName')}
                    placeholder="Alex Rivera"
                    className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                  />
                  {contactForm.formState.errors.fullName && (
                    <p className="text-xs text-[#DC3545] mt-1">
                      {contactForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="co-email" className="block text-xs font-semibold mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    {...contactForm.register('email')}
                    placeholder="alex@example.com"
                    className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                  />
                  {contactForm.formState.errors.email && (
                    <p className="text-xs text-[#DC3545] mt-1">
                      {contactForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="co-phone" className="block text-xs font-semibold mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    {...contactForm.register('phone')}
                    placeholder="+1 (415) 555-0192"
                    className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                  />
                  {contactForm.formState.errors.phone && (
                    <p className="text-xs text-[#DC3545] mt-1">
                      {contactForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] cursor-pointer"
                  >
                    <span>Continue to Shipping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <form
                onSubmit={addressForm.handleSubmit((data) => {
                  setAddressData(data);
                  setStep(3);
                })}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-bold">2. Shipping Address</h2>

                <div>
                  <label htmlFor="co-line1" className="block text-xs font-semibold mb-1.5">
                    Street Address
                  </label>
                  <input
                    id="co-line1"
                    {...addressForm.register('line1')}
                    placeholder="742 Evergreen Terrace"
                    className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                  />
                  {addressForm.formState.errors.line1 && (
                    <p className="text-xs text-[#DC3545] mt-1">
                      {addressForm.formState.errors.line1.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="co-line2" className="block text-xs font-semibold mb-1.5">
                    Apartment / Suite (Optional)
                  </label>
                  <input
                    id="co-line2"
                    {...addressForm.register('line2')}
                    placeholder="Suite 4B"
                    className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="co-city" className="block text-xs font-semibold mb-1.5">
                      City
                    </label>
                    <input
                      id="co-city"
                      {...addressForm.register('city')}
                      placeholder="San Francisco"
                      className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                    />
                    {addressForm.formState.errors.city && (
                      <p className="text-xs text-[#DC3545] mt-1">
                        {addressForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="co-zip" className="block text-xs font-semibold mb-1.5">
                      Postal Code
                    </label>
                    <input
                      id="co-zip"
                      {...addressForm.register('postalCode')}
                      placeholder="94107"
                      className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                    />
                    {addressForm.formState.errors.postalCode && (
                      <p className="text-xs text-[#DC3545] mt-1">
                        {addressForm.formState.errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="co-country" className="block text-xs font-semibold mb-1.5">
                    Country / Destination
                  </label>
                  <select
                    id="co-country"
                    {...addressForm.register('country')}
                    className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#555555] hover:text-[#151515] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] cursor-pointer"
                  >
                    <span>Continue to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Delivery Method */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold">3. Delivery Method</h2>
                <div className="space-y-3">
                  {deliveryOptions.map((opt) => {
                    const active = deliveryMethod === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                          active
                            ? 'border-[#C8101E] bg-[#C8101E]/5'
                            : 'border-[#EAEAEA] dark:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={active}
                            onChange={() => setDeliveryMethod(opt.id)}
                            className="accent-[#C8101E]"
                          />
                          <div>
                            <p className="text-sm font-bold">{opt.label}</p>
                            <p className="text-xs text-[#666666] dark:text-zinc-400">{opt.eta}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold tabular-nums">
                          {opt.costUsd === 0 ? 'Free' : formatPrice(opt.costUsd, currency)}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#555555] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment Method (Demo-Safe — Never collects raw card numbers) */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">4. Payment Method</h2>
                  <Lock className="w-4 h-4 text-[#218838]" aria-hidden="true" />
                </div>

                <div className="rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-[#F9F9FA] dark:bg-zinc-900 p-4 text-xs text-[#444444] dark:text-zinc-300 leading-relaxed">
                  <strong>Demo Checkout Mode:</strong> No Stripe/payment processor credentials are configured in this preview environment. TechVerse never collects or stores raw card details in the browser. Choose a simulated payment option below to review and test order placement.
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer ${
                      paymentMode === 'demo-card'
                        ? 'border-[#C8101E] bg-[#C8101E]/5'
                        : 'border-[#EAEAEA] dark:border-zinc-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === 'demo-card'}
                      onChange={() => setPaymentMode('demo-card')}
                      className="accent-[#C8101E]"
                    />
                    <div>
                      <p className="text-sm font-bold">Simulated Card Checkout (Demo)</p>
                      <p className="text-xs text-[#666666] dark:text-zinc-400">
                        Generates a verifiable demo receipt without charging any card.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer ${
                      paymentMode === 'demo-wallet'
                        ? 'border-[#C8101E] bg-[#C8101E]/5'
                        : 'border-[#EAEAEA] dark:border-zinc-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === 'demo-wallet'}
                      onChange={() => setPaymentMode('demo-wallet')}
                      className="accent-[#C8101E]"
                    />
                    <div>
                      <p className="text-sm font-bold">Simulated Express Wallet (Demo)</p>
                      <p className="text-xs text-[#666666] dark:text-zinc-400">
                        Instant tokenized wallet simulation for local testing.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#555555] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#C8101E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A80D18] cursor-pointer"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Order Review */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-bold">5. Review &amp; Confirm</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl border border-[#EAEAEA] dark:border-zinc-800 p-3.5">
                    <p className="font-bold uppercase tracking-wider text-[#777777] mb-1">
                      Contact
                    </p>
                    <p className="font-semibold text-sm">{contactData.fullName}</p>
                    <p className="text-[#555555] dark:text-zinc-400">{contactData.email}</p>
                    <p className="text-[#555555] dark:text-zinc-400">{contactData.phone}</p>
                  </div>
                  <div className="rounded-xl border border-[#EAEAEA] dark:border-zinc-800 p-3.5">
                    <p className="font-bold uppercase tracking-wider text-[#777777] mb-1">
                      Shipping Address
                    </p>
                    <p className="font-semibold text-sm">{addressData.line1}</p>
                    <p className="text-[#555555] dark:text-zinc-400">
                      {addressData.city}, {addressData.postalCode}
                    </p>
                    <p className="text-[#555555] dark:text-zinc-400">{addressData.country}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#EAEAEA] dark:border-zinc-800 p-3.5 text-xs">
                  <p className="font-bold uppercase tracking-wider text-[#777777] mb-1">
                    Delivery &amp; Payment
                  </p>
                  <p className="font-semibold text-sm">{selectedDeliveryObj.label}</p>
                  <p className="text-[#555555] dark:text-zinc-400 mt-0.5">
                    {paymentMode === 'demo-card'
                      ? 'Demo Checkout · Simulated Card (No live charge)'
                      : 'Demo Checkout · Simulated Express Wallet (No live charge)'}
                  </p>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#555555] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    disabled={isPlacingOrder}
                    onClick={handlePlaceOrder}
                    className="inline-flex items-center gap-2 rounded-full bg-[#C8101E] px-7 py-3 text-sm font-semibold text-white hover:bg-[#A80D18] disabled:opacity-60 cursor-pointer"
                  >
                    <span>
                      {isPlacingOrder ? 'Recording Demo Order...' : 'Place Demo Order'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Order Summary */}
          <aside className="lg:col-span-5 rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-[#F9F9FA] dark:bg-[#141418] p-6 space-y-4">
            <h2 className="font-display text-lg font-bold">Order Summary</h2>
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {cart.map((item) => {
                const p = PRODUCTS_BY_ID[item.productId];
                if (!p) return null;
                const price = getUnitPriceUsd(p, item.variantId);
                return (
                  <div
                    key={`${item.productId}-${item.variantId ?? 'default'}`}
                    className="flex items-center gap-3 text-xs"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 p-1 shrink-0">
                      <SmartImage
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{p.name}</p>
                      <p className="text-[#666666] dark:text-zinc-400">Qty {item.quantity}</p>
                    </div>
                    <span className="font-bold tabular-nums">
                      {formatPrice(price * item.quantity, currency)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-3 border-t border-[#EAEAEA] dark:border-zinc-800 text-sm">
              <div className="flex justify-between text-[#555555] dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(totals.subtotalUsd, currency)}</span>
              </div>
              {totals.discountUsd > 0 && (
                <div className="flex justify-between text-[#218838]">
                  <span>Discount ({totals.appliedCoupon?.code})</span>
                  <span className="tabular-nums">-{formatPrice(totals.discountUsd, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#555555] dark:text-zinc-400">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {totals.shippingUsd === 0 ? 'Free' : formatPrice(totals.shippingUsd, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#555555] dark:text-zinc-400">
                <span>Tax (8%)</span>
                <span className="tabular-nums">{formatPrice(totals.taxUsd, currency)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold pt-2 border-t border-[#EAEAEA] dark:border-zinc-800">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(totals.totalUsd, currency)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
