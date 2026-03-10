import React from 'react';
import { Link } from '@/lib/router';

export default function NotFoundPage() {
  return (
    <section className="bg-soft-cream">
      <div className="container py-16">
        <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">Not found</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold text-ebony">This page is not in the current collection</h1>
          <p className="mt-3 text-sm text-ebony/70">
            The requested route does not exist in the new React frontend.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border border-ebony px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ebony hover:bg-ebony hover:text-soft-cream"
          >
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
