"use client";

import Image from "next/image";
import { useState } from "react";

const THUMB_LABELS = ["Μπροστά", "Πίσω", "Λεπτομέρεια"];

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50">
        <Image
          key={activeImage}
          src={activeImage}
          alt={`${productName} — ${THUMB_LABELS[activeIndex] ?? "view"}`}
          fill
          className="object-contain object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`group relative aspect-[4/5] overflow-hidden bg-stone-100 transition ${
                activeIndex === index
                  ? "ring-1 ring-neutral-900 ring-offset-2 ring-offset-[#faf8f5]"
                  : "opacity-80 hover:opacity-100"
              }`}
              aria-label={`${productName} — ${THUMB_LABELS[index] ?? `view ${index + 1}`}`}
              aria-pressed={activeIndex === index}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
              <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-[0.2em] text-white drop-shadow">
                {THUMB_LABELS[index] ?? `#${index + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
