'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './Header';
import { Modals } from './Modals';
import { Footer } from './Footer';
import type { MegaMenuSection } from '@/lib/catalog';
import { useCart } from '@/components/CartProvider';

export type ShellProps = {
  megaMenu?: MegaMenuSection[];
  children: React.ReactNode;
};

export function Shell({ megaMenu, children }: ShellProps) {
  const menuSections = Array.isArray(megaMenu) ? megaMenu : [];
  const { items, totals } = useCart();
  const [mobileNav, setMobileNav] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        slug: item.slug,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        image: item.image,
        meta: [item.size, item.color].filter(Boolean).join(' · '),
      })),
    [items]
  );

  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  useEffect(() => {
    const shouldLock = miniCartOpen || wishlistOpen || mobileNav;
    document.documentElement.classList.toggle('overflow-hidden', shouldLock);
    document.body.classList.toggle('overflow-hidden', shouldLock);
  }, [miniCartOpen, wishlistOpen, mobileNav]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-lumimar-primary focus:text-soft-cream focus:px-4 focus:py-2 focus:rounded-full focus:shadow-card transition"
      >
        Skip to content
      </a>
      <Header
        megaMenu={menuSections}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
        miniCartOpen={miniCartOpen}
        setMiniCartOpen={setMiniCartOpen}
        wishlistOpen={wishlistOpen}
        setWishlistOpen={setWishlistOpen}
        cartCount={cartCount}
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <Modals
        miniCartOpen={miniCartOpen}
        toggleMiniCart={() => setMiniCartOpen((prev) => !prev)}
        wishlistOpen={wishlistOpen}
        toggleWishlist={() => setWishlistOpen((prev) => !prev)}
        cartItems={cartItems}
        cartTotals={totals}
      />
    </>
  );
}
