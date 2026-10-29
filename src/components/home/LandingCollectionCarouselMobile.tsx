"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import { COLLECTION_CAROUSEL_SLIDES } from "@/lib/landing/collectionCarouselSlides";
import Image from "next/image";
import Link from "next/link";

export function LandingCollectionCarouselMobile() {
  const { locale } = useLocale();
  const copy = LANDING_COPY[locale].carousel;
  return (
    <section className="bg-[#eceae5] px-5 py-14 text-neutral-950 md:hidden" aria-label={copy.ariaLabel}>
      <h2 className="font-sans text-2xl font-semibold uppercase leading-tight tracking-[0.06em]">
        <span className="text-stroke-neutral block text-transparent [-webkit-text-stroke:1px_#171717]">
          {copy.headingStroke}
        </span>
        {copy.headingRest}
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
        {copy.lede}
      </p>
      <ul className="mt-8 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {COLLECTION_CAROUSEL_SLIDES.map((baseSlide) => {
          const slide = { ...baseSlide, ...copy.slides[baseSlide.id] };
          return (
          <li
            key={slide.id}
            className="w-[min(78vw,20rem)] shrink-0 snap-center"
          >
            <div className="relative aspect-[14/10] overflow-hidden rounded-2xl bg-neutral-200 shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                style={{ objectPosition: slide.objectPosition }}
                sizes="78vw"
              />
              <p className="absolute bottom-3 left-3 max-w-[70%] rounded-lg bg-white/90 px-3 py-2 text-[10px] leading-snug text-neutral-800">
                {slide.tagline}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-medium uppercase tracking-wide">
                {slide.title}
              </h3>
              <Link
                href={slide.href}
                className="shrink-0 rounded-full border border-neutral-900 px-3 py-1 text-[10px] uppercase tracking-wider"
              >
                {slide.cta}
              </Link>
            </div>
          </li>
          );
        })}
      </ul>
    </section>
  );
}
