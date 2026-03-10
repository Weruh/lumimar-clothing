import React from 'react';
import { ensureImage, formatCurrency, Product } from '@/lib/catalog';
import { BadgeRow } from './BadgeRow';
import { Link } from '@/lib/router';

export function ProductCard({
  product,
  categoryLabel,
}: {
  product: Product;
  categoryLabel?: string | null;
}) {
  const mainImage = ensureImage(product.hero_image || product.gallery?.[0]?.src);
  const hoverImage = product.hover_image || product.gallery?.[1]?.src;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-cloud-gray/20">
          <img
            src={mainImage}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:opacity-0"
          />
          {hoverImage ? (
            <img
              src={hoverImage}
              alt={`${product.title} alternate view`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-300 group-hover:opacity-100"
            />
          ) : null}
        </div>
        {product.badges && product.badges.length > 0 ? (
          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1">
            <BadgeRow badges={product.badges} />
          </div>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2">
          {categoryLabel ? (
            <p className="text-[11px] uppercase tracking-[0.25em] text-ebony/50">{categoryLabel}</p>
          ) : null}
          <Link href={`/product/${product.slug}`} className="block text-sm font-semibold text-ebony hover:underline">
            {product.title || 'Product'}
          </Link>
          <p className="text-xs text-ebony/60">{product.short_description || product.subtitle}</p>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm font-semibold text-ebony">
          <span>{formatCurrency(product.price, product.currency || 'USD')}</span>
          {product.compare_at_price ? (
            <span className="text-xs font-semibold text-rose-600 line-through">
              {formatCurrency(product.compare_at_price, product.currency || 'USD')}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
