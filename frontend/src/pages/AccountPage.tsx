import React from 'react';
import { formatCurrency } from '@/lib/catalog';
import { getAccountData } from '@/lib/sample-data';
import { Link } from '@/lib/router';

export default function AccountPage() {
  const { wishlist, recentProducts, lastOrder, addresses } = getAccountData();

  return (
    <section className="bg-soft-cream">
      <div className="container space-y-6 py-8 lg:py-12">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h1 className="font-heading text-3xl font-semibold text-ebony">Personal atelier</h1>
          <p className="mt-2 text-sm text-ebony/70">Your saved sizes, orders, and curations live here. Stewardship over speed.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ebony">Recent orders</p>
                <a href="#" className="text-xs uppercase tracking-[0.3em] text-ebony/50 hover:text-ebony">View all</a>
              </div>
              {lastOrder ? (
                <div className="mt-4 space-y-3 text-sm text-ebony/70">
                  <p className="font-semibold text-ebony">Order {lastOrder.order_id}</p>
                  <p>Placed {lastOrder.placed_at}</p>
                  <ul className="space-y-2">
                    {lastOrder.items.slice(0, 3).map((item, index) => (
                      <li key={`${item.title}-${index}`} className="flex items-center gap-2">
                        <span className="h-8 w-8 overflow-hidden rounded-full">
                          <img src={item.image || '/static/img/blank.png'} alt={item.title} className="h-full w-full object-cover" />
                        </span>
                        <span>{item.title} - Qty {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-4 text-sm text-ebony/60">No orders yet. Your next intentional purchase awaits.</p>
              )}
            </section>
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-sm font-semibold text-ebony">Wishlist</p>
              <p className="mt-2 text-xs text-ebony/60">Add pieces using the heart icon to build your style profile.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {wishlist.map((product) => (
                  <Link key={product.slug} href={`/product/${product.slug}`} className="flex items-center gap-3 rounded-2xl border border-cloud-gray/60 p-3 text-sm text-ebony/70 hover:border-ebony hover:text-ebony">
                    <img src={product.hero_image || '/static/img/blank.png'} alt={product.title} className="h-14 w-14 rounded-xl object-cover" />
                    <div>
                      <p className="font-semibold text-ebony">{product.title}</p>
                      <p>{formatCurrency(product.price, product.currency || 'USD')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-sm font-semibold text-ebony">Addresses</p>
              <div className="mt-3 space-y-3 text-sm text-ebony/70">
                {addresses.map((address) => (
                  <div key={address.label} className="rounded-2xl border border-cloud-gray/60 p-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">{address.label}</p>
                    <p className="mt-1 font-semibold text-ebony">{address.recipient}</p>
                    <p>{address.line1}</p>
                    <p>{address.city}, {address.country}</p>
                  </div>
                ))}
                <button type="button" className="w-full rounded-full border border-ebony px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ebony hover:bg-ebony hover:text-soft-cream">Add address</button>
              </div>
            </section>
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-sm font-semibold text-ebony">Recently explored</p>
              <div className="mt-4 space-y-3">
                {recentProducts.map((product) => (
                  <Link key={product.slug} href={`/product/${product.slug}`} className="flex items-center gap-3 rounded-2xl border border-cloud-gray/60 p-3 text-sm text-ebony/70 hover:border-ebony hover:text-ebony">
                    <img src={product.hero_image || '/static/img/blank.png'} alt={product.title} className="h-14 w-14 rounded-xl object-cover" />
                    <div>
                      <p className="font-semibold text-ebony">{product.title}</p>
                      <p>{formatCurrency(product.price, product.currency || 'USD')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
