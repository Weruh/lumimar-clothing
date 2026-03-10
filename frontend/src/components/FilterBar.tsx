'use client';

import React from 'react';
import type { Filters } from '@/lib/catalog';

type Facets = {
  colors: string[];
  sizes: string[];
  occasions: string[];
  ships_from: string[];
};

function HiddenFields({ filters, exclude }: { filters: Filters; exclude?: string[] }) {
  const excludeSet = new Set(exclude || []);
  return (
    <>
      {Object.entries(filters).map(([key, value]) => {
        if (!value || excludeSet.has(key)) return null;
        return <input key={key} type="hidden" name={key} value={String(value)} />;
      })}
    </>
  );
}

export function FilterBar({
  filters,
  facets,
  sort,
}: {
  filters: Filters;
  facets: Facets;
  sort: string;
}) {
  const appliedCount = Object.values(filters).filter((value) => value !== undefined && value !== '' && value !== null).length;

  return (
    <section className="sticky top-[4.75rem] z-40 border-b border-cloud-gray/70 bg-soft-cream/92 backdrop-blur">
      <div className="container flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ebony/50">
          <span>Filters</span>
          {appliedCount ? (
            <span className="rounded-full bg-ebony px-2 py-0.5 text-[10px] text-soft-cream">{appliedCount}</span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <details className="group relative">
            <summary className="flex cursor-pointer items-center gap-2 rounded-full border border-cloud-gray/70 px-3 py-1.5 font-medium text-ebony/75 transition hover:border-ebony">
              Size
              {filters.size ? (
                <span className="rounded-full bg-cloud-gray/60 px-2 py-0.5 text-[11px] uppercase tracking-wide">{filters.size}</span>
              ) : null}
            </summary>
            <div className="absolute left-0 mt-2 w-48 rounded-2xl border border-cloud-gray/70 bg-white p-3 shadow-card">
              <form method="get" className="grid grid-cols-2 gap-2">
                <HiddenFields filters={filters} exclude={['size']} />
                <button type="submit" name="size" value="" className="rounded-xl bg-cloud-gray/40 px-2 py-1 text-xs font-medium uppercase tracking-wide text-ebony/70 hover:bg-deep-gold/20 hover:text-ebony">
                  All
                </button>
                {facets.sizes.map((size) => (
                  <button key={size} type="submit" name="size" value={size} className="rounded-xl border border-cloud-gray/60 px-2 py-1 text-xs font-medium text-ebony/70 hover:border-ebony hover:text-ebony">
                    {size}
                  </button>
                ))}
              </form>
            </div>
          </details>
          <details className="group relative">
            <summary className="flex cursor-pointer items-center gap-2 rounded-full border border-cloud-gray/70 px-3 py-1.5 font-medium text-ebony/75 transition hover:border-ebony">
              Color
              {filters.color ? (
                <span className="rounded-full bg-cloud-gray/60 px-2 py-0.5 text-[11px] uppercase tracking-wide">{filters.color}</span>
              ) : null}
            </summary>
            <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-cloud-gray/70 bg-white p-3 shadow-card">
              <form method="get" className="grid grid-cols-3 gap-2">
                <HiddenFields filters={filters} exclude={['color']} />
                <button type="submit" name="color" value="" className="rounded-xl bg-cloud-gray/40 px-2 py-1 text-xs font-medium uppercase tracking-wide text-ebony/70 hover:bg-deep-gold/20 hover:text-ebony">
                  All
                </button>
                {facets.colors.map((color) => (
                  <button key={color} type="submit" name="color" value={color} className="rounded-xl border border-cloud-gray/60 px-2 py-1 text-xs font-medium text-ebony/70 hover:border-ebony hover:text-ebony">
                    {color}
                  </button>
                ))}
              </form>
            </div>
          </details>
          <details className="group relative">
            <summary className="flex cursor-pointer items-center gap-2 rounded-full border border-cloud-gray/70 px-3 py-1.5 font-medium text-ebony/75 transition hover:border-ebony">
              Occasion
              {filters.occasion ? (
                <span className="rounded-full bg-cloud-gray/60 px-2 py-0.5 text-[11px] uppercase tracking-wide">{filters.occasion}</span>
              ) : null}
            </summary>
            <div className="absolute left-0 mt-2 w-60 rounded-2xl border border-cloud-gray/70 bg-white p-3 shadow-card">
              <form method="get" className="grid gap-2">
                <HiddenFields filters={filters} exclude={['occasion']} />
                <button type="submit" name="occasion" value="" className="rounded-xl bg-cloud-gray/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ebony/70 hover:bg-deep-gold/20 hover:text-ebony">
                  All
                </button>
                {facets.occasions.map((occasion) => (
                  <button key={occasion} type="submit" name="occasion" value={occasion} className="rounded-xl border border-cloud-gray/60 px-3 py-1 text-xs font-medium text-ebony/70 hover:border-ebony hover:text-ebony">
                    {occasion}
                  </button>
                ))}
              </form>
            </div>
          </details>
          <details className="group relative">
            <summary className="flex cursor-pointer items-center gap-2 rounded-full border border-cloud-gray/70 px-3 py-1.5 font-medium text-ebony/75 transition hover:border-ebony">
              From
              {filters.ships_from ? (
                <span className="rounded-full bg-cloud-gray/60 px-2 py-0.5 text-[11px] uppercase tracking-wide">{filters.ships_from}</span>
              ) : null}
            </summary>
            <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-cloud-gray/70 bg-white p-3 shadow-card">
              <form method="get" className="grid grid-cols-2 gap-2">
                <HiddenFields filters={filters} exclude={['ships_from']} />
                <button type="submit" name="ships_from" value="" className="rounded-xl bg-cloud-gray/40 px-2 py-1 text-xs font-medium uppercase tracking-wide text-ebony/70 hover:bg-deep-gold/20 hover:text-ebony">
                  All
                </button>
                {facets.ships_from.map((location) => (
                  <button key={location} type="submit" name="ships_from" value={location} className="rounded-xl border border-cloud-gray/60 px-2 py-1 text-xs font-medium text-ebony/70 hover:border-ebony hover:text-ebony">
                    {location}
                  </button>
                ))}
              </form>
            </div>
          </details>
          <details className="group relative">
            <summary className="flex cursor-pointer items-center gap-2 rounded-full border border-cloud-gray/70 px-3 py-1.5 font-medium text-ebony/75 transition hover:border-ebony">
              Price
              {filters.price_min || filters.price_max ? (
                <span className="rounded-full bg-cloud-gray/60 px-2 py-0.5 text-[11px] uppercase tracking-wide">
                  {filters.price_min || 0} - {filters.price_max || 9999}
                </span>
              ) : null}
            </summary>
            <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-cloud-gray/70 bg-white p-4 shadow-card">
              <form method="get" className="grid grid-cols-2 gap-3 text-sm text-ebony/80">
                <HiddenFields filters={filters} exclude={['price_min', 'price_max']} />
                <label className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-ebony/60">Min (USD)</span>
                  <input type="number" step="10" min="0" name="price_min" defaultValue={filters.price_min || ''} className="w-full rounded-xl border border-cloud-gray/70 px-3 py-2 focus:border-deep-gold focus:ring-deep-gold" />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-ebony/60">Max (USD)</span>
                  <input type="number" step="10" min="0" name="price_max" defaultValue={filters.price_max || ''} className="w-full rounded-xl border border-cloud-gray/70 px-3 py-2 focus:border-deep-gold focus:ring-deep-gold" />
                </label>
                <div className="col-span-2 flex items-center justify-between">
                  <button type="submit" className="rounded-full bg-ebony px-4 py-2 text-xs font-semibold uppercase tracking-wide text-soft-cream hover:bg-deep-gold hover:text-ebony">
                    Apply
                  </button>
                  <a href="." className="text-xs font-medium text-ebony/60 hover:text-ebony">
                    Clear
                  </a>
                </div>
              </form>
            </div>
          </details>
          {appliedCount ? (
            <a href="." className="rounded-full border border-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ebony/60 hover:text-ebony">
              Clear
            </a>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-ebony/60">
            Sort
          </label>
          <form method="get">
            {Object.entries(filters).map(([key, value]) =>
              value ? <input key={key} type="hidden" name={key} value={String(value)} /> : null
            )}
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="rounded-full border border-cloud-gray/70 bg-white px-3 py-1.5 text-sm text-ebony/80 focus:border-deep-gold focus:ring-deep-gold"
              onChange={(event) => event.currentTarget.form?.submit()}
            >
              <option value="new">Newest</option>
              <option value="best">Best seller</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </form>
        </div>
      </div>
    </section>
  );
}
