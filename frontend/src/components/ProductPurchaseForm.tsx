'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/lib/catalog';
import { useCart } from '@/components/CartProvider';
import { useRouter } from '@/lib/router';

function expandSizeOption(sizeOption: string) {
  const normalized = String(sizeOption || '').trim();
  const numericRangeMatch = normalized.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!numericRangeMatch) {
    return normalized ? [normalized] : [];
  }

  const start = Number(numericRangeMatch[1]);
  const end = Number(numericRangeMatch[2]);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return normalized ? [normalized] : [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => String(start + index));
}

export function ProductPurchaseForm({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const rawSizeOptions = useMemo(
    () => ((product.quick_sizes || []).length > 0 ? product.quick_sizes || [] : product.sizes || []),
    [product.quick_sizes, product.sizes]
  );
  const sizeOptions = useMemo(
    () => rawSizeOptions.flatMap((sizeOption) => expandSizeOption(sizeOption)),
    [rawSizeOptions]
  );
  const hasSizes = sizeOptions.length > 0;
  const hasColors = (product.colors || []).length > 0;

  const defaultSize = hasSizes ? sizeOptions[0] || '' : '';
  const defaultColor = hasColors ? product.colors?.[0]?.name || '' : '';

  const [size, setSize] = useState(defaultSize);
  const [color, setColor] = useState(defaultColor);
  const [quantity, setQuantity] = useState(1);
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);
  const sizeMenuRef = useRef<HTMLDivElement | null>(null);

  const safeQuantity = useMemo(() => (Number.isNaN(quantity) || quantity < 1 ? 1 : quantity), [quantity]);

  useEffect(() => {
    setSize(defaultSize);
    setColor(defaultColor);
    setQuantity(1);
    setSizeMenuOpen(false);
  }, [product.slug, defaultSize, defaultColor]);

  useEffect(() => {
    if (!sizeMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!sizeMenuRef.current?.contains(event.target as Node)) {
        setSizeMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSizeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [sizeMenuOpen]);

  const addToCart = (nextQuantity: number) => {
    addItem({
      slug: product.slug,
      title: product.title || 'Product',
      price: product.price || 0,
      quantity: nextQuantity,
      image: product.hero_image,
      size: size || null,
      color: color || null,
    });
  };

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    addToCart(safeQuantity);
  };

  const handleBuyNow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addToCart(safeQuantity);
    router.push('/checkout');
  };

  return (
    <form onSubmit={handleAdd} className="rounded-3xl bg-white p-6 shadow-soft space-y-5">
      {hasSizes ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ebony/50">Select size</p>
          <div ref={sizeMenuRef} className="relative mt-3">
            <input type="hidden" name="size" value={size} />
            <button
              type="button"
              onClick={() => setSizeMenuOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-2xl border border-cloud-gray/70 bg-white px-4 py-3 text-sm font-medium text-ebony transition hover:border-ebony focus:border-ebony focus:outline-none"
              aria-expanded={sizeMenuOpen}
              aria-haspopup="listbox"
            >
              <span>{size}</span>
              <svg
                className={`h-4 w-4 text-ebony/60 transition ${sizeMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {sizeMenuOpen ? (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-cloud-gray/70 bg-white shadow-soft">
                <ul role="listbox" aria-label="Select size" className="max-h-60 overflow-y-auto py-2">
                  {sizeOptions.map((sizeOption) => (
                    <li key={sizeOption}>
                      <button
                        type="button"
                        onClick={() => {
                          setSize(sizeOption);
                          setSizeMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-cloud-gray/40 ${
                          size === sizeOption ? 'bg-ebony text-soft-cream hover:bg-ebony' : 'text-ebony'
                        }`}
                        role="option"
                        aria-selected={size === sizeOption}
                      >
                        <span>{sizeOption}</span>
                        {size === sizeOption ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                          </svg>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {hasColors ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ebony/50">Colorway</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {(product.colors || []).map((colorOption) => (
              <label key={colorOption.name} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="color"
                  value={colorOption.name}
                  className="peer sr-only"
                  checked={color === colorOption.name}
                  onChange={() => setColor(colorOption.name)}
                  aria-checked={color === colorOption.name}
                />
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-cloud-gray/70 peer-checked:border-ebony">
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: colorOption.hex }}></span>
                </span>
                <span className="text-sm text-ebony/70">{colorOption.name}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="flex items-center gap-2 rounded-full border border-cloud-gray/70 px-3 py-1.5 text-xs text-ebony/70 focus-within:border-ebony">
          <span>Qty</span>
          <input
            type="number"
            min={1}
            name="quantity"
            value={safeQuantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="w-12 border-none bg-transparent text-center text-sm font-medium text-ebony focus:outline-none focus:ring-0"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-ebony px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-soft-cream hover:bg-deep-gold hover:text-ebony"
        >
          Add to cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="rounded-full border border-ebony px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-ebony hover:bg-ebony hover:text-soft-cream"
        >
          Buy now
        </button>
      </div>
      <p className="text-xs text-ebony/60">Investment reinforcement: Good choice, this piece holds up wash after wash.</p>
    </form>
  );
}
