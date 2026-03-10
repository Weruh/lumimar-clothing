'use client';

import React from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BackButton } from '@/components/BackButton';
import { convertUsdToKes, formatCurrency, getCatalog } from '@/lib/catalog';
import { useCart } from '@/components/CartProvider';
import { getApiBaseUrl } from '@/lib/runtime';

const paymentMethods = [
  { name: 'Paystack', description: 'Secure card payments and supported Paystack channels.' },
];

type CheckoutQuote = {
  currency: string;
  items: Array<{
    slug: string;
    quantity: number;
    size?: string | null;
    color?: string | null;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shipping: number;
  grandTotal: number;
};

export default function CheckoutPage() {
  const { items } = useCart();
  const catalog = getCatalog();
  const cartEmpty = items.length === 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [quote, setQuote] = React.useState<CheckoutQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = React.useState(false);
  const [quoteError, setQuoteError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fallbackQuote = React.useMemo<CheckoutQuote | null>(() => {
    if (cartEmpty) {
      return null;
    }

    const pricedItems = items.map((item) => {
      const product = catalog.productsBySlug.get(item.slug);
      const sourceCurrency = String(product?.currency || 'USD').trim().toUpperCase();
      const basePrice = Number(product?.price ?? item.price ?? 0);
      const unitPrice = sourceCurrency === 'USD' ? convertUsdToKes(basePrice) : basePrice;

      return {
        slug: item.slug,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        unitPrice,
        lineTotal: Math.round((unitPrice * item.quantity + Number.EPSILON) * 100) / 100,
      };
    });

    const subtotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);

    return {
      currency: 'KES',
      items: pricedItems,
      subtotal,
      shipping: 0,
      grandTotal: subtotal,
    };
  }, [cartEmpty, catalog.productsBySlug, items]);

  const summaryQuote = quote || fallbackQuote;

  React.useEffect(() => {
    let cancelled = false;

    if (cartEmpty) {
      setQuote(null);
      setQuoteLoading(false);
      setQuoteError(null);
      return;
    }

    const fetchQuote = async () => {
      setQuoteLoading(true);
      setQuoteError(null);

      try {
        const response = await fetch(`${getApiBaseUrl()}/api/checkout/quote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              slug: item.slug,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            })),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to calculate checkout total.');
        }

        if (!cancelled) {
          setQuote(data);
        }
      } catch (quoteFetchError) {
        if (!cancelled) {
          setQuote(null);
          setQuoteError(quoteFetchError instanceof Error ? quoteFetchError.message : 'Unable to calculate checkout total.');
        }
      } finally {
        if (!cancelled) {
          setQuoteLoading(false);
        }
      }
    };

    fetchQuote();

    return () => {
      cancelled = true;
    };
  }, [cartEmpty, items]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cartEmpty || isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const readField = (name: string) => String(formData.get(name) ?? '').trim();

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/checkout/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            fullName: readField('full_name'),
            email: readField('email'),
            phone: readField('phone'),
            mpesa: readField('mpesa'),
            address: readField('address'),
            city: readField('city'),
            country: readField('country'),
            postal: readField('postal'),
            notes: readField('notes'),
          },
          items: items.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to start payment.');
      }

      window.location.assign(data.authorizationUrl);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to start payment.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-soft-cream">
      <div className="container space-y-6 py-8 lg:py-12">
        <div className="space-y-2">
          <Breadcrumbs breadcrumbs={[]} currentLabel="Checkout" />
          <BackButton />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form method="post" onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="font-heading text-3xl font-semibold text-ebony">Secure checkout</h1>
                <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">1 of 3</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-ebony/70">
                  <span>Full name</span>
                  <input type="text" name="full_name" required className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-2.5 focus:border-deep-gold focus:ring-deep-gold" />
                </label>
                <label className="space-y-1 text-sm text-ebony/70">
                  <span>Email</span>
                  <input type="email" name="email" required className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-2.5 focus:border-deep-gold focus:ring-deep-gold" />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-ebony/70">
                  <span>Phone (for delivery)</span>
                  <input type="tel" name="phone" required className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-2.5 focus:border-deep-gold focus:ring-deep-gold" />
                </label>
                <label className="space-y-1 text-sm text-ebony/70">
                  <span>Mpesa / Mobile number</span>
                  <input type="tel" name="mpesa" className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-2.5 focus:border-deep-gold focus:ring-deep-gold" />
                </label>
              </div>
              <label className="space-y-1 text-sm text-ebony/70">
                <span>Shipping address</span>
                <input type="text" name="address" required className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-2.5 focus:border-deep-gold focus:ring-deep-gold" />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="space-y-1 text-sm text-ebony/70">
                  <span>City</span>
                  <input type="text" name="city" required className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-2.5 focus:border-deep-gold focus:ring-deep-gold" />
                </label>
                <label className="space-y-1 text-sm text-ebony/70">
                  <span>Country</span>
                  <input type="text" name="country" required className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-2.5 focus:border-deep-gold focus:ring-deep-gold" />
                </label>
                <label className="space-y-1 text-sm text-ebony/70">
                  <span>Postal code</span>
                  <input type="text" name="postal" className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-2.5 focus:border-deep-gold focus:ring-deep-gold" />
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">Payment preference</p>
              <div className="grid gap-3 md:grid-cols-3">
                {paymentMethods.map((method, index) => (
                  <label key={method.name} className="flex flex-col gap-2 rounded-2xl border border-cloud-gray/70 p-4 text-sm text-ebony/70 hover:border-ebony">
                    <div className="flex items-center gap-2">
                      <input type="radio" name="payment_method" value={method.name} className="text-ebony focus:ring-deep-gold" defaultChecked={index === 0} />
                      <span className="font-semibold text-ebony">{method.name}</span>
                    </div>
                    <p className="text-xs text-ebony/60">{method.description}</p>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-3 text-sm text-ebony/70">
              <p className="font-semibold text-ebony">Notes for atelier (optional)</p>
              <textarea rows={3} name="notes" className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-2.5 focus:border-deep-gold focus:ring-deep-gold" placeholder="Share fit guidance, gift notes, or delivery timing."></textarea>
            </div>
            {cartEmpty ? (
              <p className="rounded-2xl bg-cloud-gray/40 p-4 text-xs text-ebony/70">
                Your cart is empty. Add a piece to continue checkout.
              </p>
            ) : null}
            {quoteError ? (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                {quoteError}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <button type="submit" className="w-full rounded-full bg-ebony px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-soft-cream transition hover:bg-deep-gold hover:text-ebony disabled:cursor-not-allowed disabled:bg-cloud-gray/80 disabled:text-ebony/40" disabled={cartEmpty || isSubmitting || quoteLoading || Boolean(quoteError)}>
              {isSubmitting ? 'Redirecting to Paystack...' : 'Pay with Paystack'}
            </button>
          </form>
          <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ebony/50">
              <span>Order summary</span>
              <span>{itemCount} items</span>
            </div>
            <div className="space-y-4">
              {items.length ? (
                items.map((item, index) => (
                  <div key={`${item.slug}-${index}`} className="flex items-center gap-3 rounded-2xl border border-cloud-gray/60 p-3">
                    <img src={item.image || '/static/img/blank.png'} alt={item.title} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="flex-1 text-sm text-ebony/70">
                      <p className="font-semibold text-ebony">{item.title}</p>
                      <p className="text-xs text-ebony/50">Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-ebony">
                      {formatCurrency(
                        summaryQuote?.items.find((quotedItem) =>
                          quotedItem.slug === item.slug &&
                          quotedItem.size === (item.size || null) &&
                          quotedItem.color === (item.color || null)
                        )?.lineTotal ?? 0,
                        summaryQuote?.currency || 'KES'
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-cloud-gray/70 bg-soft-cream p-4 text-xs text-ebony/60">
                  Add pieces to your cart to populate this summary.
                </p>
              )}
            </div>
            <div className="space-y-2 text-sm text-ebony/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(summaryQuote?.subtotal ?? 0, summaryQuote?.currency || 'KES')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {((summaryQuote?.shipping ?? 0) === 0 ? 'Included' : formatCurrency(summaryQuote?.shipping ?? 0, summaryQuote?.currency || 'KES'))}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-ebony">
                <span>Total</span>
                <span>{formatCurrency(summaryQuote?.grandTotal ?? 0, summaryQuote?.currency || 'KES')}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-cloud-gray/70 p-4 text-xs text-ebony/60">
              <p className="font-semibold text-ebony">Stewardship promise</p>
              <p className="mt-2">Pieces are insured door-to-door. Repairs complimentary within 18 months of purchase.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
