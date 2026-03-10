'use client';

import React from 'react';
import { useRouter } from '@/lib/router';

export function BackButton({
  label = 'Back',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-full border border-cloud-gray/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-ebony/60 transition hover:border-ebony hover:text-ebony ${className}`}
      aria-label="Go back"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
