'use client';

import React, { useState } from 'react';
import { ensureImage } from '@/lib/catalog';

type GalleryItem = {
  src: string;
  alt?: string;
  type?: string;
};

export function ProductGallery({
  gallery,
  heroSrc,
  title,
}: {
  gallery: GalleryItem[];
  heroSrc: string | null | undefined;
  title: string;
}) {
  const mediaList = gallery.length ? gallery : [{ src: ensureImage(heroSrc), alt: title, type: 'image' }];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = mediaList[activeIndex] || mediaList[0];

  return (
    <div className="space-y-4">
      <div className="h-[360px] overflow-hidden rounded-3xl bg-white shadow-soft sm:h-[420px] lg:h-[520px]">
        {activeMedia?.type === 'video' ? (
          <video id="hero-media" controls className="h-full w-full object-cover object-center bg-cloud-gray/10">
            <source src={activeMedia.src} type="video/mp4" />
          </video>
        ) : (
          <img
            id="hero-media"
            src={ensureImage(activeMedia?.src)}
            alt={activeMedia?.alt || title}
            className="h-full w-full object-cover object-center bg-cloud-gray/10"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      {mediaList.length > 1 ? (
        <div className="grid grid-cols-5 gap-3">
          {mediaList.map((media, index) => (
            <button
              key={`${media.src}-${index}`}
              type="button"
              className="overflow-hidden rounded-2xl border border-cloud-gray/70 bg-white shadow-soft"
              onClick={() => setActiveIndex(index)}
            >
              {media.type === 'video' ? (
                <div className="relative aspect-square w-full bg-cloud-gray/30">
                  <span className="absolute inset-0 m-auto flex h-8 w-8 items-center justify-center rounded-full bg-ebony text-soft-cream">▶</span>
                </div>
              ) : (
                <img src={ensureImage(media.src)} alt={media.alt || title} className="aspect-square w-full object-cover" loading="lazy" decoding="async" />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
