"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  image: string;
  caption?: string;
};

type EditorialLookbookCarouselProps = {
  slides: Slide[];
  productName: string;
  seasonLabel?: string;
};

export function EditorialLookbookCarousel({
  slides,
  productName,
  seasonLabel,
}: EditorialLookbookCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncIndexFromScroll = useCallback(() => {
    const node = scrollerRef.current;
    if (!node || slides.length === 0) return;

    const width = node.clientWidth;
    if (width <= 0) return;

    const index = Math.round(node.scrollLeft / width);
    setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
  }, [slides.length]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    const onScroll = () => syncIndexFromScroll();
    node.addEventListener("scroll", onScroll, { passive: true });

    const observer = new ResizeObserver(() => {
      syncIndexFromScroll();
    });
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [syncIndexFromScroll]);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, slides.length);
  }, [slides.length]);

  const scrollTo = (index: number) => {
    const node = scrollerRef.current;
    if (!node) return;

    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    const width = node.clientWidth;
    node.scrollTo({ left: clamped * width, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  const goPrev = () => scrollTo(activeIndex - 1);
  const goNext = () => scrollTo(activeIndex + 1);

  return (
    <div className="relative flex h-[calc(100dvh-11rem)] min-h-[360px] w-full flex-col lg:h-full lg:min-h-0">
      <div
        ref={scrollerRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
        aria-label={`${productName} lookbook`}
      >
        {slides.map((slide, index) => (
          <div
            key={`${slide.image}-${index}`}
            ref={(element) => {
              slideRefs.current[index] = element;
            }}
            className="relative h-full w-full shrink-0 grow-0 basis-full snap-start snap-always"
          >
            <div className="relative flex h-full w-full items-center justify-center bg-[#050505] px-1 sm:px-2">
              <Image
                src={slide.image}
                alt={
                  slide.caption
                    ? `${productName} — ${slide.caption}`
                    : `${productName} — slide ${index + 1}`
                }
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority={index === 0}
                draggable={false}
              />
            </div>
            {slide.caption && (
              <p className="pointer-events-none absolute bottom-14 left-4 right-4 text-center text-[10px] uppercase tracking-[0.28em] text-white/85 sm:bottom-12 lg:bottom-10">
                {slide.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-5">
        {seasonLabel ? (
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">
            {seasonLabel}
          </p>
        ) : (
          <span />
        )}
        <p
          className="rounded-full bg-black/50 px-3 py-1 font-mono text-[10px] tracking-widest text-white/95 backdrop-blur-sm"
          aria-live="polite"
        >
          {activeIndex + 1} / {slides.length}
        </p>
      </div>

      {activeIndex > 0 && (
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/45 p-2 text-white/90 backdrop-blur-sm transition hover:bg-black/65 sm:flex"
          aria-label="Previous slide"
        >
          ‹
        </button>
      )}
      {activeIndex < slides.length - 1 && (
        <button
          type="button"
          onClick={goNext}
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/45 p-2 text-white/90 backdrop-blur-sm transition hover:bg-black/65 sm:flex"
          aria-label="Next slide"
        >
          ›
        </button>
      )}

      <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5 px-4 lg:bottom-5">
        {slides.map((slide, index) => (
          <button
            key={`dot-${slide.image}-${index}`}
            type="button"
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              activeIndex === index
                ? "w-8 bg-[#c9a962]"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Slide ${index + 1}`}
            aria-current={activeIndex === index}
          />
        ))}
      </div>

      <p className="pointer-events-none absolute bottom-10 left-0 right-0 text-center text-[9px] uppercase tracking-[0.35em] text-white/40 lg:hidden">
        Σύρε για επόμενη φωτογραφία
      </p>
    </div>
  );
}
