"use client";

import { useCart } from "@/components/cart/CartProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ProductGallery } from "@/components/product/ProductGallery";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type StyleWithLookSectionProps = {
  current: ProductDetail;
  partner: ProductDetail;
  galleryImages: string[];
};

export function StyleWithLookSection({
  current,
  partner,
  galleryImages,
}: StyleWithLookSectionProps) {
  const pieces = [current, partner];
  const { addLines } = useCart();
  const { t } = useLocale();
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [bundleError, setBundleError] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);

  const bundleTotalCents = current.price_cents + partner.price_cents;
  const currency = current.currency;

  const handleBundleAddToCart = () => {
    const missing = pieces.some((piece) => !sizes[piece.slug]);
    if (missing) {
      setBundleError(true);
      return;
    }

    addLines(
      pieces.map((piece) => ({
        productSlug: piece.slug,
        productName: piece.name,
        size: sizes[piece.slug]!,
        price_cents: piece.price_cents,
        currency: piece.currency,
        imageUrl: piece.images[0],
      })),
    );
    setBundleError(false);
    setBundleAdded(true);
    window.setTimeout(() => setBundleAdded(false), 3200);
  };

  return (
    <section
      id="style-with-look"
      className="mt-10 scroll-mt-24 border-t border-stone-200 pt-6 lg:mt-12 lg:pt-8"
    >
      <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
        {t("styleWithEyebrow")}
      </p>
      <h2 className="mt-3 font-serif text-2xl tracking-tight text-neutral-950 sm:text-3xl">
        {t("styleWithTitle")}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600">
        {t("styleWithIntro", {
          current: current.name,
          partner: partner.name,
        })}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {pieces.map((piece) => (
          <Link
            key={piece.slug}
            href={`/product/${piece.slug}`}
            className={`group flex gap-4 border bg-white p-4 transition hover:border-neutral-900 ${
              piece.slug === current.slug
                ? "border-neutral-900 ring-1 ring-neutral-900 ring-offset-2 ring-offset-[#faf8f5]"
                : "border-stone-200"
            }`}
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone-100">
              <Image
                src={piece.images[0]}
                alt={piece.name}
                fill
                className="object-cover object-center"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                {piece.slug === current.slug
                  ? t("styleWithThisPiece")
                  : t("styleWithPairWith")}
              </p>
              <p className="mt-1 font-serif text-lg leading-snug text-neutral-950 group-hover:underline">
                {piece.name}
              </p>
              <p className="mt-1 font-mono text-xs text-neutral-600">
                {formatPricePrecise(piece.price_cents, piece.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-3xl border border-stone-200 bg-white p-5 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
          {t("bundleEyebrow")}
        </p>
        <p className="mt-2 font-serif text-lg text-neutral-950">
          {t("bundleTitle")}
        </p>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {pieces.map((piece) => (
            <div key={`bundle-size-${piece.slug}`}>
              <p className="text-xs leading-snug text-neutral-700">{piece.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {piece.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSizes((prev) => ({ ...prev, [piece.slug]: size }));
                      setBundleError(false);
                    }}
                    className={`min-w-12 border px-4 py-2 text-sm transition ${
                      sizes[piece.slug] === size
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-stone-300 bg-[#faf8f5] text-neutral-700 hover:border-neutral-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {bundleError && (
          <p className="mt-4 text-xs text-red-700">
            {t("bundleSizeError")}
          </p>
        )}

        <button
          type="button"
          onClick={handleBundleAddToCart}
          disabled={pieces.some((p) => p.stock === 0)}
          className="mx-auto mt-5 block w-full max-w-md bg-neutral-950 py-4 text-[11px] font-medium uppercase tracking-[0.26em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {bundleAdded
            ? t("cartAddedBundle")
            : t("bundleAdd", {
                price: formatPricePrecise(bundleTotalCents, currency),
              })}
        </button>
      </div>

      <div className="mt-6 w-full">
        <ProductGallery
          layout="stack"
          images={galleryImages}
          productName={`${current.name} + ${partner.name}`}
        />
      </div>
    </section>
  );
}
