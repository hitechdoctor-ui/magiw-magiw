"use client";

import { useCart } from "@/components/cart/CartProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { VirtualTryOnCta } from "@/components/product/VirtualTryOnCta";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";
import type { ProductDetail } from "@/lib/types/database";
import {
  colorSwatchHex,
  colorSwatchNeedsBorder,
} from "@/lib/products/color-swatches";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";
import { useState } from "react";

type ProductPurchasePanelProps = {
  product: ProductDetail;
  styleWithPartner?: ProductDetail | null;
  selectedColor?: string;
  onSelectedColorChange?: (color: string) => void;
};

export function ProductPurchasePanel({
  product,
  styleWithPartner,
  selectedColor: selectedColorProp,
  onSelectedColorChange,
}: ProductPurchasePanelProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColorInternal, setSelectedColorInternal] = useState("");
  const selectedColor = selectedColorProp ?? selectedColorInternal;
  const setSelectedColor = (color: string) => {
    onSelectedColorChange?.(color);
    if (selectedColorProp === undefined) {
      setSelectedColorInternal(color);
    }
  };
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const { addProduct } = useCart();
  const { t } = useLocale();

  const colorOptions = product.colors ?? [];

  const handleAddToCart = () => {
    if (colorOptions.length > 0 && !selectedColor) {
      setColorError(true);
      return;
    }
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    addProduct(product, selectedSize, {
      color: selectedColor || undefined,
    });
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
          {t("productBackFeed")}
        </Link>

        <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
          {t("productAtelier")}
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

        {colorOptions.length > 0 && (
          <div className="mt-10 border-t border-stone-200 pt-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              {t("productColor")}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {colorOptions.map((color) => {
                const active = selectedColor === color;
                const hex = colorSwatchHex(color);
                const lightFill = colorSwatchNeedsBorder(hex);
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setColorError(false);
                    }}
                    aria-pressed={active}
                    className={`flex min-w-[7.5rem] items-center gap-3 border-2 px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "border-neutral-900 bg-stone-50 shadow-sm"
                        : "border-stone-200 bg-white text-neutral-600 hover:border-stone-400"
                    }`}
                    style={active ? { borderColor: hex } : undefined}
                  >
                    <span
                      className={`inline-block h-7 w-7 shrink-0 rounded-full transition-transform ${
                        active ? "scale-105 ring-2 ring-neutral-900 ring-offset-2" : ""
                      }`}
                      style={{
                        backgroundColor: hex,
                        border: lightFill
                          ? "1px solid rgba(0,0,0,0.12)"
                          : "1px solid rgba(255,255,255,0.35)",
                      }}
                      aria-hidden
                    />
                    <span
                      className={
                        active ? "font-medium text-neutral-950" : "text-neutral-700"
                      }
                    >
                      {color}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedColor &&
              colorOptions.length > 1 &&
              !product.colorImages?.[selectedColor] && (
                <p className="mt-3 text-xs text-amber-900">
                  {t("productColorNoPhoto")}
                </p>
              )}
            {selectedColor && (
              <p className="mt-4 flex items-center gap-2 text-sm text-neutral-800">
                <span
                  className="inline-block h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: colorSwatchHex(selectedColor),
                    border: colorSwatchNeedsBorder(colorSwatchHex(selectedColor))
                      ? "1px solid rgba(0,0,0,0.12)"
                      : undefined,
                  }}
                  aria-hidden
                />
                <span>
                  {t("productColorSelected")}:{" "}
                  <strong className="font-medium">{selectedColor}</strong>
                </span>
              </p>
            )}
            {colorError && (
              <p className="mt-3 text-xs text-red-700">{t("productColorError")}</p>
            )}
          </div>
        )}

        <div
          className={`border-t border-stone-200 pt-8 ${colorOptions.length > 0 ? "mt-8" : "mt-10"}`}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              {t("productSize")}
            </p>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 underline-offset-4 transition hover:text-neutral-800 hover:underline"
            >
              {t("productSizeGuide")}
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
              {t("productSizeError")}
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
            {t("productStyleWith")}
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
            ? t("productSoldOut")
            : added
              ? t("productAdded", {
                  size: selectedColor
                    ? `${selectedSize} · ${selectedColor}`
                    : selectedSize,
                })
              : t("productAddToCart")}
        </button>

        {added && (
          <p className="mt-4 text-sm text-neutral-700" aria-live="polite">
            {t("cartAdded", {
              name: product.name,
              size: selectedColor
                ? `${selectedSize} · ${selectedColor}`
                : selectedSize,
              price: formatPricePrecise(product.price_cents, product.currency),
            })}
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
