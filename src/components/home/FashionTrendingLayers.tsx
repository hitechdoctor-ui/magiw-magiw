"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";

export const TRENDING_FALLBACK_PRODUCTS: ProductDetail[] = [
  {
    id: "look-1",
    slug: "look-1",
    name: "Loose T-shirt",
    description: null,
    price_cents: 8900,
    currency: "EUR",
    sizes: ["S", "M", "L"],
    stock: 1,
    is_active: true,
    sku: "LOOK-1",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "look-2",
    slug: "look-2",
    name: "Polyester Gym Suit",
    description: null,
    price_cents: 12400,
    currency: "EUR",
    sizes: ["S", "M"],
    stock: 1,
    is_active: true,
    sku: "LOOK-2",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "look-3",
    slug: "look-3",
    name: "Sleeveless Crop Top",
    description: null,
    price_cents: 7200,
    currency: "EUR",
    sizes: ["XS", "S", "M"],
    stock: 1,
    is_active: true,
    sku: "LOOK-3",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "look-4",
    slug: "look-4",
    name: "Racerback Sports Top",
    description: null,
    price_cents: 6500,
    currency: "EUR",
    sizes: ["S", "M", "L"],
    stock: 1,
    is_active: true,
    sku: "LOOK-4",
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "look-5",
    slug: "look-5",
    name: "Skirt Set Blazer",
    description: null,
    price_cents: 18900,
    currency: "EUR",
    sizes: ["S", "M"],
    stock: 1,
    is_active: true,
    sku: "LOOK-5",
    images: [
      "https://images.unsplash.com/photo-1539109136881-856be061804d?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "look-6",
    slug: "look-6",
    name: "Crop Top Co-ord",
    description: null,
    price_cents: 11200,
    currency: "EUR",
    sizes: ["S", "M", "L"],
    stock: 1,
    is_active: true,
    sku: "LOOK-6",
    images: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "look-7",
    slug: "look-7",
    name: "Full Sleeve Round Neck",
    description: null,
    price_cents: 9800,
    currency: "EUR",
    sizes: ["M", "L", "XL"],
    stock: 1,
    is_active: true,
    sku: "LOOK-7",
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "look-8",
    slug: "look-8",
    name: "Ribbed Fitted Crop",
    description: null,
    price_cents: 8400,
    currency: "EUR",
    sizes: ["XS", "S", "M"],
    stock: 1,
    is_active: true,
    sku: "LOOK-8",
    images: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80",
    ],
  },
];

function ProductRailCard({ product }: { product: ProductDetail }) {
  const image = product.images[0];
  const href =
    product.slug.startsWith("look-") ? "/shop" : `/product/${product.slug}`;
  const priceLabel = `${formatPricePrecise(product.price_cents, product.currency)} EUR`;

  return (
    <li className="flex w-[30vw] min-w-[5.75rem] shrink-0 flex-col md:w-full md:min-w-0">
      <Link href={href} className="group flex h-full min-h-0 flex-col">
        <div className="relative aspect-[11/16] w-full overflow-hidden rounded-[1.35rem] bg-[#d4d4d4] shadow-[0_14px_32px_rgba(0,0,0,0.11),0_4px_10px_rgba(0,0,0,0.07)] sm:rounded-[1.5rem]">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover object-[center_12%] transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 30vw, 12vw"
            />
          ) : null}
        </div>
        <div className="mt-2 flex h-[2.85rem] shrink-0 flex-col justify-between sm:mt-2.5 sm:h-[3rem]">
          <p
            className="line-clamp-2 h-[2.35em] overflow-hidden text-center text-[8px] font-normal leading-[1.15] text-neutral-950 sm:text-[9px]"
            title={product.name}
          >
            {product.name}
          </p>
          <p className="truncate text-center text-[8px] font-normal tabular-nums leading-none text-neutral-500 sm:text-[9px]">
            {priceLabel}
          </p>
        </div>
      </Link>
    </li>
  );
}

type FashionTrendingLayersProps = {
  phase: MotionValue<number>;
  products?: ProductDetail[];
};

