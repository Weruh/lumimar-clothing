export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) {
    return configured.replace(/\/+$/, '');
  }
  return 'http://localhost:4000';
}
