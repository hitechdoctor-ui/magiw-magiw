"use client";

import { LookbookSlideView } from "@/components/lookbook/LookbookSlideView";
import { LookbookTopBar } from "@/components/lookbook/LookbookTopBar";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";
import type { LookbookSlide } from "@/lib/data/lookbook";
import type { ProductDetail } from "@/lib/types/database";
import { useCallback, useEffect, useRef, useState } from "react";

type LookbookFeedProps = {
  slides: LookbookSlide[];
};

const SLIDE_MS = 720;
const SWIPE_THRESHOLD_PX = 48;
const WHEEL_THRESHOLD = 28;

export function LookbookFeed({ slides }: LookbookFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [tryOnProduct, setTryOnProduct] = useState<ProductDetail | null>(null);

  activeIndexRef.current = activeIndex;

  const goToSlide = useCallback(
    (index: number) => {
      if (slides.length === 0) return;

      const clamped = Math.min(Math.max(index, 0), slides.length - 1);
      if (clamped === activeIndexRef.current || isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      setActiveIndex(clamped);

      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, SLIDE_MS);
    },
    [slides.length],
  );

  const goNext = useCallback(() => {
    goToSlide(activeIndexRef.current + 1);
  }, [goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndexRef.current - 1);
  }, [goToSlide]);

  useEffect(() => {
    document.documentElement.classList.add("lookbook-active");
    return () => document.documentElement.classList.remove("lookbook-active");
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      if (isAnimatingRef.current) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      event.preventDefault();
      if (event.deltaY > 0) goNext();
      else goPrev();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goPrev();
      }
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      node.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goNext, goPrev]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartYRef.current = null;

    if (startY == null || endY == null) return;

    const delta = startY - endY;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

    if (delta > 0) goNext();
    else goPrev();
  };

  if (slides.length === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
          Δεν υπάρχουν προϊόντα στο lookbook.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-screen overflow-hidden bg-black touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="MAGIW MAGIW lookbook"
    >
      <LookbookTopBar />

      <div
        className="will-change-transform transition-transform duration-[720ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(0, -${activeIndex * 100}dvh, 0)` }}
      >
        {slides.map((slide, index) => (
          <LookbookSlideView
            key={slide.post.id}
            slide={slide}
            isActive={index === activeIndex}
            priorityImage={index <= 1}
            onTryOn={() => setTryOnProduct(slide.product)}
          />
        ))}
      </div>

      <nav
        className="pointer-events-none fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 sm:right-5"
        aria-label="Slide navigation"
      >
        {slides.map((slide, index) => (
          <button
            key={`dot-${slide.post.id}`}
            type="button"
            onClick={() => goToSlide(index)}
            className={`pointer-events-auto rounded-full transition-all duration-500 ${
              activeIndex === index
                ? "h-3 w-3 bg-white"
                : "h-2 w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${index + 1}: ${slide.product.name}`}
            aria-current={activeIndex === index}
          />
        ))}
      </nav>

      <p className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 text-[9px] uppercase tracking-[0.35em] text-white/45 lg:hidden">
        Σύρε κάθετα
      </p>

      {tryOnProduct && (
        <VirtualTryOnModal
          productName={tryOnProduct.name}
          productImage={tryOnProduct.images[0]}
          productSlug={tryOnProduct.slug}
          garmentDescription={tryOnProduct.garmentDescription}
          tryOnCategory={tryOnProduct.tryOnCategory}
          onClose={() => setTryOnProduct(null)}
        />
      )}
    </div>
  );
}
