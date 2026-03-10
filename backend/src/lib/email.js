const { formatCurrency } = require('./catalog');
const { formatOrderAddress } = require('./checkout');

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.');
  if (!from) throw new Error('RESEND_FROM_EMAIL is not configured.');
  if (!to) throw new Error('ORDER_NOTIFICATION_EMAIL is not configured.');

  return { apiKey, from, to };
}

function renderOrderLines(order) {
  return order.items
    .map((item) => {
      const options = [item.size ? `Size: ${item.size}` : null, item.color ? `Color: ${item.color}` : null]
        .filter(Boolean)
        .join(' | ');
      const optionSuffix = options ? ` (${options})` : '';
      return `<li><strong>${item.title}</strong>${optionSuffix} - Qty ${item.quantity} - ${formatCurrency(item.lineTotal, order.currency)}</li>`;
    })
    .join('');
}

async function sendOwnerOrderEmail(order, payment) {
  const { apiKey, from, to } = getEmailConfig();
  const total = payment.amountMinor / 100;
  const subject = `Paid order ${payment.reference} from ${order.customer.fullName}`;
  const address = formatOrderAddress(order.customer);

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 8px;">New paid order</h2>
      <p style="margin-top: 0;">Reference: <strong>${payment.reference}</strong></p>
      <h3>Customer</h3>
      <p>
        ${order.customer.fullName}<br />
        Email: ${order.customer.email}<br />
        Phone: ${order.customer.phone}<br />
        Mpesa: ${order.customer.mpesa || 'Not provided'}<br />
        Address: ${address}
      </p>
      <h3>Products</h3>
      <ul>${renderOrderLines(order)}</ul>
      <h3>Payment</h3>
      <p>
        Total paid: <strong>${formatCurrency(total, payment.currency)}</strong><br />
        Channel: ${payment.channel || 'Unknown'}<br />
        Paid at: ${payment.paidAt || 'Not supplied by Paystack'}
      </p>
      <h3>Notes</h3>
      <p>${order.customer.notes || 'No customer notes.'}</p>
    </div>
  `;

  const textLines = [
    'New paid order',
    `Reference: ${payment.reference}`,
    '',
    'Customer',
    `${order.customer.fullName}`,
    `Email: ${order.customer.email}`,
    `Phone: ${order.customer.phone}`,
    `Mpesa: ${order.customer.mpesa || 'Not provided'}`,
    `Address: ${address}`,
    '',
    'Products',
    ...order.items.map((item) => {
      const options = [item.size ? `Size: ${item.size}` : null, item.color ? `Color: ${item.color}` : null]
        .filter(Boolean)
        .join(' | ');
      const optionSuffix = options ? ` (${options})` : '';
      return `- ${item.title}${optionSuffix} | Qty ${item.quantity} | ${formatCurrency(item.lineTotal, order.currency)}`;
    }),
    '',
    'Payment',
    `Total paid: ${formatCurrency(total, payment.currency)}`,
    `Channel: ${payment.channel || 'Unknown'}`,
    `Paid at: ${payment.paidAt || 'Not supplied by Paystack'}`,
    '',
    'Notes',
    order.customer.notes || 'No customer notes.',
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: order.customer.email,
      subject,
      html,
      text: textLines,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send owner email: ${errorText}`);
  }
}

module.exports = {
  sendOwnerOrderEmail,
};
