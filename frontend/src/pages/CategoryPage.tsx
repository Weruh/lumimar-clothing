import React from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CategoryFilterDrawer } from '@/components/CategoryFilterDrawer';
import { ProductCard } from '@/components/ProductCard';
import { extractFilters, getCatalog, paginate } from '@/lib/catalog';
import { Link } from '@/lib/router';
import NotFoundPage from '@/pages/NotFoundPage';

export default function CategoryPage({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const catalog = getCatalog();
  const category = catalog.getCategory(slug);
  if (!category || category.is_active === false) {
    return <NotFoundPage />;
  }

  const filters = extractFilters(searchParams);
  const sort = (Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort) || 'new';
  const page = Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page) || 1;

  const products = catalog.productsForCategory(slug, filters, sort);
  const { items: paginated, pagination } = paginate(products, page, 12);
  const facets = catalog.facetsFor(products);
  const breadcrumbs = catalog.categoryPath(slug);

  return (
    <>
      <div className="bg-soft-cream">
        <div className="container space-y-4 py-6 lg:py-8">
          <div className="space-y-2">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold text-ebony">{category.name}</h1>
              <p className="text-sm text-ebony/65">{pagination.total} items</p>
            </div>
            <CategoryFilterDrawer filters={filters} facets={facets} />
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="container py-10 lg:py-14">
          {paginated.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((product) => (
                  <ProductCard key={product.slug} product={product} categoryLabel={catalog.getCategory(product.category_slug)?.label} />
                ))}
              </div>
              <div className="mt-10 flex items-center justify-center gap-3 text-sm text-ebony/70">
                {pagination.has_prev ? (
                  <Link className="rounded-full border border-cloud-gray/70 px-3 py-1.5 hover:border-ebony hover:text-ebony" href={`?page=${pagination.prev_page}&sort=${sort}`}>
                    Prev
                  </Link>
                ) : null}
                <span>Page {pagination.page} of {pagination.pages}</span>
                {pagination.has_next ? (
                  <Link className="rounded-full border border-cloud-gray/70 px-3 py-1.5 hover:border-ebony hover:text-ebony" href={`?page=${pagination.next_page}&sort=${sort}`}>
                    Next
                  </Link>
                ) : null}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-cloud-gray/70 bg-soft-cream p-10 text-center">
              <p className="text-lg font-semibold text-ebony">We are tailoring this edit</p>
              <p className="mt-2 text-sm text-ebony/70">Adjust filters or explore another category while we craft new arrivals.</p>
              <Link href="/" className="mt-4 inline-flex items-center gap-2 rounded-full border border-ebony px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ebony hover:bg-ebony hover:text-soft-cream">
                Continue exploring
              </Link>
            </div>
          )}
        </div>
      </div>


    </>
  );
}
