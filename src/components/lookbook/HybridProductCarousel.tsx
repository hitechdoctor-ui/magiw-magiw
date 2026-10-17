"use client";

import type { LookbookSlide } from "@/lib/data/lookbook";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

type HybridProductCarouselProps = {
  slides: LookbookSlide[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  disabled?: boolean;
};

export function HybridProductCarousel({
  slides,
  activeIndex,
  onActiveIndexChange,
  disabled = false,
}: HybridProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const syncLockRef = useRef(false);

  const syncIndexFromScroll = useCallback(() => {
    const node = scrollerRef.current;
    if (!node || slides.length === 0 || syncLockRef.current) return;

    const width = node.clientWidth;
    if (width <= 0) return;

    const index = Math.round(node.scrollLeft / width);
    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    if (clamped !== activeIndex) {
      onActiveIndexChange(clamped);
    }
  }, [activeIndex, onActiveIndexChange, slides.length]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    const onScroll = () => syncIndexFromScroll();
    node.addEventListener("scroll", onScroll, { passive: true });

    const observer = new ResizeObserver(() => syncIndexFromScroll());
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [syncIndexFromScroll]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || slides.length === 0) return;

    const width = node.clientWidth;
    if (width <= 0) return;

    const targetLeft = activeIndex * width;
    if (Math.abs(node.scrollLeft - targetLeft) < 2) return;

    syncLockRef.current = true;
    node.scrollTo({ left: targetLeft, behavior: "smooth" });
    const timer = window.setTimeout(() => {
      syncLockRef.current = false;
    }, 420);
    return () => window.clearTimeout(timer);
  }, [activeIndex, slides.length]);

  const scrollTo = (index: number) => {
    if (disabled) return;
    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    onActiveIndexChange(clamped);
  };

  const goPrev = () => scrollTo(activeIndex - 1);
  const goNext = () => scrollTo(activeIndex + 1);

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative h-full w-full ${disabled ? "pointer-events-none" : ""}`}
      aria-hidden={disabled}
    >
      <div
        ref={scrollerRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
        aria-label="Προϊόντα συλλογής"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.post.id}
            className="relative h-full min-h-[280px] w-full shrink-0 grow-0 basis-full snap-start snap-always"
            aria-hidden={index !== activeIndex}
          >
            {slide.isVideo ? (
              <video
                className="absolute inset-0 h-full w-full object-cover object-center"
                src={slide.heroMediaUrl}
                poster={slide.posterUrl ?? undefined}
                autoPlay={index === activeIndex}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                src={slide.heroMediaUrl}
                alt={slide.product.name}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={index <= 1}
                draggable={false}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/40" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[max(4.5rem,calc(env(safe-area-inset-top)+3.25rem))] z-10 flex justify-end px-4 sm:px-6">
        <p
          className="rounded-full bg-black/45 px-3 py-1 font-mono text-[10px] tracking-widest text-white/95 backdrop-blur-sm"
          aria-live="polite"
        >
          {activeIndex + 1} / {slides.length}
        </p>
      </div>

      {activeIndex > 0 && !disabled && (
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-lg text-white/95 backdrop-blur-sm transition hover:bg-black/65 sm:left-4"
          aria-label="Προηγούμενο προϊόν"
        >
          ‹
        </button>
      )}
      {activeIndex < slides.length - 1 && !disabled && (
        <button
          type="button"
          onClick={goNext}
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-lg text-white/95 backdrop-blur-sm transition hover:bg-black/65 sm:right-4"
          aria-label="Επόμενο προϊόν"
        >
          ›
        </button>
      )}

      <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-1.5 px-4">
        {slides.map((slide, index) => (
          <button
            key={`dot-${slide.post.id}`}
            type="button"
            onClick={() => scrollTo(index)}
            disabled={disabled}
            className={`pointer-events-auto h-1.5 rounded-full transition-all disabled:pointer-events-none ${
              activeIndex === index
                ? "w-7 bg-white"
                : "w-1.5 bg-white/45 hover:bg-white/70"
            }`}
            aria-label={`Προϊόν ${index + 1}: ${slide.product.name}`}
            aria-current={activeIndex === index}
          />
        ))}
      </div>

      <p className="pointer-events-none absolute bottom-10 left-0 right-0 text-center text-[9px] uppercase tracking-[0.35em] text-white/45">
        Σύρε αριστερά / δεξιά
      </p>
    </div>
  );
}
