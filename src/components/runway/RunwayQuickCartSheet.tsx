"use client";

import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";

type RunwayQuickCartSheetProps = {
  product: ProductDetail;
  onSelect: (size: string) => void;
  onClose: () => void;
};

export function RunwayQuickCartSheet({
  product,
  onSelect,
  onClose,
}: RunwayQuickCartSheetProps) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl border border-white/10 bg-neutral-950 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:rounded-2xl"
        role="dialog"
        aria-labelledby="runway-cart-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p
          id="runway-cart-title"
          className="text-[10px] uppercase tracking-[0.32em] text-white/50"
        >
          Μέγεθος
        </p>
        <p className="mt-2 font-serif text-xl text-white">{product.name}</p>
        <p className="mt-1 text-sm text-white/60">
          {formatPricePrecise(product.price_cents, product.currency)}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              disabled={product.stock === 0}
              onClick={() => onSelect(size)}
              className="min-w-14 border border-white/25 px-5 py-2.5 text-sm text-white transition hover:border-white hover:bg-white/10 disabled:opacity-40"
            >
              {size}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-2 text-[10px] uppercase tracking-[0.28em] text-white/55 hover:text-white/80"
        >
          Κλείσιμο
        </button>
      </div>
    </div>
  );
}
