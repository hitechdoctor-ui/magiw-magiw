"use client";

import type { LookbookSlide } from "@/lib/data/lookbook";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";

type LookbookSlideViewProps = {
  slide: LookbookSlide;
  isActive?: boolean;
  priorityImage?: boolean;
  onTryOn: () => void;
};

export function LookbookSlideView({
  slide,
  isActive = false,
  priorityImage = false,
  onTryOn,
}: LookbookSlideViewProps) {
  const { product } = slide;
  const showTryOn = product.showVirtualTryOn === true;

  return (
    <section className="relative flex h-[100dvh] w-screen shrink-0 items-center justify-center overflow-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-[720ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
          isActive ? "scale-100" : "scale-[1.03]"
        }`}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35" />
      </div>

      <div
        className={`relative z-10 flex h-full w-full max-w-lg flex-col justify-end px-5 pb-10 pt-24 transition-all duration-[720ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none sm:px-8 sm:pb-12 ${
          isActive
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
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
            className={`flex flex-1 items-center justify-center border border-white/60 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white/10 ${
              showTryOn ? "" : "sm:flex-[1]"
            }`}
          >
            Προβολή λεπτομερειών
          </Link>
        </div>
      </div>
    </section>
  );
}
