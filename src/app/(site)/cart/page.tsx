"use client";

import { CartLineList } from "@/components/cart/CartLineList";
import { useCart } from "@/components/cart/CartProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";

export default function CartPage() {
  const { lines, removeLine, clearCart, subtotalCents, currency, count } =
    useCart();
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
        <Link
          href="/shop"
          className="text-[10px] uppercase tracking-[0.32em] text-neutral-400 transition hover:text-neutral-700"
        >
          {t("cartPageContinue")}
        </Link>

        <p className="mt-8 text-[10px] uppercase tracking-[0.35em] text-neutral-400">
          MAGIW MAGIW · eShop
        </p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-neutral-950 sm:text-4xl">
          {t("cartPageTitle")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {count === 0
            ? t("cartPageEmptyHint")
            : count === 1
              ? t("cartPageItemsOne")
              : t("cartPageItemsMany", { count })}
        </p>

        <div className="mt-10 rounded-sm border border-stone-200 bg-white px-5 py-2 sm:px-6">
          <CartLineList lines={lines} onRemove={removeLine} />
        </div>

        {count > 0 && (
          <div className="mt-8 border-t border-stone-200 pt-8">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                {t("cartSubtotal")}
              </p>
              <p className="font-mono text-2xl text-neutral-950">
                {formatPricePrecise(subtotalCents, currency)}
              </p>
            </div>

            <Link
              href="/checkout"
              className="mt-8 block w-full bg-neutral-950 py-4 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-white transition hover:bg-neutral-800"
            >
              {t("cartPageCheckout")}
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="mt-4 w-full py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-400 transition hover:text-neutral-800"
            >
              {t("cartPageClear")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
