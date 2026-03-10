'use client';

import { useEffect } from 'react';
import { useCart } from '@/components/CartProvider';

export function ClearCartOnMount({ enabled = true }: { enabled?: boolean }) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (!enabled) return;
    clearCart();
  }, [clearCart, enabled]);

  return null;
}
