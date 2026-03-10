const http = require('node:http');
const crypto = require('node:crypto');
const { loadBackendEnv } = require('./src/lib/load-env');
const { buildCheckoutOrder, buildCheckoutQuote, compactOrderForMetadata, toMinorUnits } = require('./src/lib/checkout');
const { sendOwnerOrderEmail } = require('./src/lib/email');
const { initializePaystackTransaction, verifyPaystackTransaction } = require('./src/lib/paystack');
const { getFrontendAppUrl } = require('./src/lib/runtime');

const envStatus = loadBackendEnv();
const PORT = Number(process.env.PORT || 4000);
const notifiedReferences = new Set();

function getMissingEnvVars() {
  const requiredForCheckout = ['PAYSTACK_SECRET_KEY'];
  const requiredForNotifications = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'ORDER_NOTIFICATION_EMAIL'];

  return {
    checkout: requiredForCheckout.filter((key) => !process.env[key]),
    notifications: requiredForNotifications.filter((key) => !process.env[key]),
  };
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-paystack-signature');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function verifySignature(rawBody, signature, secretKey) {
  if (!signature) return false;
  const expected = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

function readOrderFromMetadata(metadata) {
  const order = metadata && metadata.order;
  if (!order || typeof order !== 'object') {
    throw new Error('Order metadata is missing from the Paystack payload.');
  }
  return order;
}

function validateVerifiedTransaction(transaction, order) {
  if (transaction.status !== 'success') {
    throw new Error('Payment has not been completed.');
  }

  if (transaction.amount !== toMinorUnits(order.grandTotal)) {
    throw new Error('Verified Paystack amount does not match the order total.');
  }

  const verifiedEmail = ((transaction.customer && transaction.customer.email) || '').toLowerCase();
  if (verifiedEmail !== order.customer.email.toLowerCase()) {
    throw new Error('Verified Paystack email does not match the order email.');
  }
}

async function notifyOwnerOfPaidOrder(transaction) {
  const order = readOrderFromMetadata(transaction.metadata);
  validateVerifiedTransaction(transaction, order);

  const alreadyNotified = notifiedReferences.has(transaction.reference);
  if (!alreadyNotified) {
    await sendOwnerOrderEmail(order, {
      reference: transaction.reference,
      paidAt: transaction.paid_at || null,
      channel: transaction.channel || null,
      amountMinor: transaction.amount,
      currency: transaction.currency || order.currency,
    });

    notifiedReferences.add(transaction.reference);
  }

  return {
    alreadyNotified,
    order,
  };
}

async function handleCheckoutInitialize(req, res) {
  try {
    const rawBody = await readBody(req);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const order = buildCheckoutOrder({
      customer: body.customer,
      items: body.items,
    });

    const transaction = await initializePaystackTransaction({
      email: order.customer.email,
      amount: toMinorUnits(order.grandTotal),
      currency: order.currency,
      reference: order.reference,
      callbackUrl: `${getFrontendAppUrl()}/checkout/success`,
      metadata: {
        order: compactOrderForMetadata(order),
      },
    });

    sendJson(res, 200, {
      authorizationUrl: transaction.authorization_url,
      reference: transaction.reference,
    });
  } catch (error) {
    sendJson(res, 400, {
      error: error instanceof Error ? error.message : 'Unable to initialize checkout.',
    });
  }
}

async function handleCheckoutQuote(req, res) {
  try {
    const rawBody = await readBody(req);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const quote = buildCheckoutQuote({
      items: body.items,
    });

    sendJson(res, 200, quote);
  } catch (error) {
    sendJson(res, 400, {
      error: error instanceof Error ? error.message : 'Unable to calculate checkout total.',
    });
  }
}

async function handlePaystackWebhook(req, res) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    sendJson(res, 500, { error: 'PAYSTACK_SECRET_KEY is not configured.' });
    return;
  }

  try {
    const rawBody = await readBody(req);
    const signature = req.headers['x-paystack-signature'] || null;

    if (!verifySignature(rawBody, signature, secretKey)) {
      sendJson(res, 401, { error: 'Invalid Paystack signature.' });
      return;
    }

    const event = JSON.parse(rawBody);
    if (event.event !== 'charge.success' || !event.data || !event.data.reference) {
      sendJson(res, 200, { received: true });
      return;
    }

    const transaction = await verifyPaystackTransaction(event.data.reference);
    if (transaction.status !== 'success') {
      sendJson(res, 200, { received: true });
      return;
    }

    await notifyOwnerOfPaidOrder(transaction);

    sendJson(res, 200, { received: true });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Webhook processing failed.',
    });
  }
}

async function handleCheckoutVerify(req, res) {
  try {
    const rawBody = await readBody(req);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const reference = String(body.reference || '').trim();

    if (!reference) {
      throw new Error('Payment reference is required.');
    }

    const transaction = await verifyPaystackTransaction(reference);
    const { alreadyNotified } = await notifyOwnerOfPaidOrder(transaction);

    sendJson(res, 200, {
      ok: true,
      reference: transaction.reference,
      status: transaction.status,
      notification: alreadyNotified ? 'already_sent' : 'sent',
    });
  } catch (error) {
    sendJson(res, 400, {
      error: error instanceof Error ? error.message : 'Unable to verify checkout payment.',
    });
  }
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/checkout/initialize') {
    await handleCheckoutInitialize(req, res);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/checkout/quote') {
    await handleCheckoutQuote(req, res);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/checkout/verify') {
    await handleCheckoutVerify(req, res);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/paystack/webhook') {
    await handlePaystackWebhook(req, res);
    return;
  }

  sendJson(res, 404, { error: 'Route not found.' });
});

server.listen(PORT, () => {
  const missing = getMissingEnvVars();

  if (envStatus.loaded) {
    console.log(`Loaded environment from ${envStatus.path}`);
  } else {
    console.warn(`No .env file found at ${envStatus.path}. Falling back to existing process environment.`);
  }

  if (missing.checkout.length > 0) {
    console.warn(`Checkout is not fully configured. Missing: ${missing.checkout.join(', ')}`);
  }

  if (missing.notifications.length > 0) {
    console.warn(`Order email notifications are not fully configured. Missing: ${missing.notifications.join(', ')}`);
  }

  console.log(`Backend listening on http://localhost:${PORT}`);
});
