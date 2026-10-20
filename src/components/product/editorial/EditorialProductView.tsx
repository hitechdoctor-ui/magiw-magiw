"use client";

import { useCart } from "@/components/cart/CartProvider";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";
import { EditorialLookbookCarousel } from "@/components/product/editorial/EditorialLookbookCarousel";
import type {
  EditorialLookbookSlide,
  ProductDetail,
} from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";
import { useState } from "react";

type EditorialProductViewProps = {
  product: ProductDetail;
};

export function EditorialProductView({ product }: EditorialProductViewProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const { addProduct } = useCart();

  const editorial = product.editorial;
  const collectionLine = editorial?.collectionLine ?? product.name;
  const seasonLabel = editorial?.seasonLabel;

  const slides: EditorialLookbookSlide[] = editorial?.slides?.length
    ? editorial.slides
    : product.images.map((image) => ({ image }));

  const sections = product.sections ?? [];
  const showTryOn = product.showVirtualTryOn === true;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addProduct(product, selectedSize);
    setAdded(true);
    setSizeError(false);
    window.setTimeout(() => setAdded(false), 2800);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-neutral-100">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12 lg:gap-0">
        <div className="relative lg:col-span-7 lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)] lg:min-h-0 lg:flex-col">
          <Link
            href="/"
            className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-white/90 backdrop-blur-md transition hover:border-[#c9a962]/60 hover:text-[#e8d5a3]"
          >
            ← Feed
          </Link>
          <EditorialLookbookCarousel
            slides={slides}
            productName={product.name}
            seasonLabel={seasonLabel}
          />
        </div>

        <div className="relative z-10 -mt-4 rounded-t-3xl bg-[#0c0c0c] px-5 pb-36 pt-6 shadow-[0_-16px_48px_rgba(0,0,0,0.4)] sm:px-8 lg:col-span-5 lg:mt-0 lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:rounded-none lg:px-10 lg:py-14 lg:pb-14 lg:shadow-none">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[#c9a962]">
            {collectionLine}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2rem,7vw,3.25rem)] leading-[1.05] tracking-tight text-white">
            {product.name}
          </h1>

          <p className="mt-4 font-mono text-xs tracking-[0.2em] text-neutral-400">
            SKU · {product.sku}
          </p>

          {product.statusLabel && (
            <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-neutral-400">
              {product.statusLabel}
            </p>
          )}

          <p className="mt-6 text-3xl font-light tracking-wide text-[#e8d5a3]">
            {formatPricePrecise(product.price_cents, product.currency)}
          </p>

          <p className="mt-6 text-sm leading-7 text-neutral-300">
            {product.description}
          </p>

          <div className="mt-10 border-t border-white/10 pt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                Μέγεθος
              </p>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-[10px] uppercase tracking-[0.2em] text-[#c9a962] underline-offset-4 hover:underline"
              >
                Οδηγός
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`min-w-14 border px-5 py-2.5 text-sm transition ${
                    selectedSize === size
                      ? "border-[#c9a962] bg-[#c9a962] text-black"
                      : "border-white/20 bg-transparent text-neutral-200 hover:border-white/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="mt-3 text-xs text-red-400">
                Επίλεξε μέγεθος πριν την προσθήκη.
              </p>
            )}
          </div>

          <div className="mt-8 hidden flex-col gap-3 lg:flex">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-[#c9a962] py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-black transition hover:bg-[#dfc07a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {product.stock === 0
                ? "Εξαντλήθηκε"
                : added
                  ? `Προστέθηκε · ${selectedSize}`
                  : "Προσθήκη στο καλάθι"}
            </button>
            {showTryOn && (
              <button
                type="button"
                onClick={() => setTryOnOpen(true)}
                className="w-full border border-white/25 py-4 text-sm text-white transition hover:border-[#c9a962]/50"
              >
                ✨ Virtual Try-On
              </button>
            )}
          </div>

          {added && (
            <p className="mt-4 hidden text-sm text-neutral-300 lg:block" aria-live="polite">
              Προστέθηκε: {product.name} · {selectedSize}
            </p>
          )}

          {sections.length > 0 && (
            <ProductAccordion
              sections={sections}
              className="mt-10 divide-y divide-white/10 border-t border-white/10 [&_summary]:text-neutral-200 [&_p]:text-neutral-400"
            />
          )}

          <div className="mt-12 hidden lg:block">
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
              Lookbook
            </p>
            <ul className="mt-4 space-y-3">
              {slides.map((slide, index) =>
                slide.caption ? (
                  <li
                    key={`cap-${index}`}
                    className="flex gap-3 text-xs text-neutral-400"
                  >
                    <span className="font-mono text-[#c9a962]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="uppercase tracking-[0.15em]">
                      {slide.caption}
                    </span>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0c0c0c]/95 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-sm text-white">
              {formatPricePrecise(product.price_cents, product.currency)}
            </p>
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              {selectedSize ? `Μέγεθος ${selectedSize}` : "Επίλεξε μέγεθος"}
            </p>
          </div>
          {showTryOn && (
            <button
              type="button"
              onClick={() => setTryOnOpen(true)}
              className="shrink-0 border border-white/20 px-3 py-3 text-[10px] uppercase tracking-[0.15em] text-white"
              aria-label="Virtual Try-On"
            >
              Try-On
            </button>
          )}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="shrink-0 bg-[#c9a962] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-black disabled:opacity-40"
          >
            {added ? "OK" : "Καλάθι"}
          </button>
        </div>
        {added && (
          <p className="mt-2 text-center text-xs text-[#c9a962]" aria-live="polite">
            Προστέθηκε · {selectedSize}
          </p>
        )}
      </div>

      {sizeGuideOpen && (
        <SizeGuideModal
          productName={product.name}
          sku={product.sku}
          sizeGuide={
            product.sizeGuide ?? {
              rows: product.sizes.map((size) => ({
                size,
                bust: "—",
                waist: "—",
                hips: "—",
              })),
            }
          }
          onClose={() => setSizeGuideOpen(false)}
        />
      )}

      {tryOnOpen && (
        <VirtualTryOnModal
          productName={product.name}
          productImage={product.images[0]}
          productSlug={product.slug}
          garmentDescription={product.garmentDescription}
          tryOnCategory={product.tryOnCategory}
          onClose={() => setTryOnOpen(false)}
        />
      )}
    </div>
  );
}
