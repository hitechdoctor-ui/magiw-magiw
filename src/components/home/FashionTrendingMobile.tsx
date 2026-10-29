"use client";

import {
  TRENDING_FALLBACK_PRODUCTS,
} from "@/components/home/FashionTrendingLayers";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";

type FashionTrendingMobileProps = {
  products?: ProductDetail[];
};

function MobileProductCard({ product }: { product: ProductDetail }) {
  const image = product.images[0];
  const href =
    product.slug.startsWith("look-") ? "/shop" : `/product/${product.slug}`;
  const priceLabel = `${formatPricePrecise(product.price_cents, product.currency)} EUR`;

  return (
    <li className="w-[min(42vw,11rem)] shrink-0 snap-start">
      <Link href={href} className="block">
        <div className="relative aspect-[11/16] overflow-hidden rounded-2xl bg-[#d4d4d4] shadow-[0_10px_24px_rgba(0,0,0,0.1)]">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover object-[center_12%]"
              sizes="45vw"
            />
          ) : null}
        </div>
        <p
          className="mt-2 line-clamp-2 text-center text-[10px] leading-snug text-neutral-950"
          title={product.name}
        >
          {product.name}
        </p>
        <p className="mt-1 truncate text-center text-[10px] text-neutral-500">
          {priceLabel}
        </p>
      </Link>
    </li>
  );
}

/** Phone layout: no scroll-scrub / split-title effects (see `md:` desktop sequence). */
export function FashionTrendingMobile({
  products = [],
}: FashionTrendingMobileProps) {
  const { locale } = useLocale();
  const copy = LANDING_COPY[locale].trending;
  const rail =
    products.length > 0 ? products.slice(0, 8) : TRENDING_FALLBACK_PRODUCTS;

  return (
    <section
      className="bg-[#eceae5] px-4 py-12 text-neutral-950 md:hidden"
      aria-label={copy.ariaLabel}
    >
      <h2 className="text-center font-sans text-xl font-semibold uppercase tracking-[0.12em]">
        {copy.mobileTitle}
      </h2>
      <ul className="mt-8 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rail.map((product) => (
          <MobileProductCard key={product.id} product={product} />
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <Link
          href="/shop"
          className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-600"
        >
          {copy.viewAll}
        </Link>
      </div>
    </section>
  );
}
