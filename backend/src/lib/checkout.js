const { ensureImage, getCatalog } = require('./catalog');

const MAX_ITEMS = 20;
const USD_TO_KES_RATE = 130;

function cleanText(value, maxLength, fieldName, required = true) {
  const cleaned = String(value ?? '').trim().replace(/\s+/g, ' ');
  if (!cleaned) {
    if (required) {
      throw new Error(`${fieldName} is required.`);
    }
    return '';
  }
  if (cleaned.length > maxLength) {
    throw new Error(`${fieldName} is too long.`);
  }
  return cleaned;
}

function cleanEmail(value) {
  const email = cleanText(value, 120, 'Email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email is invalid.');
  }
  return email;
}

function cleanQuantity(value) {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    throw new Error('Quantity must be between 1 and 20.');
  }
  return quantity;
}

function sanitizeCustomerInput(input) {
  return {
    fullName: cleanText(input && input.fullName, 100, 'Full name'),
    email: cleanEmail(input && input.email),
    phone: cleanText(input && input.phone, 40, 'Phone'),
    mpesa: cleanText(input && input.mpesa, 40, 'Mpesa number', false) || null,
    address: cleanText(input && input.address, 160, 'Address'),
    city: cleanText(input && input.city, 80, 'City'),
    country: cleanText(input && input.country, 80, 'Country'),
    postal: cleanText(input && input.postal, 32, 'Postal code', false) || null,
    notes: cleanText(input && input.notes, 500, 'Notes', false) || null,
  };
}

function sanitizeCheckoutItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Your cart is empty.');
  }
  if (items.length > MAX_ITEMS) {
    throw new Error(`Cart cannot contain more than ${MAX_ITEMS} line items.`);
  }

  return items.map((item) => ({
    slug: cleanText(item && item.slug, 120, 'Product slug'),
    quantity: cleanQuantity(item && item.quantity),
    size: cleanText(item && item.size, 60, 'Size', false) || null,
    color: cleanText(item && item.color, 60, 'Color', false) || null,
  }));
}

function buildPricedItems(requestedItems, currency) {
  const catalog = getCatalog();

  return requestedItems.map((item) => {
    const product = catalog.productsBySlug.get(item.slug);
    if (!product) {
      throw new Error(`Product "${item.slug}" was not found.`);
    }

    if (item.size && product.sizes.length && !product.sizes.includes(item.size)) {
      throw new Error(`Selected size is unavailable for "${product.title}".`);
    }

    if (item.color && product.colors.length && !product.colors.some((color) => color.name === item.color)) {
      throw new Error(`Selected color is unavailable for "${product.title}".`);
    }

    const sourceCurrency = product.currency || 'USD';
    const unitPrice = convertAmount(product.price, sourceCurrency, currency);
    const lineTotal = roundMoney(unitPrice * item.quantity);

    return {
      slug: product.slug,
      sku: product.sku,
      title: product.title,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      unitPrice,
      lineTotal,
      image: ensureImage(product.hero_image),
    };
  });
}

function createOrderReference() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `LMR-${Date.now()}-${random}`;
}

function toMinorUnits(amount) {
  return Math.round(amount * 100);
}

function roundMoney(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function convertAmount(amount, fromCurrency, toCurrency) {
  const sourceCurrency = String(fromCurrency || 'USD').trim().toUpperCase();
  const targetCurrency = String(toCurrency || sourceCurrency).trim().toUpperCase();
  const numericAmount = Number(amount || 0);

  if (sourceCurrency === targetCurrency) {
    return roundMoney(numericAmount);
  }

  if (sourceCurrency === 'USD' && targetCurrency === 'KES') {
    return roundMoney(numericAmount * USD_TO_KES_RATE);
  }

  if (sourceCurrency === 'KES' && targetCurrency === 'USD') {
    return roundMoney(numericAmount / USD_TO_KES_RATE);
  }

  return roundMoney(numericAmount);
}

function buildCheckoutOrder(payload) {
  const customer = sanitizeCustomerInput(payload.customer || {});
  const requestedItems = sanitizeCheckoutItems(payload.items || []);
  const currency = cleanText(process.env.PAYSTACK_CURRENCY || 'KES', 8, 'Currency');
  const items = buildPricedItems(requestedItems, currency);

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = 0;
  const grandTotal = roundMoney(subtotal + shipping);

  if (grandTotal <= 0) {
    throw new Error('Order total must be greater than zero.');
  }

  return {
    reference: payload.reference || createOrderReference(),
    currency,
    customer,
    items,
    subtotal,
    shipping,
    grandTotal,
  };
}

function buildCheckoutQuote(payload) {
  const requestedItems = sanitizeCheckoutItems(payload.items || []);
  const currency = cleanText(process.env.PAYSTACK_CURRENCY || 'KES', 8, 'Currency');
  const items = buildPricedItems(requestedItems, currency);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = 0;
  const grandTotal = roundMoney(subtotal + shipping);

  if (grandTotal <= 0) {
    throw new Error('Order total must be greater than zero.');
  }

  return {
    currency,
    items: items.map((item) => ({
      slug: item.slug,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
    subtotal,
    shipping,
    grandTotal,
  };
}

function compactOrderForMetadata(order) {
  return {
    reference: order.reference,
    currency: order.currency,
    subtotal: order.subtotal,
    shipping: order.shipping,
    grandTotal: order.grandTotal,
    customer: order.customer,
    items: order.items.map((item) => ({
      slug: item.slug,
      sku: item.sku,
      title: item.title,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
  };
}

function formatOrderAddress(customer) {
  return [customer.address, customer.city, customer.postal, customer.country].filter(Boolean).join(', ');
}

module.exports = {
  buildCheckoutQuote,
  buildCheckoutOrder,
  compactOrderForMetadata,
  formatOrderAddress,
  toMinorUnits,
};
