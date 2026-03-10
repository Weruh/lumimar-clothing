'use client';

import React, { useState } from 'react';
import type { Filters } from '@/lib/catalog';

type Facets = {
  colors: string[];
  sizes: string[];
  occasions: string[];
  ships_from: string[];
};

export function CategoryFilterDrawer({ filters, facets }: { filters: Filters; facets: Facets }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-ebony px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ebony lg:hidden"
        onClick={() => setOpen(true)}
      >
        Refine filters
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="flex-1 bg-ebony/40" onClick={() => setOpen(false)}></div>
          <div className="h-full w-full max-w-md bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-cloud-gray/70 px-5 py-4">
              <p className="text-sm font-semibold text-ebony">Refine selection</p>
              <button aria-label="Close filters" onClick={() => setOpen(false)} type="button">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-full overflow-y-auto p-5">
              <form method="get" className="space-y-5 text-sm text-ebony/70">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ebony/50">Size</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <label className="rounded-full border border-cloud-gray/70 px-3 py-1">
                      <input type="radio" name="size" value="" className="sr-only" />
                      <span>All</span>
                    </label>
                    {facets.sizes.map((size) => (
                      <label key={size} className="rounded-full border border-cloud-gray/70 px-3 py-1">
                        <input type="radio" name="size" value={size} className="sr-only" defaultChecked={filters.size === size} />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ebony/50">Color</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="rounded-2xl border border-cloud-gray/70 px-3 py-1">
                      <input type="radio" name="color" value="" className="sr-only" />
                      <span>All</span>
                    </label>
                    {facets.colors.map((color) => (
                      <label key={color} className="rounded-2xl border border-cloud-gray/70 px-3 py-1 text-sm">
                        <input type="radio" name="color" value={color} className="sr-only" defaultChecked={filters.color === color} />
                        <span>{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ebony/50">Min price</span>
                    <input type="number" name="price_min" defaultValue={filters.price_min || ''} className="w-full rounded-xl border border-cloud-gray/70 px-3 py-2 focus:border-deep-gold focus:ring-deep-gold" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ebony/50">Max price</span>
                    <input type="number" name="price_max" defaultValue={filters.price_max || ''} className="w-full rounded-xl border border-cloud-gray/70 px-3 py-2 focus:border-deep-gold focus:ring-deep-gold" />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 rounded-full bg-ebony px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-soft-cream">Apply</button>
                  <a href="." className="flex-1 rounded-full border border-cloud-gray/70 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-ebony/60">Clear</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
