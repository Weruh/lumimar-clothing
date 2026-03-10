import React from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BackButton } from '@/components/BackButton';
import { ProductCard } from '@/components/ProductCard';
import { BadgeRow } from '@/components/BadgeRow';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductPurchaseForm } from '@/components/ProductPurchaseForm';
import { ensureImage, formatCurrency, getCatalog, savingsPercent } from '@/lib/catalog';
import NotFoundPage from '@/pages/NotFoundPage';

export default function ProductPage({ slug }: { slug: string }) {
  const catalog = getCatalog();
  const product = catalog.productsBySlug.get(slug);
  if (!product) {
    return <NotFoundPage />;
  }

  const breadcrumbs = catalog.categoryPath(product.category_slug);
  const heroSrc = product.hero_image || product.gallery?.[0]?.src || '/static/img/blank.png';
  const galleryImages = product.gallery || [];
  const percent = savingsPercent(product);

  const deliveryWindows = [
    { region: 'Kenya', estimate: 'Next-day delivery in Nairobi, 2 days upcountry' },
    { region: 'EAC', estimate: '3-5 business days' },
    { region: 'UK and EU', estimate: '5-7 business days' },
    { region: 'US', estimate: '7-10 business days' },
  ];

  const recommendations = catalog.getProductsBySlugs(product.complete_the_look || []);
  if (recommendations.length < 4) {
    const supplemental = catalog
      .bestSellers(8)
      .filter((candidate) => candidate.slug !== product.slug && !recommendations.find((item) => item.slug === candidate.slug));
    recommendations.push(...supplemental.slice(0, 4 - recommendations.length));
  }

  const reviews = [
    {
      author: 'Ama K.',
      location: 'Accra, Ghana',
      rating: 5,
      title: 'Elegant and enduring',
      body: 'The drape is impeccable and the seams are reinforced. After three wears and a gentle wash, the fabric still feels new.',
      images: product.gallery?.slice(0, 1) || [],
      date: '2 weeks ago',
    },
    {
      author: 'Halima Y.',
      location: 'Mombasa, Kenya',
      rating: 4,
      title: 'Comfortable with polish',
      body: 'I wore this through a coastal wedding weekend. Breathable lining, no pulling at the waist, and pockets that actually fit my phone.',
      images: [],
      date: '1 month ago',
    },
    {
      author: 'Nia L.',
      location: 'London, UK',
      rating: 5,
      title: 'Investment piece',
      body: 'The craftsmanship rivals my Italian pieces. Paired it with Lumimar heels and felt grounded all night.',
      images: product.gallery?.slice(1, 2) || [],
      date: '6 weeks ago',
    },
  ];

  const socialProof = {
    average: product.rating || 0,
    count: product.review_count || 0,
    badges: product.badges || [],
  };

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title || 'Product',
    image: galleryImages.map((media) => media.src),
    description: product.short_description || product.subtitle || 'Lumimar piece',
    sku: product.sku || 'SKU-PLACEHOLDER',
    brand: { '@type': 'Brand', name: 'LUMIMAR' },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency || 'USD',
      price: product.price || 0.0,
      availability: product.stock && product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `/product/${product.slug}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 0,
      reviewCount: product.review_count || 0,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="bg-soft-cream">
        <div className="container space-y-6 py-8 lg:py-12">
          <div className="space-y-2">
            <Breadcrumbs breadcrumbs={breadcrumbs} currentLabel={product.title} />
            <BackButton />
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <ProductGallery gallery={galleryImages} heroSrc={heroSrc} title={product.title} />
            <div className="space-y-6">
              <div className="space-y-3 rounded-3xl bg-white p-6 shadow-soft">
                <h1 className="font-heading text-3xl font-semibold text-ebony flex items-start gap-2">
                  <span>{product.title || 'Product'}</span>
                  {product.badges?.length ? <span className="flex flex-wrap gap-2"><BadgeRow badges={product.badges} /></span> : null}
                </h1>
                <p className="text-sm text-ebony/70">{product.short_description || product.subtitle}</p>
                <div className="flex items-center gap-3 text-lg font-semibold text-ebony">
                  <span>{formatCurrency(product.price, product.currency || 'USD')}</span>
                  {product.compare_at_price ? (
                    <span className="text-sm text-rose-600 line-through">{formatCurrency(product.compare_at_price, product.currency || 'USD')}</span>
                  ) : null}
                  {percent ? (
                    <span className="text-xs rounded-full bg-rose-500/15 px-2 py-1 text-rose-600">-{percent}%</span>
                  ) : null}
                </div>
              </div>
              <ProductPurchaseForm product={product} />
              <div className="rounded-3xl bg-white p-6 shadow-soft space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">Delivery estimator</p>
                  <ul className="mt-2 space-y-2 text-sm text-ebony/70">
                    {deliveryWindows.map((window) => (
                      <li key={window.region} className="flex items-center justify-between rounded-2xl border border-cloud-gray/60 px-4 py-2">
                        <span>{window.region}</span>
                        <span>{window.estimate}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">Care + return</p>
                  <ul className="mt-2 space-y-2 text-sm text-ebony/70">
                    {(product.care || []).map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-deep-gold"></span>
                        <span>{note}</span>
                      </li>
                    ))}
                    {(product.shipping_notes || []).map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-deep-gold"></span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">Origin</p>
                  <p className="text-sm text-ebony/70">{product.origin}</p>
                </div>
              </div>
            </div>
          </div>

          <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-ebony/50">Social proof</p>
              <p className="text-3xl font-semibold text-ebony">{socialProof.average} / 5</p>
              <form action="#" method="post" className="text-sm text-ebony/70 space-y-3">
                <p>Share a stewardship note:</p>
                <textarea rows={3} className="w-full rounded-2xl border border-cloud-gray/70 px-4 py-3 focus:border-deep-gold focus:ring-deep-gold" placeholder="How does this piece honour your wardrobe?"></textarea>
                <button type="submit" className="rounded-full border border-ebony px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ebony hover:bg-ebony hover:text-soft-cream">
                  Submit reflection
                </button>
              </form>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <article key={review.title} className="rounded-3xl border border-cloud-gray/60 bg-white p-6 shadow-soft">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-ebony">{review.author}</p>
                      <p className="text-xs text-ebony/50">{review.location}</p>
                    </div>
                    <span className="text-xs text-ebony/60">{review.date}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-sm text-deep-gold">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <svg key={index} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.105 3.397a1 1 0 00.95.69h3.577c.969 0 1.371 1.24.588 1.81l-2.894 2.102a1 1 0 00-.364 1.118l1.105 3.397c.3.921-.755 1.688-1.54 1.118l-2.894-2.102a1 1 0 00-1.176 0l-2.894 2.102c-.784.57-1.838-.197-1.539-1.118l1.104-3.397a1 1 0 00-.364-1.118L2.83 8.824c-.783-.57-.38-1.81.588-1.81h3.576a1 1 0 00.951-.69l1.104-3.397z" />
                      </svg>
                    ))}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-ebony">{review.title}</h3>
                  <p className="mt-2 text-sm text-ebony/70">{review.body}</p>
                  {review.images?.length ? (
                    <div className="mt-3 flex gap-3">
                      {review.images.map((image, index) => (
                        <img key={index} src={ensureImage(image.src)} alt={image.alt || product.title} className="h-20 w-20 rounded-xl object-cover" />
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-cloud-gray/60 pt-12">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-ebony/50">Complete the look</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold text-ebony">Pieces that honour this investment</h2>
              </div>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((related) => (
                <ProductCard key={related.slug} product={related} categoryLabel={catalog.getCategory(related.category_slug)?.label} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
