"use client";

import type { LookbookSlide } from "@/lib/data/lookbook";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";

type SilentRunwaySlideProps = {
  slide: LookbookSlide;
  isActive: boolean;
  priorityImage?: boolean;
  onTryOn: () => void;
  onQuickCart: () => void;
  dimmed?: boolean;
};

export function SilentRunwaySlide({
  slide,
  isActive,
  priorityImage = false,
  onTryOn,
  onQuickCart,
  dimmed = false,
}: SilentRunwaySlideProps) {
  const { product } = slide;
  const showTryOn = product.showVirtualTryOn === true;

  return (
    <section
      className="runway-slide relative w-full shrink-0 snap-start snap-always overflow-hidden bg-black"
      aria-hidden={!isActive}
    >
      <div className="absolute inset-0">
        {slide.isVideo ? (
          <video
            className="h-full w-full object-cover object-center"
            src={slide.heroMediaUrl}
            poster={slide.posterUrl ?? undefined}
            autoPlay={isActive}
            muted
            loop
            playsInline
            preload={isActive ? "auto" : "metadata"}
          />
        ) : (
          <Image
            src={slide.heroMediaUrl}
            alt={product.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={priorityImage}
            draggable={false}
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/35"
          aria-hidden
        />
      </div>

      <div
        className={`relative z-10 flex h-full w-full flex-col justify-end px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[max(5.5rem,calc(env(safe-area-inset-top)+4rem))] transition-opacity duration-300 sm:px-8 ${
          dimmed ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 max-w-[58%] sm:max-w-[50%]">
            <h2 className="font-serif text-[clamp(1.35rem,5.5vw,2rem)] leading-[1.08] tracking-tight text-white">
              {product.name}
            </h2>
            <p className="mt-2 font-mono text-[10px] tracking-[0.22em] text-white/70">
              {product.sku}
            </p>
            <p className="mt-2 text-lg font-light tracking-wide text-white/95">
              {formatPricePrecise(product.price_cents, product.currency)}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-2.5">
            {showTryOn && (
              <button
                type="button"
                onClick={onTryOn}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:border-white/45 hover:bg-white/15"
              >
                <span aria-hidden className="mr-1">
                  ✨
                </span>
                Δες το πάνω σου
              </button>
            )}
            <button
              type="button"
              onClick={onQuickCart}
              disabled={product.stock === 0}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:border-white/45 hover:bg-white/15 disabled:opacity-40"
            >
              + Καλάθι
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
