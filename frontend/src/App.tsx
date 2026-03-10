import React, { useEffect } from 'react';
import { CartProvider } from '@/components/CartProvider';
import { Shell } from '@/components/Shell';
import { getCatalog } from '@/lib/catalog';
import { RouterProvider, useRouteLocation } from '@/lib/router';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import ProductPage from '@/pages/ProductPage';
import SearchPage from '@/pages/SearchPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import AccountPage from '@/pages/AccountPage';
import PolicyPage from '@/pages/PolicyPage';
import NotFoundPage from '@/pages/NotFoundPage';

type SearchParamValue = string | string[] | undefined;

function toSearchParamsRecord(searchParams: URLSearchParams): Record<string, SearchParamValue> {
  const result: Record<string, SearchParamValue> = {};

  searchParams.forEach((value, key) => {
    const current = result[key];
    if (current === undefined) {
      result[key] = value;
      return;
    }
    if (Array.isArray(current)) {
      current.push(value);
      return;
    }
    result[key] = [current, value];
  });

  return result;
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function RoutedApp() {
  const catalog = getCatalog();
  const { pathname, searchParams } = useRouteLocation();
  const normalizedPath = normalizePath(pathname);
  const searchParamRecord = toSearchParamsRecord(searchParams);
  const segments = normalizedPath.split('/').filter(Boolean);

  useEffect(() => {
    document.title = 'LUMIMAR';
  }, [normalizedPath]);

  let content: React.ReactNode;

  if (normalizedPath === '/') {
    content = <HomePage />;
  } else if (normalizedPath === '/cart') {
    content = <CartPage />;
  } else if (normalizedPath === '/checkout') {
    content = <CheckoutPage />;
  } else if (normalizedPath === '/checkout/success') {
    content = <CheckoutSuccessPage searchParams={searchParamRecord} />;
  } else if (normalizedPath === '/account') {
    content = <AccountPage />;
  } else if (normalizedPath === '/search') {
    content = <SearchPage searchParams={searchParamRecord} />;
  } else if (segments[0] === 'category' && segments[1]) {
    content = <CategoryPage slug={segments[1]} searchParams={searchParamRecord} />;
  } else if (segments[0] === 'product' && segments[1]) {
    content = <ProductPage slug={segments[1]} />;
  } else if (segments[0] === 'policy' && segments[1]) {
    content = <PolicyPage slug={segments[1]} />;
  } else {
    content = <NotFoundPage />;
  }

  return <Shell megaMenu={catalog.megaMenu}>{content}</Shell>;
}

export default function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <RoutedApp />
      </CartProvider>
    </RouterProvider>
  );
}
