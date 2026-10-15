"use client";

import { ProductAccordion } from "@/components/product/ProductAccordion";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";
import { useState } from "react";

type ProductPurchasePanelProps = {
  product: ProductDetail;
};

function AiSparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        d="M12 3l1.2 4.2L17.5 8.5 13.2 9.7 12 14l-1.2-4.3L6.5 8.5l4.3-1.3L12 3Z"
        strokeLinejoin="round"
      />
      <path d="M5 16l.6 2.1L7.7 19l-2.1.6L5 22l-.6-2.4L2.3 19l2.1-.9L5 16Z" />
    </svg>
  );
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [tryOnNote, setTryOnNote] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setAdded(true);
    setSizeError(false);
    window.setTimeout(() => setAdded(false), 2800);
  };

  const sections = product.sections ?? [];

  return (
    <>
      <div className="flex flex-col lg:max-w-md">
        <Link
          href="/"
          className="mb-8 text-[10px] uppercase tracking-[0.32em] text-neutral-400 transition hover:text-neutral-700"
        >
          ← Επιστροφή στο Feed
        </Link>

        <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
          MAGIW MAGIW · Atelier
        </p>
        <h1 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-neutral-950 sm:text-4xl">
          {product.name}
        </h1>

        {product.sku && (
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-neutral-400">
            SKU · {product.sku}
          </p>
        )}

        {product.statusLabel && (
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-neutral-600">
            {product.statusLabel}
          </p>
        )}

        <p className="mt-6 text-2xl font-light tracking-wide text-neutral-900">
          {formatPricePrecise(product.price_cents, product.currency)}
        </p>

        <div className="mt-10 border-t border-stone-200 pt-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Μέγεθος
            </p>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 underline-offset-4 transition hover:text-neutral-800 hover:underline"
            >
              Οδηγός Μεγεθών
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
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-stone-300 bg-white text-neutral-700 hover:border-neutral-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {sizeError && (
            <p className="mt-3 text-xs text-red-700">
              Επίλεξε μέγεθος πριν την προσθήκη στο καλάθι.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-8 w-full bg-neutral-950 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {product.stock === 0
            ? "Εξαντλήθηκε"
            : added
              ? `Προστέθηκε · ${selectedSize}`
              : "ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ"}
        </button>

        {product.showVirtualTryOn && (
          <button
            type="button"
            onClick={() => {
              setTryOnNote(true);
              window.setTimeout(() => setTryOnNote(false), 2600);
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 border border-stone-300 bg-white py-4 text-[11px] uppercase tracking-[0.22em] text-neutral-800 transition hover:border-neutral-500"
          >
            <AiSparkleIcon />
            Δες το πάνω σου (Virtual Try-On)
          </button>
        )}

        {tryOnNote && product.showVirtualTryOn && (
          <p className="mt-3 text-xs text-neutral-500" aria-live="polite">
            Το Virtual Try-On έρχεται σύντομα — AI preview για το σετ σου.
          </p>
        )}

        {added && (
          <p className="mt-4 text-sm text-neutral-700" aria-live="polite">
            Προστέθηκε: {product.name} · {selectedSize} ·{" "}
            {formatPricePrecise(product.price_cents, product.currency)}
          </p>
        )}

        {sections.length > 0 && <ProductAccordion sections={sections} />}
      </div>

      {sizeGuideOpen && (
        <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />
      )}
    </>
  );
}
