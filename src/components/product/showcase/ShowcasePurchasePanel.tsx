"use client";

import { useCart } from "@/components/cart/CartProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { VirtualTryOnCta } from "@/components/product/VirtualTryOnCta";
import { colorSwatchHex, colorSwatchNeedsBorder } from "@/lib/products/color-swatches";
import { PRODUCT_PAGE_COPY } from "@/lib/product/productPageCopy";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ShowcasePurchasePanelProps = {
  product: ProductDetail;
  styleWithPartner?: ProductDetail | null;
  selectedColor: string;
  onSelectedColorChange: (color: string) => void;
  onOpenSizeGuide: () => void;
  onOpenTryOn?: () => void;
};

const SHARE_NETWORKS = ["Facebook", "X", "Pinterest", "Telegram", "WhatsApp", "Email"] as const;
type ShareNetwork = (typeof SHARE_NETWORKS)[number];

function shareHref(network: ShareNetwork, url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  switch (network) {
    case "Facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "X":
      return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    case "Pinterest":
      return `https://pinterest.com/pin/create/button/?url=${u}&description=${t}`;
    case "Telegram":
      return `https://t.me/share/url?url=${u}&text=${t}`;
    case "WhatsApp":
      return `https://wa.me/?text=${t}%20${u}`;
    case "Email":
      return `mailto:?subject=${t}&body=${u}`;
  }
}

function ShareIcon({ network }: { network: ShareNetwork }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (network) {
    case "Facebook":
      return (
        <svg {...common}>
          <path d="M15 4h-2.5A3.5 3.5 0 0 0 9 7.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V8a1 1 0 0 1 1-1H15z" />
        </svg>
      );
    case "X":
      return (
        <svg {...common}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      );
    case "Pinterest":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M10.5 20l1.8-8.5M10.2 13.5c.4 1 1.3 1.5 2.3 1.5 2 0 3.3-1.8 3.3-4a3.8 3.8 0 0 0-7.6-.2" />
        </svg>
      );
    case "Telegram":
      return (
        <svg {...common}>
          <path d="M21 4L3 11.2l6.2 2.1L18 7.5l-6.6 7.2 7 5.3z" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg {...common}>
          <path d="M4 20l1.3-4A8.5 8.5 0 1 1 8.4 19z" />
          <path d="M9 9.5c.3 2.3 2.2 4.3 4.5 4.8l1-1.2 1.8.8" />
        </svg>
      );
    case "Email":
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
          <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
        </svg>
      );
  }
}

