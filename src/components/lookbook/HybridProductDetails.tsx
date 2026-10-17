"use client";

import { ProductAccordion } from "@/components/product/ProductAccordion";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";
import { useState } from "react";

type HybridProductDetailsProps = {
  product: ProductDetail;
  collectionCaption?: string | null;
  onTryOn: () => void;
};

export function HybridProductDetails({
  product,
  collectionCaption,
  onTryOn,
}: HybridProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const sections = product.sections ?? [];
  const showTryOn = product.showVirtualTryOn === true;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setAdded(true);
    setSizeError(false);
    window.setTimeout(() => setAdded(false), 2800);
  };

  return (
    <>
      <div className="mx-auto max-w-lg">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/55">
          {collectionCaption ?? "MAGIW MAGIW · Συλλογή"}
        </p>

        <h1 className="mt-3 font-serif text-[clamp(1.75rem,6vw,2.5rem)] leading-tight text-white">
          {product.name}
        </h1>

        <p className="mt-3 font-mono text-xs tracking-[0.18em] text-white/65">
          SKU · {product.sku}
        </p>

        {product.statusLabel && (
          <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-white/50">
            {product.statusLabel}
          </p>
        )}

        <p className="mt-5 text-2xl font-light tracking-wide text-white">
          {formatPricePrecise(product.price_cents, product.currency)}
        </p>

        {product.description && (
          <p className="mt-6 text-sm leading-7 text-white/75">
            {product.description}
          </p>
        )}

        {showTryOn && (
          <button
            type="button"
            onClick={onTryOn}
            className="mt-8 flex w-full items-center justify-center gap-2 bg-white py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-950 transition hover:bg-neutral-100"
          >
            <span aria-hidden>✨</span>
            Δες το πάνω σου
          </button>
        )}

        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Μέγεθος
            </p>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="text-[10px] uppercase tracking-[0.2em] text-white/80 underline-offset-4 hover:underline"
            >
              Οδηγός μεγεθών
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
                    ? "border-white bg-white text-neutral-950"
                    : "border-white/25 bg-transparent text-white hover:border-white/60"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {sizeError && (
            <p className="mt-3 text-xs text-red-300">
              Επίλεξε μέγεθος πριν την προσθήκη.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-8 w-full border border-white/30 bg-transparent py-4 text-[11px] font-medium uppercase tracking-[0.26em] text-white transition hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.stock === 0
            ? "Εξαντλήθηκε"
            : added
              ? `Προστέθηκε · ${selectedSize}`
              : "Προσθήκη στο καλάθι"}
        </button>

        {added && (
          <p className="mt-3 text-center text-xs text-white/70" aria-live="polite">
            {product.name} · {selectedSize}
          </p>
        )}

        {sections.length > 0 && (
          <ProductAccordion
            sections={sections}
            className="mt-10 divide-y divide-white/10 border-t border-white/10 [&_summary]:text-white/90 [&_p]:text-white/65"
          />
        )}

        <Link
          href={`/product/${product.slug}`}
          className="mt-10 flex w-full items-center justify-center border border-white/20 py-3.5 text-[10px] uppercase tracking-[0.24em] text-white/80 transition hover:border-white/45 hover:text-white"
        >
          Πλήρης σελίδα προϊόντος
        </Link>
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
    </>
  );
}
