const seedData = require('../data/seed.json');

let catalogInstance = null;

function normalizeCurrency(currency) {
  return String(currency || 'USD').trim().toUpperCase();
}

function normalizeProduct(product) {
  return {
    ...product,
    compare_at_price: product.compare_at_price ?? null,
    currency: product.currency || 'USD',
    badges: product.badges || [],
    rating: product.rating || 0,
    review_count: product.review_count || 0,
    colors: product.colors || [],
    sizes: product.sizes || [],
    gallery: product.gallery || [],
    short_description: product.short_description || '',
    subtitle: product.subtitle || '',
    care: product.care || [],
    shipping_notes: product.shipping_notes || [],
    complete_the_look: product.complete_the_look || [],
  };
}

function createCatalog() {
  const products = Array.isArray(seedData.products) ? seedData.products.map(normalizeProduct) : [];
  const productsBySlug = new Map(products.map((product) => [product.slug, product]));
  return { products, productsBySlug };
}

function getCatalog() {
  if (!catalogInstance) {
    catalogInstance = createCatalog();
  }
  return catalogInstance;
}

function ensureImage(src) {
  return src || '/static/img/blank.png';
}

function formatCurrency(value, currency = 'USD') {
  const number = Number(value || 0);
  const normalizedCurrency = normalizeCurrency(currency);
  const locale = normalizedCurrency === 'KES' ? 'en-KE' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: normalizedCurrency }).format(number);
}

module.exports = {
  ensureImage,
  formatCurrency,
  getCatalog,
};
