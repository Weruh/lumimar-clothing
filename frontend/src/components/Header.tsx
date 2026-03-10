'use client';

import React from 'react';
import type { MegaMenuSection } from '@/lib/catalog';
import { Link, useRouter } from '@/lib/router';

export type HeaderProps = {
  megaMenu?: MegaMenuSection[];
  mobileNav: boolean;
  setMobileNav: (open: boolean) => void;
  miniCartOpen: boolean;
  setMiniCartOpen: (open: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  cartCount: number;
};

export function Header({
  megaMenu,
  mobileNav,
  setMobileNav,
  miniCartOpen,
  setMiniCartOpen,
  wishlistOpen,
  setWishlistOpen,
  cartCount,
}: HeaderProps) {
  const router = useRouter();
  const menuSections = Array.isArray(megaMenu) ? megaMenu : [];
  const [desktopQuery, setDesktopQuery] = React.useState('');
  const [mobileQuery, setMobileQuery] = React.useState('');

  const submitSearch = (query: string) => {
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
    setMobileNav(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-ebony text-soft-cream shadow-card">
      <div className="bg-lumimar-primary/85 text-[11px] uppercase tracking-[0.28em] text-soft-cream/90">
        <div className="container flex items-center justify-between py-2">
          <span>Free shipping on curated drops</span>
          <span className="hidden sm:inline">Free returns - No hidden fees</span>
          <span className="hidden lg:inline">Secure checkout worldwide</span>
        </div>
      </div>
      <div className="container flex items-center gap-4 py-3 lg:py-4">
        <Link href="/" className="font-heading text-lg font-semibold tracking-wide uppercase text-soft-cream">
          LUMIMAR
        </Link>
        <form
          className="relative hidden flex-1 lg:block"
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch(desktopQuery);
          }}
        >
          <label htmlFor="site-search" className="sr-only">Search LUMIMAR</label>
          <input
            id="site-search"
            type="search"
            name="q"
            placeholder="Search silhouettes, fabrics, creators..."
            value={desktopQuery}
            onChange={(event) => setDesktopQuery(event.target.value)}
            className="w-full rounded-full border border-cloud-gray/40 bg-white px-5 py-2.5 text-sm text-ebony placeholder:text-cloud-gray focus:border-lumimar-secondary focus:ring-lumimar-secondary transition"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-lumimar-primary px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-soft-cream transition hover:bg-lumimar-secondary hover:text-lumimar-dark"
          >
            search
          </button>
        </form>
        <div className="ml-auto flex items-center gap-4 lg:gap-6 text-soft-cream">
          <Link href="/account" className="hidden text-sm font-medium text-soft-cream/85 hover:text-soft-cream lg:inline-flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a8.25 8.25 0 0115 0" />
            </svg>
            <span>Account</span>
          </Link>
          <button className="relative text-sm font-medium text-soft-cream/85 hover:text-soft-cream" onClick={() => setWishlistOpen(!wishlistOpen)} type="button">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-1.794-1.556-3.25-3.5-3.25-1.657 0-3.109 1.14-3.439 2.649-.33-1.51-1.782-2.649-3.44-2.649-1.943 0-3.5 1.456-3.5 3.25 0 4.276 6.94 8.5 6.94 8.5S21 12.526 21 8.25z" />
            </svg>
            <span className="sr-only">Wishlist</span>
          </button>
          <button className="relative text-sm font-medium text-soft-cream/85 hover:text-soft-cream" onClick={() => setMiniCartOpen(!miniCartOpen)} type="button">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 4.5h2.386a1 1 0 01.99.858l.84 6.026a2 2 0 001.987 1.716h8.666a2 2 0 001.987-1.716l.41-2.937H7.76" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm7.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span className="sr-only">Open cart</span>
            {cartCount > 0 ? (
              <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-lumimar-secondary px-1 text-xs font-semibold text-lumimar-dark">
                {cartCount}
              </span>
            ) : null}
          </button>
          <button
            className="lg:hidden text-soft-cream hover:text-soft-cream/90"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
            type="button"
          >
            <span className="sr-only">Open navigation</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
      <div className="hidden lg:block bg-ebony">
        <div className="container">
          <nav className="relative flex items-center gap-6 overflow-x-auto py-3 text-sm font-semibold text-soft-cream/85">
            {menuSections.map((section) => (
              <Link
                key={section.root.slug}
                href={`/category/${section.root.slug}`}
                className="shrink-0 whitespace-nowrap transition hover:text-soft-cream"
              >
                {section.root.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className={mobileNav ? 'fixed inset-0 z-50 lg:hidden' : 'hidden'}>
        <div className="absolute inset-0 bg-lumimar-dark/50" onClick={() => setMobileNav(false)}></div>
        <div className="absolute top-0 right-0 h-full w-[80vw] max-w-sm bg-soft-cream shadow-card flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-cloud-gray/70">
            <span className="font-heading text-lg uppercase">LUMIMAR</span>
            <button onClick={() => setMobileNav(false)} aria-label="Close navigation">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-5 overflow-y-auto">
            <form
              className="mb-6"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch(mobileQuery);
              }}
            >
              <label className="sr-only" htmlFor="mobile-search">Search LUMIMAR</label>
              <input
                id="mobile-search"
                name="q"
                type="search"
                value={mobileQuery}
                onChange={(event) => setMobileQuery(event.target.value)}
                placeholder="Search the marketplace"
                className="w-full rounded-2xl border border-cloud-gray/80 px-4 py-2.5 text-sm focus:border-deep-gold focus:ring-deep-gold"
              />
            </form>
            <nav className="space-y-2">
              {menuSections.map((section) => (
                <Link
                  key={section.root.slug}
                  className="block rounded-xl border border-cloud-gray/60 px-3 py-2 text-base font-semibold text-ebony transition hover:border-ebony/70 hover:bg-cloud-gray/20"
                  href={`/category/${section.root.slug}`}
                  onClick={() => setMobileNav(false)}
                >
                  {section.root.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 space-y-3 text-sm">
              <Link href="/account" className="flex items-center gap-2 font-medium text-ebony">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a8.25 8.25 0 0115 0" />
                </svg>
                Account
              </Link>
              <Link href="/cart" className="flex items-center gap-2 font-medium text-ebony">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2.586a1 1 0 01.942.664l.828 2.485" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 9H20.25l-1.2 5.995a2 2 0 01-1.974 1.67H10a2 2 0 01-1.974-1.67L7.5 9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20a1 1 0 11-2 0 1 1 0 012 0zM18 20a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
