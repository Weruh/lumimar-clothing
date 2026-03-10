'use client';

import React, { useMemo, useState } from 'react';
import type { Product } from '@/lib/catalog';
import { useCart } from '@/components/CartProvider';
import { useRouter } from '@/lib/router';

export function ProductPurchaseForm({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const hasSizes = (product.sizes || []).length > 0;
  const hasColors = (product.colors || []).length > 0;

  const defaultSize = hasSizes ? product.sizes?.[0] || '' : '';
  const defaultColor = hasColors ? product.colors?.[0]?.name || '' : '';

  const [size, setSize] = useState(defaultSize);
  const [color, setColor] = useState(defaultColor);
  const [quantity, setQuantity] = useState(1);

  const safeQuantity = useMemo(() => (Number.isNaN(quantity) || quantity < 1 ? 1 : quantity), [quantity]);

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
          <div className="mt-3 flex flex-wrap gap-2">
            {(product.sizes || []).map((sizeOption) => (
              <label key={sizeOption} className="group">
                <input
                  type="radio"
                  name="size"
                  value={sizeOption}
                  className="peer sr-only"
                  checked={size === sizeOption}
                  onChange={() => setSize(sizeOption)}
                  aria-checked={size === sizeOption}
                />
                <span className="inline-flex min-w-[3rem] justify-center rounded-full border border-cloud-gray/70 px-3 py-2 text-sm font-medium text-ebony/70 transition group-hover:border-ebony peer-checked:border-ebony peer-checked:bg-ebony peer-checked:text-soft-cream">
                  {sizeOption}
                </span>
              </label>
            ))}
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
