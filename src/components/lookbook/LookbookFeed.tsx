"use client";

import { LookbookSlideView } from "@/components/lookbook/LookbookSlideView";
import { LookbookTopBar } from "@/components/lookbook/LookbookTopBar";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";
import type { LookbookSlide } from "@/lib/data/lookbook";
import type { ProductDetail } from "@/lib/types/database";
import { useVisualViewportHeight } from "@/hooks/useVisualViewportHeight";
import {
  animateSpringTo,
  applyEdgeResistance,
  LOOKBOOK_TRANSITION_MS,
  snapIndexFromRelease,
} from "@/lib/utils/lookbook-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type LookbookFeedProps = {
  slides: LookbookSlide[];
};

const SWIPE_THRESHOLD_PX = 44;
const WHEEL_THRESHOLD = 20;
const WHEEL_COOLDOWN_MS = LOOKBOOK_TRANSITION_MS + 40;

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
  const touchVelocityRef = useRef(0);
  const touchSampleRef = useRef({ y: 0, t: 0 });
  const wheelLockUntilRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [offsetPx, setOffsetPx] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [tryOnProduct, setTryOnProduct] = useState<ProductDetail | null>(null);
  const tryOnOpenRef = useRef(false);

  const isLookbookLocked = tryOnProduct !== null;
  tryOnOpenRef.current = isLookbookLocked;

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

  const stopAnimation = useCallback(() => {
    cancelAnimateRef.current?.();
    cancelAnimateRef.current = null;
    isAnimatingRef.current = false;
  }, []);

  const animateToOffset = useCallback(
    (targetPx: number, onDone?: () => void, initialVelocityPxPerS = 0) => {
      stopAnimation();
      isAnimatingRef.current = true;

      const from = offsetPxRef.current;
      cancelAnimateRef.current = animateSpringTo(
        from,
        targetPx,
        applyOffset,
        () => {
          isAnimatingRef.current = false;
          cancelAnimateRef.current = null;
          onDone?.();
        },
        { velocity: initialVelocityPxPerS },
      );
    },
    [applyOffset, stopAnimation],
  );

  const lockLookbookAtCurrentSlide = useCallback(() => {
    cancelAnimateRef.current?.();
    cancelAnimateRef.current = null;
    isAnimatingRef.current = false;
    touchStartYRef.current = null;

    const index = activeIndexRef.current;
    const target = indexToOffset(index);
    applyOffset(target);
    setActiveIndex(index);
  }, [applyOffset, indexToOffset]);

  const openTryOn = useCallback(
    (product: ProductDetail) => {
      lockLookbookAtCurrentSlide();
      setTryOnProduct(product);
    },
    [lockLookbookAtCurrentSlide],
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (tryOnOpenRef.current) return;
      if (slides.length === 0) return;

      const clamped = clampIndex(index);
      if (clamped === activeIndexRef.current && !isAnimatingRef.current) {
        const target = indexToOffset(clamped);
        if (Math.abs(offsetPxRef.current - target) < 0.5) return;
      }

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
      if (tryOnOpenRef.current) {
        event.preventDefault();
        return;
      }

      if (Date.now() < wheelLockUntilRef.current) {
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
      if (tryOnOpenRef.current) return;

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
    if (tryOnOpenRef.current) return;

    stopAnimation();

    const y = event.touches[0]?.clientY ?? null;
    touchStartYRef.current = y;
    touchBaseOffsetRef.current = offsetPxRef.current;
    touchVelocityRef.current = 0;
    if (y != null) {
      touchSampleRef.current = { y, t: performance.now() };
    }
  };

  const onTouchMove = (event: React.TouchEvent) => {
    if (tryOnOpenRef.current) return;

    const startY = touchStartYRef.current;
    const currentY = event.touches[0]?.clientY;
    if (startY == null || currentY == null) return;

    const now = performance.now();
    const sample = touchSampleRef.current;
    if (sample.t > 0) {
      const dt = now - sample.t;
      if (dt > 0 && dt < 120) {
        touchVelocityRef.current = (currentY - sample.y) / dt;
      }
    }
    touchSampleRef.current = { y: currentY, t: now };

    const delta = currentY - startY;
    const raw = touchBaseOffsetRef.current + delta;
    const min = indexToOffset(0);
    const max = indexToOffset(slides.length - 1);
    applyOffset(applyEdgeResistance(raw, min, max));
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (tryOnOpenRef.current) return;

    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartYRef.current = null;

    if (startY == null || endY == null) return;

    const swipeDelta = startY - endY;
    const height = slideHeightRef.current || getSlideHeight();
    const velocityPxPerMs = touchVelocityRef.current;
    const velocityPxPerS = velocityPxPerMs * 1000;

    const targetIndex = snapIndexFromRelease(
      offsetPxRef.current,
      height,
      slides.length,
      velocityPxPerMs,
      SWIPE_THRESHOLD_PX,
      activeIndexRef.current,
      swipeDelta,
    );

    const clamped = clampIndex(targetIndex);
    animateToOffset(
      indexToOffset(clamped),
      () => setActiveIndex(clamped),
      velocityPxPerS,
    );
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
      <div
        className={isLookbookLocked ? "pointer-events-none" : undefined}
        aria-hidden={isLookbookLocked}
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
              onTryOn={() => openTryOn(slide.product)}
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
              disabled={isLookbookLocked}
              tabIndex={isLookbookLocked ? -1 : 0}
              className={`pointer-events-auto rounded-full transition-all duration-700 ease-out disabled:pointer-events-none ${
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

      </div>

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
