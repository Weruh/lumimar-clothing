import React from 'react';
import { Link } from '@/lib/router';

export function Footer({ currentYear }: { currentYear?: number }) {
  const year = currentYear || new Date().getFullYear();

  return (
    <footer className="border-t border-cloud-gray/70 bg-white">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <span className="font-heading text-lg font-semibold uppercase text-ebony">LUMIMAR</span>
            <p className="mt-4 max-w-md text-sm text-ebony/70">
              Luxury fashion marketplace for Africa and the diaspora. Pieces that honour identity, celebrate heritage, and endure every wear.
            </p>
            <div className="mt-6 flex gap-3 text-ebony/70">
              <a href="https://instagram.com" className="hover:text-ebony" aria-label="Instagram">IG</a>
              <a href="https://pinterest.com" className="hover:text-ebony" aria-label="Pinterest">PT</a>
              <a href="mailto:studio@lumimar.africa" className="hover:text-ebony" aria-label="Email">Mail</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-semibold text-ebony">Discover</p>
              <ul className="mt-3 space-y-2 text-ebony/75">
                <li><Link className="hover:text-ebony" href="/category/women-curvy-babes">Curvy Babes</Link></li>
                <li><Link className="hover:text-ebony" href="/category/women-petite-babes">Petite Babes</Link></li>
                <li><Link className="hover:text-ebony" href="/category/traditional-global">Traditional and Global</Link></li>
                <li><Link className="hover:text-ebony" href="/category/shoes">Shoes</Link></li>
                <li><Link className="hover:text-ebony" href="/category/intimates-style">Intimates and Style</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-ebony">Care</p>
              <ul className="mt-3 space-y-2 text-ebony/75">
                <li><Link className="hover:text-ebony" href="/policy/shipping">Shipping policy</Link></li>
                <li><Link className="hover:text-ebony" href="/policy/returns">Returns and exchanges</Link></li>
                <li><Link className="hover:text-ebony" href="/policy/privacy">Privacy commitment</Link></li>
                <li><Link className="hover:text-ebony" href="/policy/terms">Terms of stewardship</Link></li>
                <li><Link className="hover:text-ebony" href="/checkout">Secure checkout</Link></li>
              </ul>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-ebony">Join the circle</p>
            <p className="mt-3 text-sm text-ebony/70">Receive emerging designers, atelier stories, and drop alerts - no spam, only value.</p>
            <form className="mt-5 flex flex-col gap-3 sm:flex-row" action="#" method="post">
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <input id="newsletter-email" type="email" placeholder="you@example.com" required className="w-full rounded-full border border-cloud-gray/80 px-4 py-2.5 text-sm focus:border-deep-gold focus:ring-deep-gold" />
              <button type="submit" className="rounded-full bg-ebony px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-soft-cream transition hover:bg-deep-gold hover:text-ebony">
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-ebony/60">We honour your inbox. Unsubscribe anytime.</p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-cloud-gray/70 pt-6 text-xs text-ebony/60 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {year} LUMIMAR Studio. Crafted across Nairobi, Accra, and the diaspora.</p>
          <p>Rebuilt as React + Vite with a separate Node backend.</p>
        </div>
      </div>
    </footer>
  );
}
