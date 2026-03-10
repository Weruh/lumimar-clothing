'use client';

import React from 'react';
import { formatCurrency } from '@/lib/catalog';
import { Link } from '@/lib/router';

type CartItem = {
  slug: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
  image?: string | null;
  meta?: string | null;
};

export type ModalsProps = {
  miniCartOpen: boolean;
  toggleMiniCart: () => void;
  wishlistOpen: boolean;
  toggleWishlist: () => void;
  cartItems: CartItem[];
  cartTotals: { subtotal: number; shipping: number; grand_total: number };
};

export function Modals({
  miniCartOpen,
  toggleMiniCart,
  wishlistOpen,
  toggleWishlist,
  cartItems,
  cartTotals,
}: ModalsProps) {
  return (
    <>
      {miniCartOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-ebony/55 backdrop-blur-lg" onClick={toggleMiniCart}></div>
          <aside className="relative w-full max-w-md bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-cloud-gray/60 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-ebony">Your selections</p>
                <p className="text-xs text-ebony/60">Investment reinforced - curated with intention.</p>
              </div>
              <button onClick={toggleMiniCart} className="text-ebony/70 hover:text-ebony" aria-label="Close cart" type="button">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {cartItems.length ? (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cartItems.map((item) => (
                  <article key={item.slug} className="mb-4 flex gap-3 rounded-2xl border border-cloud-gray/60 p-3 last:mb-0">
                    <img src={item.image || '/static/img/blank.png'} alt={item.title} className="h-20 w-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ebony">{item.title}</p>
                      {item.meta ? <p className="text-xs text-ebony/60">{item.meta}</p> : null}
                      <div className="mt-2 flex items-center justify-between text-xs text-ebony/70">
                        <span>
                          {item.quantity} x {formatCurrency(item.price)}
                        </span>
                        <span className="font-semibold text-ebony">{formatCurrency(item.total)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex-1 px-6 py-16 text-center">
                <p className="text-sm font-medium text-ebony">Your cart is reflective by design.</p>
                <p className="mt-2 text-xs text-ebony/60">Explore new arrivals crafted to travel well and last longer.</p>
                <Link href="/" className="mt-4 inline-flex items-center justify-center rounded-full border border-ebony px-6 py-2 text-xs font-semibold uppercase tracking-wide text-ebony hover:bg-ebony hover:text-soft-cream">
                  Discover pieces
                </Link>
              </div>
            )}
            <div className="border-t border-cloud-gray/60 px-6 py-4">
              <div className="flex items-center justify-between text-sm text-ebony/70">
                <span>Subtotal</span>
                <span className="font-semibold text-ebony">{formatCurrency(cartTotals.subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-ebony/60">
                <span>Estimated shipping</span>
                <span>{cartTotals.shipping === 0 ? 'Included' : formatCurrency(cartTotals.shipping)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/cart" className="flex-1 rounded-full border border-ebony px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ebony text-center hover:bg-ebony hover:text-soft-cream">
                  View cart
                </Link>
                <Link href="/checkout" className="flex-1 rounded-full bg-ebony px-4 py-2 text-xs font-semibold uppercase tracking-wide text-soft-cream text-center hover:bg-deep-gold hover:text-ebony">
                  Checkout
                </Link>
              </div>
              <p className="mt-3 text-[11px] text-ebony/60">Good choice, this piece holds up wash after wash.</p>
            </div>
          </aside>
        </div>
      ) : null}

      {wishlistOpen ? (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-ebony/40" onClick={toggleWishlist}></div>
          <aside className="relative ml-auto w-full max-w-sm bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ebony">Style profile</h2>
              <button onClick={toggleWishlist} className="text-ebony/70 hover:text-ebony" aria-label="Close wishlist" type="button">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-4 text-sm text-ebony/70">
              Save pieces you love and we will complete your style profile - <span className="font-semibold text-ebony">40% complete</span>.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-cloud-gray/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-ebony/40">Tip</p>
                <p className="mt-2 text-sm text-ebony">Tap the heart icon on any product card to commit to favourites without checkout.</p>
              </div>
              <div className="rounded-2xl border border-cloud-gray/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-ebony/40">Insight</p>
                <p className="mt-2 text-sm text-ebony">Once your profile reaches 60%, expect bespoke drops aligned to your size and occasion needs.</p>
              </div>
            </div>
            <Link href="/account" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ebony px-4 py-2 text-xs font-semibold uppercase tracking-wide text-soft-cream hover:bg-deep-gold hover:text-ebony">
              View your curation
            </Link>
          </aside>
        </div>
      ) : null}
    </>
  );
}
