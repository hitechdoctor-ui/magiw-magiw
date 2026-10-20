"use client";

import { useCart } from "@/components/cart/CartProvider";
import { RunwayQuickCartSheet } from "@/components/runway/RunwayQuickCartSheet";
import { SilentRunwayHeader } from "@/components/runway/SilentRunwayHeader";
import { SilentRunwaySlide } from "@/components/runway/SilentRunwaySlide";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";
import { useVisualViewportHeight } from "@/hooks/useVisualViewportHeight";
import type { LookbookSlide } from "@/lib/data/lookbook";
import type { ProductDetail } from "@/lib/types/database";
import { useCallback, useEffect, useRef, useState } from "react";

type SilentRunwayFeedProps = {
  slides: LookbookSlide[];
  /** When false, page scrolls normally (atelier home embed). */
  lockDocumentScroll?: boolean;
  className?: string;
};

export function SilentRunwayFeed({
  slides,
  lockDocumentScroll = true,
  className,
}: SilentRunwayFeedProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [tryOnProduct, setTryOnProduct] = useState<ProductDetail | null>(null);
  const [cartSheetProduct, setCartSheetProduct] =
    useState<ProductDetail | null>(null);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const { addProduct, count, openCart } = useCart();

  const isLocked = tryOnProduct !== null || cartSheetProduct !== null;

  useVisualViewportHeight(true);

  useEffect(() => {
    if (!lockDocumentScroll) return;
    document.documentElement.classList.add("lookbook-active");
    return () => {
      document.documentElement.classList.remove("lookbook-active");
    };
  }, [lockDocumentScroll]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.55) continue;
          const index = slideRefs.current.findIndex(
            (node) => node === entry.target,
          );
          if (index >= 0) setActiveIndex(index);
        }
      },
      { root, threshold: [0.55, 0.72] },
    );

    slideRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [slides.length]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    if (isLocked) {
      node.style.overflow = "hidden";
    } else {
      node.style.overflow = "";
    }
  }, [isLocked]);

  const addToCart = useCallback(
    (product: ProductDetail, size: string) => {
      addProduct(product, size, { openCart: false });
      setCartSheetProduct(null);
      setCartToast(`${product.name} · ${size}`);
      window.setTimeout(() => setCartToast(null), 2400);
    },
    [addProduct],
  );

  const handleQuickCart = useCallback((product: ProductDetail) => {
    if (product.stock === 0) return;
    if (product.sizes.length === 1) {
      addToCart(product, product.sizes[0]!);
      return;
    }
    setCartSheetProduct(product);
  }, [addToCart]);

  if (slides.length === 0) {
    return (
      <div className="flex lookbook-viewport-height w-screen items-center justify-center bg-black text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">
          Η συλλογή φορτώνει σύντομα.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative bg-black text-white ${className ?? ""}`}>
      <SilentRunwayHeader
        cartCount={count}
        onCartClick={openCart}
      />

      <div
        ref={scrollerRef}
        className="runway-feed h-full min-h-0 w-full overflow-x-hidden overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] lookbook-viewport-height"
        aria-label="MAGIW MAGIW Silent Runway"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.post.id}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            className="lookbook-viewport-height"
          >
            <SilentRunwaySlide
              slide={slide}
              isActive={index === activeIndex}
              priorityImage={index <= 1}
              dimmed={isLocked}
              onTryOn={() => setTryOnProduct(slide.product)}
              onQuickCart={() => handleQuickCart(slide.product)}
            />
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1.5 sm:flex"
        aria-hidden
      >
        {slides.map((slide, index) => (
          <span
            key={`rail-${slide.post.id}`}
            className={`block rounded-full transition-all duration-500 ${
              index === activeIndex
                ? "h-6 w-1 bg-white"
                : "h-1.5 w-1 bg-white/35"
            }`}
          />
        ))}
      </div>

      {cartToast && (
        <p
          className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[60] -translate-x-1/2 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md"
          aria-live="polite"
        >
          + {cartToast}
        </p>
      )}

      {cartSheetProduct && (
        <RunwayQuickCartSheet
          product={cartSheetProduct}
          onSelect={(size) => addToCart(cartSheetProduct, size)}
          onClose={() => setCartSheetProduct(null)}
        />
      )}

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
