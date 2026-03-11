import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ClearCartOnMount } from '@/components/ClearCartOnMount';
import { getCatalog } from '@/lib/catalog';
import { getApiBaseUrl } from '@/lib/runtime';
import { Link } from '@/lib/router';

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const catalog = getCatalog();
  const recommendations = catalog.bestSellers(8).slice(0, 3);
  const readValue = (key: string) => {
    const value = searchParams?.[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const reference = readValue('reference') || readValue('trxref') || null;
  const [verificationMessage, setVerificationMessage] = React.useState<string | null>(null);
  const [verificationWarning, setVerificationWarning] = React.useState<string | null>(null);
  const [verificationError, setVerificationError] = React.useState<string | null>(null);
  const [verificationLoading, setVerificationLoading] = React.useState(Boolean(reference));

  React.useEffect(() => {
    let cancelled = false;

    if (!reference) {
      setVerificationLoading(false);
      setVerificationMessage(null);
      setVerificationWarning(null);
      setVerificationError(null);
      return;
    }

    const verifyPayment = async () => {
      setVerificationLoading(true);
      setVerificationMessage(null);
      setVerificationWarning(null);
      setVerificationError(null);

      try {
        const response = await fetch(`${getApiBaseUrl()}/api/checkout/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to confirm your payment.');
        }

        if (!cancelled) {
          if (data.notification === 'failed') {
            setVerificationWarning('Your payment was confirmed, but automatic store notification is unavailable right now. Please contact support and share this payment reference.');
          } else {
            setVerificationMessage(
              data.notification === 'already_sent'
                ? 'The store owner was already emailed with your order details.'
                : 'The store owner has been emailed with your paid order details.'
            );
          }
        }
      } catch (error) {
        if (!cancelled) {
          setVerificationError(error instanceof Error ? error.message : 'Unable to confirm your payment.');
        }
      } finally {
        if (!cancelled) {
          setVerificationLoading(false);
        }
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <>
      <section className="bg-soft-cream">
        <div className="container space-y-6 py-8 lg:py-12">
          <ClearCartOnMount enabled={Boolean(reference)} />
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-deep-gold/80">Payment received</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-ebony">Thank you for your order</h1>
            <p className="mt-3 text-sm text-ebony/70">
              {verificationLoading
                ? 'Paystack has redirected you successfully. We are confirming the payment and notifying the store owner now.'
                : 'Paystack has redirected you successfully. The owner notification is tied to a verified payment.'}
            </p>
            <div className="mt-6 rounded-2xl border border-cloud-gray/70 p-4 text-sm text-ebony/70">
              <p className="font-semibold text-ebony">Payment reference</p>
              <p className="mt-2 break-all">{reference || 'Reference will appear here after Paystack redirects back.'}</p>
            </div>
            {verificationMessage ? (
              <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {verificationMessage}
              </p>
            ) : null}
            {verificationWarning ? (
              <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                {verificationWarning}
              </p>
            ) : null}
            {verificationError ? (
              <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {verificationError}
              </p>
            ) : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-cloud-gray/70 p-4 text-sm text-ebony/70">
                <p className="font-semibold text-ebony">Owner notification</p>
                <p className="mt-2">The owner gets your customer details, purchased products, amount paid, and Paystack reference by email once the payment is verified.</p>
              </div>
              <div className="rounded-2xl border border-cloud-gray/70 p-4 text-sm text-ebony/70">
                <p className="font-semibold text-ebony">Fulfilment</p>
                <p className="mt-2">This MVP flow is manual. Orders are fulfilled directly from the owner&apos;s inbox without a database.</p>
              </div>
              <div className="rounded-2xl border border-cloud-gray/70 p-4 text-sm text-ebony/70">
                <p className="font-semibold text-ebony">Need help?</p>
                <p className="mt-2">Keep your payment reference handy for support, delivery questions, or follow-up.</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 text-xs uppercase tracking-[0.3em] text-ebony/50">
              <Link href="/account" className="rounded-full border border-ebony px-4 py-2 text-ebony hover:bg-ebony hover:text-soft-cream">View account</Link>
              <Link href="/" className="rounded-full border border-ebony px-4 py-2 text-ebony hover:bg-ebony hover:text-soft-cream">Continue exploring</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container space-y-6 py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-ebony/50">Curated for you</p>
              <h2 className="font-heading text-2xl font-semibold text-ebony">Recommended next investments</h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((product) => (
              <ProductCard key={product.slug} product={product} categoryLabel={catalog.getCategory(product.category_slug)?.label} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
