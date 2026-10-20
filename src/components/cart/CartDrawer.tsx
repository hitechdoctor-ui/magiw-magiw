"use client";

import { CartLineList } from "@/components/cart/CartLineList";
import { useCart } from "@/components/cart/CartProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";
import { useEffect } from "react";

export function CartDrawer() {
  const {
    lines,
    cartOpen,
    setCartOpen,
    removeLine,
    subtotalCents,
    currency,
    count,
  } = useCart();
  const { t } = useLocale();

  useEffect(() => {
    if (!cartOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label={t("cartCloseOverlay")}
        onClick={() => setCartOpen(false)}
      />

      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-[#faf8f5] shadow-2xl"
        role="dialog"
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-neutral-400">
              MAGIW MAGIW
            </p>
            <h2
              id="cart-drawer-title"
              className="mt-1 font-serif text-xl text-neutral-950"
            >
              {t("cartTitle", { count })}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="text-2xl leading-none text-neutral-400 transition hover:text-neutral-900"
            aria-label={t("cartClose")}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <CartLineList lines={lines} onRemove={removeLine} />
        </div>

        <div className="border-t border-stone-200 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
              {t("cartSubtotal")}
            </p>
            <p className="font-mono text-lg text-neutral-950">
              {formatPricePrecise(subtotalCents, currency)}
            </p>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {t("cartShippingNote")}
          </p>

          <Link
            href="/cart"
            onClick={() => setCartOpen(false)}
            className={`mt-5 block w-full py-4 text-center text-[11px] font-medium uppercase tracking-[0.26em] transition ${
              count > 0
                ? "bg-neutral-950 text-white hover:bg-neutral-800"
                : "pointer-events-none bg-neutral-200 text-neutral-400"
            }`}
            aria-disabled={count === 0}
          >
            {t("cartView")}
          </Link>

          <Link
            href="/checkout"
            onClick={() => setCartOpen(false)}
            className={`mt-3 block w-full border border-neutral-900 py-4 text-center text-[11px] font-medium uppercase tracking-[0.26em] text-neutral-900 transition hover:bg-neutral-950 hover:text-white ${
              count === 0
                ? "pointer-events-none border-neutral-200 text-neutral-300"
                : ""
            }`}
            aria-disabled={count === 0}
          >
            {t("cartCheckoutSoon")}
          </Link>
        </div>
      </aside>
    </div>
  );
}
