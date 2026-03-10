import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type RouterContextValue = {
  pathname: string;
  search: string;
  hash: string;
  searchParams: URLSearchParams;
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

function readLocation() {
  if (typeof window === 'undefined') {
    return {
      pathname: '/',
      search: '',
      hash: '',
      searchParams: new URLSearchParams(),
    };
  }

  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    searchParams: new URLSearchParams(window.location.search),
  };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (href: string, replace = false) => {
    if (typeof window === 'undefined') return;
    const nextUrl = new URL(href, window.location.origin);
    const nextHref = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    if (replace) {
      window.history.replaceState({}, '', nextHref);
    } else {
      window.history.pushState({}, '', nextHref);
    }
    window.scrollTo({ top: 0, left: 0 });
    setLocation(readLocation());
  };

  const value = useMemo<RouterContextValue>(
    () => ({
      ...location,
      push: (href) => navigate(href, false),
      replace: (href) => navigate(href, true),
      back: () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          window.history.back();
        } else {
          navigate('/', false);
        }
      },
    }),
    [location]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouteLocation() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouteLocation must be used within a RouterProvider');
  }
  return ctx;
}

export function useRouter() {
  const { push, replace, back } = useRouteLocation();
  return { push, replace, back };
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export function Link({ href, onClick, target, rel, ...props }: LinkProps) {
  const { push } = useRouteLocation();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      target === '_blank' ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const isExternal = /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
    if (isExternal) {
      return;
    }

    event.preventDefault();
    push(href);
  };

  return <a href={href} onClick={handleClick} target={target} rel={rel} {...props} />;
}
