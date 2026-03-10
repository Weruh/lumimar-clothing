import React from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BackButton } from '@/components/BackButton';
import { ProductCard } from '@/components/ProductCard';
import { extractFilters, getCatalog } from '@/lib/catalog';
import { Link } from '@/lib/router';

export default function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const catalog = getCatalog();
  const query = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) || '';
  const filters = extractFilters(searchParams);
  const products = query ? catalog.searchProducts(query, filters) : [];

  return (
    <>
      <section className="bg-soft-cream">
        <div className="container space-y-6 py-10 lg:py-14">
          <div className="space-y-2">
            <Breadcrumbs breadcrumbs={[{ label: 'Search', slug: null }]} currentLabel="Search" />
            <BackButton />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl font-semibold text-ebony">Results for "{query || '...'}"</h1>
            <p className="text-sm text-ebony/70">{products.length} pieces found. Refine or explore curated edits below.</p>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="container space-y-6 py-12">
          {products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} categoryLabel={catalog.getCategory(product.category_slug)?.label} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-cloud-gray/70 bg-soft-cream p-10 text-center">
              <p className="text-lg font-semibold text-ebony">No direct matches.</p>
              <p className="mt-2 text-sm text-ebony/70">Try a different colour, occasion, or explore editors' picks curated weekly.</p>
              <Link href="/" className="mt-4 inline-flex items-center gap-2 rounded-full border border-ebony px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ebony hover:bg-ebony hover:text-soft-cream">
                Return home
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
