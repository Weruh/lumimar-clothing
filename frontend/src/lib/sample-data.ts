import { getCatalog, formatCurrency } from './catalog';

export function getSampleCart() {
  const catalog = getCatalog();
  const picks = catalog.bestSellers(3).slice(0, 2);
  const cartItems = picks.map((product, index) => {
    const quantity = index + 1;
    return {
      product,
      quantity,
      size: product.sizes?.[0] || null,
      color: product.colors?.[0]?.name || null,
      unit_price: product.price,
      total: Number((product.price * quantity).toFixed(2)),
    };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = 0;
  const grand_total = subtotal + shipping;

  return {
    cartItems,
    totals: {
      subtotal,
      shipping,
      grand_total,
    },
  };
}

export function getSampleOrder() {
  const catalog = getCatalog();
  const items = catalog.bestSellers(3).slice(0, 3).map((product, index) => {
    const quantity = index === 0 ? 2 : 1;
    const total = product.price * quantity;
    return {
      title: product.title,
      quantity,
      total,
      image: product.hero_image,
      price_label: formatCurrency(total, product.currency || 'USD'),
    };
  });

  return {
    order_id: 'LMR-1047',
    placed_at: 'February 8, 2026',
    items,
  };
}

export function getAccountData() {
  const catalog = getCatalog();
  const wishlist = catalog.bestSellers(4).slice(0, 4);
  const recentProducts = catalog.newIn(4).slice(0, 4);

  const lastOrder = {
    order_id: 'LMR-1032',
    placed_at: 'February 2, 2026',
    items: wishlist.slice(0, 3).map((product) => ({
      title: product.title,
      quantity: 1,
      image: product.hero_image,
    })),
  };

  const addresses = [
    {
      label: 'Primary',
      recipient: 'Amaka Adeyemi',
      line1: '88 Riverside Drive',
      city: 'Nairobi',
      country: 'Kenya',
    },
    {
      label: 'Travel',
      recipient: 'Amaka Adeyemi',
      line1: '14 Crescent Lane',
      city: 'London',
      country: 'United Kingdom',
    },
  ];

  return {
    wishlist,
    recentProducts,
    lastOrder,
    addresses,
  };
}

export function getPolicyContent(slug: string) {
  const policies: Record<string, { title: string; label: string; intro: string; sections: { heading: string; body: string[]; ordered?: boolean }[] }> = {
    shipping: {
      title: 'Shipping policy',
      label: 'Stewardship',
      intro:
        'LUMIMAR partners with trusted logistics teams across Africa and the diaspora. Each parcel is insured door-to-door, with progress updates shared as soon as the atelier releases your piece.',
      sections: [
        {
          heading: 'Processing time',
          body: ['Orders are prepared within 24-48 hours, allowing our makers to complete final inspections and sustainable packaging.'],
        },
        {
          heading: 'Transit windows',
          body: ['Kenya and EAC: 2–4 business days.', 'UK, EU: 5–7 business days.', 'US and Canada: 7–10 business days.'],
        },
        {
          heading: 'Duties and taxes',
          body: ['Import duties may apply outside the EAC. We provide pro-forma invoices and support to smooth customs clearance.'],
        },
      ],
    },
    returns: {
      title: 'Returns and exchanges',
      label: 'Confidence',
      intro:
        'We design for commitment, not compulsion. If a piece does not honour your expectations, steward it back within 7 days of delivery for a full refund or exchange.',
      sections: [
        {
          heading: 'Eligibility',
          body: ['Pieces must remain unworn, unaltered, with original tags and packaging.', 'Footwear should be tried indoors on clean surfaces only.'],
        },
        {
          heading: 'Process',
          body: [
            'Email care@lumimar.africa with your order ID and intention (refund or exchange).',
            'Receive a prepaid label or pickup schedule where available.',
            'Refunds clear within 5-7 business days once inspected.',
          ],
          ordered: true,
        },
        {
          heading: 'Tailoring adjustments',
          body: ['Prefer an adjustment instead of a return? We coordinate with partnered ateliers in Nairobi, Accra, Lagos, and London to refine the fit.'],
        },
      ],
    },
    privacy: {
      title: 'Privacy commitment',
      label: 'Respect',
      intro:
        'Your data belongs to you. We collect only what is required to process orders, personalise fit guidance, and celebrate your wardrobe journey.',
      sections: [
        {
          heading: 'Data collected',
          body: [
            'Contact details for order confirmations and delivery.',
            'Measurements or fit notes you voluntarily share to refine recommendations.',
            'Site interactions, anonymised, to improve navigation and product discovery.',
          ],
        },
        {
          heading: 'Storage and security',
          body: ['Information lives on encrypted servers within the EU. Access is limited to trained stewards following strict confidentiality policies.'],
        },
        {
          heading: 'Your rights',
          body: ['Email privacy@lumimar.africa to request exports, edits, or deletion of your data. We respond within five business days.'],
        },
      ],
    },
    terms: {
      title: 'Terms of stewardship',
      label: 'Trust',
      intro:
        'LUMIMAR is a marketplace rooted in trust between artisans, curators, and clients. By ordering through our platform, you agree to the following principles.',
      sections: [
        {
          heading: 'Authenticity',
          body: ['Every piece is authenticated before shipping. Pricing reflects equitable pay for craft communities across Africa and the diaspora.'],
        },
        {
          heading: 'Usage',
          body: ['Content, imagery, and copy may not be reproduced without permission. We champion creators and respect their intellectual property.'],
        },
        {
          heading: 'Liability',
          body: ['We steward logistics carefully. In the rare event of delays or damage, our team will coordinate replacements or refunds promptly.'],
        },
        {
          heading: 'Governing law',
          body: ['Transactions are governed by Kenyan law with recognition of applicable international trade standards.'],
        },
      ],
    },
  };

  return policies[slug] || null;
}