export function FashionTrendingLayers({
  phase,
  products = [],
}: FashionTrendingLayersProps) {
  const { locale } = useLocale();
  const copy = LANDING_COPY[locale].trending;
  const rail =
    products.length > 0 ? products.slice(0, 8) : TRENDING_FALLBACK_PRODUCTS;

  /** Products finish opening before titles fully split — rest of scroll holds layout. */
  const splitEnd = 0.28;
  /** Longer scrub window = smoother product reveal (titles unchanged). */
  const productsOpenEnd = 0.24;

  const easeOut = (t: number) => 1 - (1 - t) ** 2.35;
  const smoothstep = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
  };
  /** Zero slope at start/end — best for scroll-scrubbed scale + fade. */
  const smootherstep = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * x * (x * (6 * x - 15) + 10);
  };
  const productReveal = (p: number) =>
    smootherstep(Math.min(1, Math.max(0, p / productsOpenEnd)));

  /** Closed = one word at center; open = split to edges. */
  const openSpreadVw = 40;

  const leftX = useTransform(phase, (p) => {
    const t = easeOut(Math.min(1, Math.max(0, p / splitEnd)));
    return `${-openSpreadVw * t}vw`;
  });
  const rightX = useTransform(phase, (p) => {
    const t = easeOut(Math.min(1, Math.max(0, p / splitEnd)));
    return `${openSpreadVw * t}vw`;
  });
  const wordFade = useTransform(phase, (p) => {
    if (p <= 0.06) return 1;
    if (p >= splitEnd) return 0.16;
    const t = (p - 0.06) / (splitEnd - 0.06);
    return 1 - t * 0.84;
  });
  const productsOpacity = useTransform(phase, (p) => {
    if (p <= 0) return 0;
    return productReveal(p);
  });
  const productsScale = useTransform(phase, (p) => {
    const t = productReveal(p);
    return 0.06 + (1 - 0.06) * t;
  });

  const titleClassName =
    "shrink-0 select-none whitespace-nowrap font-sans text-[clamp(1.65rem,min(9vw,11vh),6.75rem)] font-semibold uppercase leading-[0.9] tracking-[0.02em]";

  return (
    <div className="flex h-full min-h-[100dvh] flex-col justify-center overflow-x-clip overflow-y-hidden text-neutral-950">
      {/*
        Vertically centers titles + product rail as one block. The rail hangs below the
        title row (~0.28 × rail height ≈ 7vw), so lift the row by that amount.
      */}
      <div
        className="relative w-full"
        style={{ transform: "translateY(calc(-1 * min(7vw, 98px)))" }}
      >
        <div className="relative mx-auto w-full px-[max(0.5rem,1.25vw)]">
          <div className="relative flex min-h-[clamp(3.5rem,14vw,7rem)] items-center justify-center overflow-visible">
            <motion.div
              className="absolute left-1/2 top-1/2 z-[8] w-[min(96vw,1400px)] px-[clamp(0.35rem,1.2vw,1rem)] [backface-visibility:hidden]"
              style={{
                opacity: productsOpacity,
                scale: productsScale,
                x: "-50%",
                y: "-22%",
                transformOrigin: "50% 50%",
                willChange: "transform, opacity",
              }}
            >
              <ul className="mx-auto flex w-full items-stretch justify-center gap-[clamp(0.35rem,0.75vw,0.75rem)] overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-8 md:items-stretch md:overflow-visible [&::-webkit-scrollbar]:hidden">
                {rail.map((product) => (
                  <ProductRailCard key={product.id} product={product} />
                ))}
              </ul>
              <div className="mt-4 flex justify-center md:mt-5">
                <Link
                  href="/shop"
                  className="pointer-events-auto text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-600 transition hover:text-neutral-950"
                >
                  {copy.viewAll}
                </Link>
              </div>
            </motion.div>

            <motion.span
              className={`relative z-10 ${titleClassName}`}
              style={{ x: leftX, opacity: wordFade }}
            >
              {copy.wordLeft}
            </motion.span>
            <motion.span
              className={`relative z-10 ${titleClassName}`}
              style={{ x: rightX, opacity: wordFade }}
            >
              {copy.wordRight}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}
