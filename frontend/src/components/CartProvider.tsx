'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCatalog } from '@/lib/catalog';

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image?: string | null;
  size?: string | null;
  color?: string | null;
};

export type CartTotals = {
  subtotal: number;
  shipping: number;
  grand_total: number;
};

type CartContextValue = {
  items: CartItem[];
  totals: CartTotals;
  addItem: (item: CartItem) => void;
  updateItemQuantity: (item: Pick<CartItem, 'slug' | 'size' | 'color'>, quantity: number) => void;
  removeItem: (item: Pick<CartItem, 'slug' | 'size' | 'color'>) => void;
  clearCart: () => void;
};

const CART_KEY = 'lumimar_cart_v1';

const CartContext = createContext<CartContextValue | null>(null);

export const cartItemKey = (item: Pick<CartItem, 'slug' | 'size' | 'color'>) =>
  `${item.slug}::${item.size ?? ''}::${item.color ?? ''}`;

const sanitizeItems = (items: CartItem[]) => {
  const catalog = getCatalog();

  return items
    .map((item) => {
      const product = catalog.productsBySlug.get(item.slug);
      const fallbackPrice = Number(item.price) || 0;

      return {
        ...item,
        title: product?.title || item.title,
        price: product?.price ?? fallbackPrice,
        image: product?.hero_image || item.image || null,
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
      };
    })
    .filter((item) => item.slug && item.title);
};

const loadCart = () => {
  if (typeof window === 'undefined') return [] as CartItem[];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as { items?: CartItem[] } | null;
    if (!data || !Array.isArray(data.items)) return [];
    return sanitizeItems(data.items);
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify({ items }));
  } catch {
    // Ignore storage errors (private mode, quota, etc.).
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(items);
  }, [items, hydrated]);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 0 : 0;
    return {
      subtotal,
      shipping,
      grand_total: subtotal + shipping,
    };
  }, [items]);

  const addItem = (next: CartItem) => {
    setItems((prev) => {
      const key = cartItemKey(next);
      const existingIndex = prev.findIndex((item) => cartItemKey(item) === key);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const current = updated[existingIndex];
        updated[existingIndex] = {
          ...current,
          quantity: current.quantity + (next.quantity || 1),
        };
        return updated;
      }
      return [...prev, { ...next, quantity: next.quantity || 1 }];
    });
  };

  const updateItemQuantity = (target: Pick<CartItem, 'slug' | 'size' | 'color'>, quantity: number) => {
    setItems((prev) => {
      const key = cartItemKey(target);
      if (quantity <= 0 || Number.isNaN(quantity)) {
        return prev.filter((item) => cartItemKey(item) !== key);
      }
      return prev.map((item) =>
        cartItemKey(item) === key ? { ...item, quantity } : item
      );
    });
  };

  const removeItem = (target: Pick<CartItem, 'slug' | 'size' | 'color'>) => {
    setItems((prev) => prev.filter((item) => cartItemKey(item) !== cartItemKey(target)));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({
      items,
      totals,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
    }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
