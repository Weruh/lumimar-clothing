import React from 'react';
import { getCatalog, ensureImage } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { Link } from '@/lib/router';

export default function HomePage() {
  const catalog = getCatalog();
  const newIn = catalog.newIn(12);
  const heroProduct = newIn.length ? newIn[0] : null;
  const heroImg = ensureImage(heroProduct?.hero_image);
  const editorsPicks = catalog.editorsPicks.slice(0, 3);
  const creatorSpotlights = catalog.creatorSpotlights.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-soft-cream via-white to-lumimar-soft/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-lumimar-primary/14 blur-3xl"></div>
          <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-lumimar-secondary/18 blur-3xl"></div>
        </div>
        <div className="container relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-ebony/60">Season picks - SS/26</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-ebony">
              Dress for the journey.
            </h1>
            <p className="max-w-xl text-base text-ebony/70">
              Lumimar makes quality pieces from makers around the world, designed for travel, events, and everyday wear.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-ebony/70">
              <span className="rounded-full border border-ebony/15 bg-white px-3 py-1 font-semibold">Made slowly - less waste</span>
              <span className="rounded-full border border-ebony/15 bg-white px-3 py-1">Sizes XS-4X</span>
              <span className="rounded-full border border-ebony/15 bg-white px-3 py-1">Ships worldwide</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/category/women-curvy-babes"
                className="inline-flex items-center gap-3 rounded-full bg-lumimar-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-soft-cream shadow-card transition hover:-translate-y-0.5 hover:bg-lumimar-secondary hover:text-lumimar-dark"
              >
                Shop rituals
              </Link>
              <Link
                href="/category/traditional-global"
                className="inline-flex items-center gap-2 rounded-full border border-ebony/15 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ebony shadow-soft transition hover:-translate-y-0.5 hover:border-ebony/50"
              >
                Explore heritage
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[40px] bg-white shadow-card">
              <img
                src={heroImg}
                alt={heroProduct?.title || 'Lumimar'}
                className="h-full w-full max-h-[540px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-lumimar-primary/85 via-transparent to-transparent p-6 text-soft-cream">
                <p className="text-xs uppercase tracking-[0.32em] text-lumimar-secondary/90">Featured arrival</p>
                <p className="mt-2 text-sm text-soft-cream/85">
                  {heroProduct?.short_description || 'Hand-finished pieces for intentional wardrobes.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-cloud-gray/60 bg-soft-cream/60 p-6 shadow-soft">
            <p className="text-[11px] uppercase tracking-[0.28em] text-ebony/60">Material language</p>
            <h3 className="mt-2 text-lg font-semibold text-ebony">Feathered gradients, metallic whispers</h3>
            <p className="mt-2 text-sm text-ebony/70">Palette of berry, brushed gold, lilac fog, and midnight ink - finished with glassy trims.</p>
          </div>
          <div className="rounded-3xl border border-cloud-gray/60 bg-soft-cream/60 p-6 shadow-soft">
            <p className="text-[11px] uppercase tracking-[0.28em] text-ebony/60">Fit and form</p>
            <h3 className="mt-2 text-lg font-semibold text-ebony">Bias drape, curved seams</h3>
            <p className="mt-2 text-sm text-ebony/70">Architected for movement: arches, rounded hems, and modular layers that travel well.</p>
          </div>
          <div className="rounded-3xl border border-cloud-gray/60 bg-soft-cream/60 p-6 shadow-soft">
            <p className="text-[11px] uppercase tracking-[0.28em] text-ebony/60">Ethos</p>
            <h3 className="mt-2 text-lg font-semibold text-ebony">Slow prestige</h3>
            <p className="mt-2 text-sm text-ebony/70">Small-batch ateliers, ethical sourcing, and deliberate storytelling for the diaspora.</p>
          </div>
        </div>
      </section>

      {newIn.length ? (
        <section className="bg-white">
          <div className="container space-y-8 py-14">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-ebony/60">Fresh arrivals</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold text-ebony">Just in</h2>
              </div>
              <Link href="/category/women-curvy-babes" className="text-xs font-semibold uppercase tracking-[0.3em] text-ebony/70 hover:text-ebony">
                View all drops
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {newIn.slice(0, 8).map((product) => (
                <ProductCard key={product.slug} product={product} categoryLabel={catalog.getCategory(product.category_slug)?.label} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {editorsPicks.length ? (
        <section className="bg-soft-cream">
          <div className="container space-y-8 py-14">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-ebony/60">Editor rituals</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold text-ebony">Pieces we live in</h2>
              </div>
              <p className="text-sm text-ebony/60 lg:max-w-sm">Workhorse layers, ceremonial standouts, and travel-forward silhouettes that anchor every drop.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {editorsPicks.map((product) => (
                <div key={product.slug} className="h-full">
                  <ProductCard product={product} categoryLabel={catalog.getCategory(product.category_slug)?.label} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {creatorSpotlights.length ? (
        <section className="bg-white">
          <div className="container space-y-8 py-14">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-ebony/60">Makers</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold text-ebony">Spotlights from our global circle</h2>
              </div>
              <p className="text-sm text-ebony/60 lg:max-w-sm">Meet the pattern-cutters, dye artists, and stylists behind the craft.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {creatorSpotlights.map((creator) => (
                <article key={creator.name} className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <img
                      src={ensureImage(creator.image)}
                      alt={creator.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-200 hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-ebony/45">Creator</p>
                      <h3 className="text-lg font-semibold text-ebony">{creator.name}</h3>
                      <p className="text-sm text-ebony/60">{creator.location}</p>
                    </div>
                    <p className="text-sm text-ebony/70">{creator.focus}</p>
                    <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-deep-gold">
                      View journal {'->'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-lumimar-primary">
        <div className="container flex flex-col gap-6 py-16 text-soft-cream lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-lumimar-secondary/85">Newsletter</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight">Steward your wardrobe with quarterly briefs</h2>
            <p className="mt-3 max-w-xl text-sm text-soft-cream/70">Seasonal edits, atelier spotlights, and mindful investment advice. Only the notes worth reading.</p>
          </div>
          <form action="#" method="post" className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="home-newsletter">Email address</label>
            <input
              id="home-newsletter"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-full border border-white/20 bg-transparent px-4 py-3 text-sm text-soft-cream placeholder:text-soft-cream/50 focus:border-lumimar-secondary focus:outline-none focus:ring-2 focus:ring-lumimar-secondary/60"
            />
            <button type="submit" className="rounded-full bg-soft-cream px-5 py-3 text-xs font-semibold uppercase tracking-wide text-lumimar-dark transition hover:bg-lumimar-secondary hover:text-lumimar-dark">
              Join circle
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