export function ShowcasePurchasePanel({
  product,
  styleWithPartner,
  selectedColor,
  onSelectedColorChange,
  onOpenSizeGuide,
  onOpenTryOn,
}: ShowcasePurchasePanelProps) {
  const { locale, t } = useLocale();
  const copy = PRODUCT_PAGE_COPY[locale];
  const { addProduct } = useCart();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [added, setAdded] = useState(false);

  const colorOptions = product.colors ?? [];
  const soldOut = product.stock === 0;
  const maxQuantity = Math.max(1, Math.min(product.stock || 1, 10));

  const addToCart = (openCart: boolean) => {
    if (colorOptions.length > 0 && !selectedColor) {
      setColorError(true);
      return false;
    }
    if (!selectedSize) {
      setSizeError(true);
      return false;
    }
    for (let i = 0; i < quantity; i += 1) {
      addProduct(product, selectedSize, {
        color: selectedColor || undefined,
        openCart: openCart && i === quantity - 1,
      });
    }
    setAdded(true);
    setSizeError(false);
    window.setTimeout(() => setAdded(false), 2800);
    return true;
  };

  const stockLabel = soldOut
    ? copy.outOfStock
    : product.stock <= 3
      ? copy.lowStock.replace("{count}", String(product.stock))
      : copy.inStock;

  return (
    <div className="flex flex-col text-neutral-900">
      <h1 className="text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-tight tracking-tight">{product.name}</h1>
      <p className="mt-2 text-xl font-semibold tracking-tight">
        {formatPricePrecise(product.price_cents, product.currency)} {product.currency}
      </p>
      <p className="mt-1.5 text-xs text-neutral-500">
        {copy.taxesIncluded}{" "}
        <Link href="/legal/shipping" className="underline underline-offset-2 hover:text-neutral-900">
          {copy.shippingLink}
        </Link>{" "}
        {copy.shippingAtCheckout}
      </p>
      {product.statusLabel && (
        <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-neutral-500">{product.statusLabel}</p>
      )}

      {onOpenTryOn && (
        <div className="mt-6">
          <VirtualTryOnCta onClick={onOpenTryOn} />
        </div>
      )}

      {colorOptions.length > 0 && (
        <div className="mt-6 border-t border-neutral-200 pt-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-700">
            {copy.color} : <span className="text-neutral-950">{selectedColor || "—"}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colorOptions.map((color) => {
              const active = selectedColor === color;
              const image = product.colorImages?.[color];
              const hex = colorSwatchHex(color);
              return (
                <button
                  key={color}
                  type="button"
                  title={color}
                  aria-label={color}
                  aria-pressed={active}
                  onClick={() => {
                    onSelectedColorChange(color);
                    setColorError(false);
                  }}
                  className={`relative h-14 w-12 overflow-hidden rounded-md border-2 transition ${
                    active ? "border-neutral-950" : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {image ? (
                    <Image src={image} alt="" fill sizes="48px" className="object-cover object-top" />
                  ) : (
                    <span
                      className="absolute inset-1.5 rounded"
                      style={{
                        backgroundColor: hex,
                        border: colorSwatchNeedsBorder(hex) ? "1px solid rgba(0,0,0,0.12)" : undefined,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {colorError && <p className="mt-2 text-xs text-red-700">{t("productColorError")}</p>}
        </div>
      )}

      <div className={`${colorOptions.length > 0 ? "mt-5" : "mt-6 border-t border-neutral-200 pt-6"}`}>
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-700">
            {copy.size} : <span className="text-neutral-950">{selectedSize || "—"}</span>
          </p>
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="flex items-center gap-1.5 text-[11px] text-neutral-600 underline-offset-4 transition hover:text-neutral-950 hover:underline"
          >
            {copy.sizeChart}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((size) => {
            const active = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelectedSize(size);
                  setSizeError(false);
                }}
                className={`min-w-11 rounded-md border px-3.5 py-2 text-xs transition ${
                  active
                    ? "border-neutral-700 bg-neutral-700 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-600"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
        {sizeError && <p className="mt-2 text-xs text-red-700">{t("productSizeError")}</p>}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-medium text-neutral-700">{copy.quantity}</p>
        <div className="mt-2 inline-flex items-center rounded-md border border-neutral-300">
          <button
            type="button"
            aria-label={copy.decrease}
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-10 w-10 text-lg text-neutral-700 transition hover:text-neutral-950 disabled:text-neutral-300"
          >
            −
          </button>
          <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label={copy.increase}
            disabled={quantity >= maxQuantity}
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            className="h-10 w-10 text-lg text-neutral-700 transition hover:text-neutral-950 disabled:text-neutral-300"
          >
            +
          </button>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-neutral-700">
        <span
          aria-hidden
          className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ${
            soldOut ? "bg-red-600" : product.stock <= 3 ? "bg-amber-500" : "bg-emerald-600"
          }`}
        >
          {soldOut ? "×" : "✓"}
        </span>
        {stockLabel}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-600">
        <span className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7" />
            <circle cx="6" cy="17.5" r="1.6" />
            <circle cx="16.5" cy="17.5" r="1.6" />
          </svg>
          {copy.freeDelivery}
        </span>
        <span className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
          </svg>
          {copy.easyReturns}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3 text-xs text-neutral-600">
        <span>{copy.social}:</span>
        <div className="flex items-center gap-2.5">
          {SHARE_NETWORKS.map((network) => (
            <a
              key={network}
              href="#"
              onClick={(event) => {
                event.currentTarget.href = shareHref(network, window.location.href, product.name);
              }}
              target={network === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={copy.shareOn.replace("{network}", network)}
              className="text-neutral-800 transition hover:text-neutral-500"
            >
              <ShareIcon network={network} />
            </a>
          ))}
        </div>
      </div>

      {styleWithPartner && (
        <button
          type="button"
          onClick={() =>
            document.getElementById("style-with-look")?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="mt-6 w-full rounded-full border border-neutral-900 py-3 text-[12px] font-medium uppercase tracking-[0.18em] transition hover:bg-neutral-950 hover:text-white"
        >
          {t("productStyleWith")}
        </button>
      )}

      <div className={`${styleWithPartner ? "mt-3" : "mt-6"} grid grid-cols-2 gap-3`}>
        <button
          type="button"
          disabled={soldOut}
          onClick={() => addToCart(true)}
          className="rounded-full bg-neutral-200 py-3.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-300 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-white"
        >
          {soldOut ? copy.soldOut : added ? t("productAdded", { size: selectedSize }) : copy.addToCart}
        </button>
        <button
          type="button"
          disabled={soldOut}
          onClick={() => {
            if (addToCart(false)) router.push("/checkout");
          }}
          className="rounded-full bg-neutral-950 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {copy.buyNow}
        </button>
      </div>

      <p className="mt-4 font-mono text-[10px] tracking-wider text-neutral-400">SKU · {product.sku}</p>
    </div>
  );
}
