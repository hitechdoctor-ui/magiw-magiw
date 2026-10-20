"use client";

import { useCart } from "@/components/cart/CartProvider";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { VirtualTryOnCta } from "@/components/product/VirtualTryOnCta";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";
import { useState } from "react";

type ProductPurchasePanelProps = {
  product: ProductDetail;
  styleWithPartner?: ProductDetail | null;
};

export function ProductPurchasePanel({
  product,
  styleWithPartner,
}: ProductPurchasePanelProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const { addProduct } = useCart();

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

  const sections = product.sections ?? [];
  const showTryOn = product.showVirtualTryOn === true;

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

        <p className="mt-3 font-mono text-sm tracking-wider text-neutral-700">
          SKU · <span className="text-neutral-900">{product.sku}</span>
        </p>

        {product.statusLabel && (
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-neutral-600">
            {product.statusLabel}
          </p>
        )}

        <p className="mt-6 text-2xl font-light tracking-wide text-neutral-900">
          {formatPricePrecise(product.price_cents, product.currency)}
        </p>

        {showTryOn && (
          <div className="mt-8">
            <VirtualTryOnCta onClick={() => setTryOnOpen(true)} />
          </div>
        )}

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

        {styleWithPartner && (
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("style-with-look")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="mt-8 w-full border-2 border-neutral-900 bg-white py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-900 transition hover:bg-neutral-950 hover:text-white"
          >
            Συνδύασέ το
          </button>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full bg-neutral-950 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 ${
            styleWithPartner ? "mt-3" : "mt-8"
          }`}
        >
          {product.stock === 0
            ? "Εξαντλήθηκε"
            : added
              ? `Προστέθηκε · ${selectedSize}`
              : "ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ"}
        </button>

        {added && (
          <p className="mt-4 text-sm text-neutral-700" aria-live="polite">
            Προστέθηκε: {product.name} · {selectedSize} ·{" "}
            {formatPricePrecise(product.price_cents, product.currency)}
          </p>
        )}

        {sections.length > 0 && (
          <ProductAccordion
            sections={sections}
            className={showTryOn ? "pb-24 lg:pb-0" : undefined}
          />
        )}
      </div>

      {showTryOn && !tryOnOpen && (
        <VirtualTryOnCta
          variant="sticky"
          onClick={() => setTryOnOpen(true)}
        />
      )}

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
              customFitNote:
                "Για custom fit, επικοινώνησε με το ατελιέ MAGIW MAGIW.",
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
    </>
  );
}
