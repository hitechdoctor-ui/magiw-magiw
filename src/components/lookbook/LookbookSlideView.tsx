"use client";

import type { LookbookSlide } from "@/lib/data/lookbook";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";

type LookbookSlideViewProps = {
  slide: LookbookSlide;
  isActive?: boolean;
  /** 0–1 proximity to viewport center (for crossfade while dragging) */
  transitionProgress?: number;
  priorityImage?: boolean;
  onTryOn: () => void;
};

export function LookbookSlideView({
  slide,
  isActive = false,
  transitionProgress = isActive ? 1 : 0,
  priorityImage = false,
  onTryOn,
}: LookbookSlideViewProps) {
  const { product } = slide;
  const showTryOn = product.showVirtualTryOn === true;

  const focus = Math.min(1, Math.max(0, transitionProgress));
  const scale = 1.04 - focus * 0.04;
  const panelOpacity = focus;
  const panelY = (1 - focus) * 28;

  return (
    <section className="lookbook-viewport-height relative flex w-screen shrink-0 items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `scale(${scale})`,
          opacity: 0.35 + focus * 0.65,
        }}
      >
        {slide.isVideo ? (
          <video
            className="h-full w-full object-cover"
            src={slide.heroMediaUrl}
            poster={slide.posterUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={slide.heroMediaUrl}
            alt={product.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={priorityImage}
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35"
          style={{ opacity: 0.5 + focus * 0.5 }}
        />
      </div>

      <div
        className="relative z-10 flex h-full w-full max-w-lg flex-col justify-end px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(6rem,calc(env(safe-area-inset-top)+4rem))] sm:px-8 sm:pb-12"
        style={{
          opacity: panelOpacity,
          transform: `translate3d(0, ${panelY}px, 0)`,
        }}
      >
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">
          {slide.post.caption ?? "MAGIW MAGIW · Lookbook"}
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">
          {product.name}
        </h2>
        <p className="mt-3 font-mono text-xs tracking-wider text-white/80">
          SKU · {product.sku}
        </p>
        <p className="mt-2 text-xl font-light tracking-wide text-white">
          {formatPricePrecise(product.price_cents, product.currency)}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {showTryOn && (
            <button
              type="button"
              onClick={onTryOn}
              className="flex flex-1 items-center justify-center gap-2 bg-white py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-950 transition hover:bg-neutral-100"
            >
              <span aria-hidden>✨</span>
              Δες το πάνω σου
            </button>
          )}
          <Link
            href={`/product/${product.slug}`}
            className="flex flex-1 items-center justify-center border border-white/60 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white/10"
          >
            Προβολή λεπτομερειών
          </Link>
        </div>
      </div>
    </section>
  );
}
