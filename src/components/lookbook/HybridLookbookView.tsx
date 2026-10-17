"use client";

import { HybridProductCarousel } from "@/components/lookbook/HybridProductCarousel";
import { HybridProductDetails } from "@/components/lookbook/HybridProductDetails";
import { LookbookTopBar } from "@/components/lookbook/LookbookTopBar";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";
import { useVisualViewportHeight } from "@/hooks/useVisualViewportHeight";
import type { LookbookSlide } from "@/lib/data/lookbook";
import type { ProductDetail } from "@/lib/types/database";
import { useCallback, useEffect, useRef, useState } from "react";

type HybridLookbookViewProps = {
  slides: LookbookSlide[];
};

export function HybridLookbookView({ slides }: HybridLookbookViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tryOnProduct, setTryOnProduct] = useState<ProductDetail | null>(null);

  useVisualViewportHeight(true);

  const isLocked = tryOnProduct !== null;
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    document.documentElement.classList.add("lookbook-active");
    return () => {
      document.documentElement.classList.remove("lookbook-active");
    };
  }, []);

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openTryOn = useCallback((product: ProductDetail) => {
    setTryOnProduct(product);
  }, []);

  if (slides.length === 0) {
    return (
      <div className="flex lookbook-viewport-height w-screen items-center justify-center bg-neutral-950 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">
          Δεν υπάρχουν προϊόντα.
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-black text-white">
      <LookbookTopBar />

      <div
        ref={scrollRef}
        className="lookbook-viewport-height overflow-x-hidden overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]"
        aria-label="MAGIW MAGIW lookbook"
      >
        <div className="sticky top-0 z-0 h-[min(72dvh,780px)] w-full">
          <HybridProductCarousel
            slides={slides}
            activeIndex={activeIndex}
            onActiveIndexChange={handleActiveIndexChange}
            disabled={isLocked}
          />
        </div>

        <section
          className={`relative z-10 -mt-6 rounded-t-[1.75rem] bg-neutral-950 px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8 shadow-[0_-20px_60px_rgba(0,0,0,0.55)] sm:px-8 sm:pt-10 ${
            isLocked ? "pointer-events-none" : ""
          }`}
          aria-hidden={isLocked}
        >
          {activeSlide && (
            <HybridProductDetails
              key={activeSlide.product.id}
              product={activeSlide.product}
              collectionCaption={activeSlide.post.caption}
              onTryOn={() => openTryOn(activeSlide.product)}
            />
          )}
        </section>
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
