const PAYSTACK_BASE_URL = 'https://api.paystack.co';

function getPaystackSecretKey() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured.');
  }
  return secretKey;
}

async function paystackRequest(path, init) {
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Paystack request failed.');
  }

  return data;
}

async function initializePaystackTransaction(payload) {
  const response = await paystackRequest('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      amount: payload.amount,
      currency: payload.currency,
      reference: payload.reference,
      callback_url: payload.callbackUrl,
      metadata: payload.metadata,
    }),
  });

  if (!response.status || !response.data || !response.data.authorization_url) {
    throw new Error(response.message || 'Unable to initialize Paystack transaction.');
  }

  return response.data;
}

async function verifyPaystackTransaction(reference) {
  const response = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
  });

  if (!response.status || !response.data) {
    throw new Error(response.message || 'Unable to verify Paystack transaction.');
  }

  return response.data;
}

module.exports = {
  initializePaystackTransaction,
  verifyPaystackTransaction,
};
