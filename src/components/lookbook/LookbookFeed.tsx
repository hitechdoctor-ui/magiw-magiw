"use client";

import { LookbookSlideView } from "@/components/lookbook/LookbookSlideView";
import { LookbookTopBar } from "@/components/lookbook/LookbookTopBar";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";
import type { LookbookSlide } from "@/lib/data/lookbook";
import type { ProductDetail } from "@/lib/types/database";
import { useVisualViewportHeight } from "@/hooks/useVisualViewportHeight";
import {
  animateValue,
  applyEdgeResistance,
  LOOKBOOK_TRANSITION_MS,
} from "@/lib/utils/lookbook-motion";
import { LookbookInstallHint } from "@/components/lookbook/LookbookInstallHint";
import { useCallback, useEffect, useRef, useState } from "react";

type LookbookFeedProps = {
  slides: LookbookSlide[];
};

const SWIPE_THRESHOLD_PX = 56;
const WHEEL_THRESHOLD = 24;
const WHEEL_COOLDOWN_MS = LOOKBOOK_TRANSITION_MS + 80;

export function LookbookFeed({ slides }: LookbookFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const slideHeightRef = useRef(0);
  const offsetPxRef = useRef(0);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const cancelAnimateRef = useRef<(() => void) | null>(null);

  const touchStartYRef = useRef<number | null>(null);
  const touchBaseOffsetRef = useRef(0);
  const wheelLockUntilRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [offsetPx, setOffsetPx] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [tryOnProduct, setTryOnProduct] = useState<ProductDetail | null>(null);

  activeIndexRef.current = activeIndex;
  offsetPxRef.current = offsetPx;

  useVisualViewportHeight(true);

  const getSlideHeight = useCallback(() => {
    if (typeof window === "undefined") return 800;
    const cssVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--app-vh")
      .trim();
    const fromVar = cssVar.endsWith("px") ? parseFloat(cssVar) : 0;
    return (
      fromVar ||
      window.visualViewport?.height ||
      window.innerHeight ||
      containerRef.current?.clientHeight ||
      800
    );
  }, []);

  const indexToOffset = useCallback(
    (index: number) => -index * slideHeightRef.current,
    [],
  );

  const clampIndex = useCallback(
    (index: number) => Math.min(Math.max(index, 0), slides.length - 1),
    [slides.length],
  );

  const applyOffset = useCallback((px: number) => {
    offsetPxRef.current = px;
    setOffsetPx(px);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(0, ${px}px, 0)`;
    }
  }, []);

  const animateToOffset = useCallback(
    (targetPx: number, onDone?: () => void) => {
      cancelAnimateRef.current?.();
      isAnimatingRef.current = true;

      const from = offsetPxRef.current;
      cancelAnimateRef.current = animateValue(
        from,
        targetPx,
        LOOKBOOK_TRANSITION_MS,
        applyOffset,
        () => {
          isAnimatingRef.current = false;
          cancelAnimateRef.current = null;
          onDone?.();
        },
      );
    },
    [applyOffset],
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (slides.length === 0 || isAnimatingRef.current) return;

      const clamped = clampIndex(index);
      if (clamped === activeIndexRef.current) return;

      const target = indexToOffset(clamped);
      animateToOffset(target, () => {
        setActiveIndex(clamped);
      });
      setActiveIndex(clamped);
    },
    [animateToOffset, clampIndex, indexToOffset, slides.length],
  );

  const goNext = useCallback(() => {
    goToSlide(activeIndexRef.current + 1);
  }, [goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndexRef.current - 1);
  }, [goToSlide]);

  useEffect(() => {
    document.documentElement.classList.add("lookbook-active");

    const syncHeight = () => {
      const height = getSlideHeight();
      slideHeightRef.current = height;
      setViewportHeight(height);
      const target = indexToOffset(activeIndexRef.current);
      applyOffset(target);
    };

    syncHeight();
    window.addEventListener("resize", syncHeight);

    return () => {
      document.documentElement.classList.remove("lookbook-active");
      window.removeEventListener("resize", syncHeight);
      cancelAnimateRef.current?.();
    };
  }, [applyOffset, getSlideHeight, indexToOffset]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      if (Date.now() < wheelLockUntilRef.current) {
        event.preventDefault();
        return;
      }

      if (isAnimatingRef.current) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      event.preventDefault();
      wheelLockUntilRef.current = Date.now() + WHEEL_COOLDOWN_MS;

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
    if (isAnimatingRef.current) return;
    cancelAnimateRef.current?.();
    cancelAnimateRef.current = null;
    isAnimatingRef.current = false;

    touchStartYRef.current = event.touches[0]?.clientY ?? null;
    touchBaseOffsetRef.current = offsetPxRef.current;
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const startY = touchStartYRef.current;
    const currentY = event.touches[0]?.clientY;
    if (startY == null || currentY == null) return;

    const delta = currentY - startY;
    const raw = touchBaseOffsetRef.current + delta;
    const min = indexToOffset(0);
    const max = indexToOffset(slides.length - 1);
    applyOffset(applyEdgeResistance(raw, min, max));
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartYRef.current = null;

    if (startY == null || endY == null) return;

    const delta = startY - endY;
    const height = slideHeightRef.current || getSlideHeight();

    let targetIndex = activeIndexRef.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
      targetIndex += delta > 0 ? 1 : -1;
    } else {
      targetIndex = Math.round(-offsetPxRef.current / height);
    }

    const clamped = clampIndex(targetIndex);
    animateToOffset(indexToOffset(clamped), () => setActiveIndex(clamped));
    setActiveIndex(clamped);
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
      className="lookbook-viewport-height relative w-screen overflow-hidden bg-black touch-none select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="MAGIW MAGIW lookbook"
    >
      <LookbookTopBar />

      <div
        ref={trackRef}
        className="will-change-transform backface-hidden"
        style={{ transform: `translate3d(0, ${offsetPx}px, 0)` }}
      >
        {slides.map((slide, index) => (
          <LookbookSlideView
            key={slide.post.id}
            slide={slide}
            isActive={index === activeIndex}
            transitionProgress={
              viewportHeight > 0
                ? Math.max(
                    0,
                    1 -
                      Math.min(
                        1,
                        Math.abs(offsetPx + index * viewportHeight) /
                          viewportHeight,
                      ),
                  )
                : index === 0
                  ? 1
                  : 0
            }
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
            className={`pointer-events-auto rounded-full transition-all duration-700 ease-out ${
              activeIndex === index
                ? "h-3 w-3 bg-white"
                : "h-2 w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${index + 1}: ${slide.product.name}`}
            aria-current={activeIndex === index}
          />
        ))}
      </nav>

      <p className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 text-[9px] uppercase tracking-[0.35em] text-white/45 lg:hidden">
        Σύρε κάθετα
      </p>

      <LookbookInstallHint />

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
