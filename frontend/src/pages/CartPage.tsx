'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BackButton } from '@/components/BackButton';
import { ProductCard } from '@/components/ProductCard';
import { formatCurrency, getCatalog } from '@/lib/catalog';
import { cartItemKey, useCart } from '@/components/CartProvider';
import { Link } from '@/lib/router';

export default function CartPage() {
  const catalog = getCatalog();
  const { items, totals, updateItemQuantity, removeItem } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const suggested = catalog.bestSellers(6);

  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        total: item.price * item.quantity,
      })),
    [items]
  );

  const getQuantity = (itemKey: string, fallback: number) =>
    typeof quantities[itemKey] === 'number' ? quantities[itemKey] : fallback;

  return (
    <>
      <section className="bg-soft-cream">
        <div className="container space-y-6 py-8 lg:py-12">
          <div className="space-y-2">
            <Breadcrumbs breadcrumbs={[]} currentLabel="Cart" />
            <BackButton />
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <h1 className="font-heading text-3xl font-semibold text-ebony">Your selections</h1>
              {cartItems.length ? (
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const key = cartItemKey(item);
                    const qtyValue = getQuantity(key, item.quantity);
                    return (
                      <article key={`${item.slug}-${index}`} className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-soft sm:flex-row sm:items-center">
                        <img src={item.image || '/static/img/blank.png'} alt={item.title} className="h-28 w-28 rounded-2xl object-cover" />
                        <div className="flex flex-1 flex-col gap-2 text-sm text-ebony/70">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
                            <Link href={`/product/${item.slug}`} className="text-base font-semibold text-ebony hover:underline">
                              {item.title}
                            </Link>
                            <span className="text-base font-semibold text-ebony">{formatCurrency(item.total, 'USD')}</span>
                          </div>
                          {item.size || item.color ? (
                            <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">Size {item.size || '-'} - {item.color || 'Classic finish'}</p>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-ebony/60">
                            <span>Ships with care</span>
                            <span>-</span>
                            <span>Secure checkout</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <label className="sr-only" htmlFor={`qty-${index}`}>Quantity</label>
                              <input
                                id={`qty-${index}`}
                                type="number"
                                min={0}
                                value={qtyValue}
                                onChange={(event) => {
                                  const nextValue = Number(event.target.value);
                                  setQuantities((prev) => ({ ...prev, [key]: nextValue }));
                                }}
                                className="w-20 rounded-full border border-cloud-gray/70 px-3 py-1 text-sm focus:border-deep-gold focus:ring-deep-gold"
                              />
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(item, qtyValue)}
                                className="rounded-full border border-ebony px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-ebony hover:bg-ebony hover:text-soft-cream"
                              >
                                Update
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item)}
                              className="text-xs font-semibold uppercase tracking-[0.3em] text-ebony/50 hover:text-rose-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border border-cloud-gray/70 bg-white p-10 text-center shadow-soft">
                  <p className="text-lg font-semibold text-ebony">Your cart is currently reflective.</p>
                  <p className="mt-2 text-sm text-ebony/70">Explore intentional pieces to begin your capsule.</p>
                  <Link href="/" className="mt-4 inline-flex items-center gap-2 rounded-full border border-ebony px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ebony hover:bg-ebony hover:text-soft-cream">Return to collections</Link>
                </div>
              )}
            </div>
            <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-soft">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">Order summary</p>
                <div className="space-y-2 text-sm text-ebony/70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totals.subtotal, 'USD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{totals.shipping === 0 ? 'Included' : formatCurrency(totals.shipping, 'USD')}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-ebony">
                    <span>Total</span>
                    <span>{formatCurrency(totals.grand_total, 'USD')}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs text-ebony/60">
                <p>Secure checkout powered by Stripe test, Paystack/Flutterwave, and Mpesa STK.</p>
                <p>Free returns within 7 days. You decide, we deliver.</p>
              </div>
              <div className="space-y-3">
                <Link href="/checkout" className="block rounded-full bg-ebony px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-soft-cream hover:bg-deep-gold hover:text-ebony">
                  Proceed to checkout
                </Link>
                <Link href="/" className="block rounded-full border border-ebony px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-ebony hover:bg-ebony hover:text-soft-cream">
                  Continue shopping
                </Link>
              </div>
              <div className="rounded-2xl border border-cloud-gray/70 p-4 text-sm text-ebony/70">
                <p className="font-semibold text-ebony">Reassurance</p>
                <p className="mt-2">Pieces are inspected twice before dispatch. Repairs available for 18 months after purchase.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {suggested.length ? (
        <section className="bg-white">
          <div className="container space-y-6 py-12">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-ebony/50">You may also consider</p>
                <h2 className="font-heading text-2xl font-semibold text-ebony">Suggested stewarded pieces</h2>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggested.map((product) => (
                <ProductCard key={product.slug} product={product} categoryLabel={catalog.getCategory(product.category_slug)?.label} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
