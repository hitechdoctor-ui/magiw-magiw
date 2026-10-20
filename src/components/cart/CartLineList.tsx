"use client";

import type { CartLine } from "@/components/cart/CartProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";

type CartLineListProps = {
  lines: CartLine[];
  onRemove: (id: string) => void;
  emptyMessage?: string;
};

export function CartLineList({
  lines,
  onRemove,
  emptyMessage,
}: CartLineListProps) {
  const { t } = useLocale();

  if (lines.length === 0) {
    return (
      <p className="py-8 text-center text-sm leading-relaxed text-neutral-500">
        {emptyMessage ?? t("cartEmpty")}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-stone-200">
      {lines.map((line) => (
        <li key={line.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
          <Link
            href={`/product/${line.productSlug}`}
            className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone-100"
          >
            {line.imageUrl ? (
              <Image
                src={line.imageUrl}
                alt=""
                fill
                className="object-cover object-center"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-neutral-400">
                MAGIW
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              href={`/product/${line.productSlug}`}
              className="font-serif text-base leading-snug text-neutral-950 hover:underline"
            >
              {line.productName}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
              {t("cartSize", { size: line.size })}
            </p>
            <p className="mt-2 font-mono text-sm text-neutral-800">
              {formatPricePrecise(line.price_cents, line.currency)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(line.id)}
            className="shrink-0 self-start text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition hover:text-neutral-900"
            aria-label={t("cartRemoveAria", { name: line.productName })}
          >
            {t("cartRemove")}
          </button>
        </li>
      ))}
    </ul>
  );
}
