import React from 'react';
import { Link } from '@/lib/router';
import type { Category } from '@/lib/catalog';

type Crumb = { label: string; slug?: string | null } | Category;

export function Breadcrumbs({
  breadcrumbs,
  currentLabel,
  homeLabel = 'Home',
}: {
  breadcrumbs: Crumb[];
  currentLabel?: string | null;
  homeLabel?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ebony/60">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-ebony">
            {homeLabel}
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => {
          const isCategory = (crumb as Category).slug !== undefined && (crumb as Category).name !== undefined;
          const label = isCategory ? (crumb as Category).label : (crumb as { label: string }).label;
          const slug = isCategory ? (crumb as Category).slug : (crumb as { slug?: string | null }).slug;

          return (
            <React.Fragment key={`${label}-${index}`}>
              <li aria-hidden="true">/</li>
              <li>
                {slug ? (
                  <Link href={`/category/${slug}`} className="hover:text-ebony">
                    {label}
                  </Link>
                ) : (
                  <span className="text-ebony/70">{label}</span>
                )}
              </li>
            </React.Fragment>
          );
        })}
        {currentLabel ? (
          <>
            <li aria-hidden="true">/</li>
            <li className="text-ebony">{currentLabel}</li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
