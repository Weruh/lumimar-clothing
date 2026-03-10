const LOCAL_API_BASE_URL = 'http://localhost:4000';
const DEFAULT_PRODUCTION_API_BASE_URL = 'https://lumimar-backend.onrender.com';

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, '');
}

function isLocalHostname(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) {
    return trimTrailingSlashes(configured);
  }

  if (typeof window !== 'undefined' && isLocalHostname(window.location.hostname)) {
    return LOCAL_API_BASE_URL;
  }

  return DEFAULT_PRODUCTION_API_BASE_URL;
}
