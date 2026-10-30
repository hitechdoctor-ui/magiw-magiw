"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

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

/** power1.out — same curve as the scrubbed GSAP tweens of the reference. */
const easeOut = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) * (1 - x);
};

const smoothstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

/** Phase where the cards reach their row slots (still turned). */
const SPREAD_END = 0.55;
/** Phase where the turned cards start opening flat. */
const FLATTEN_START = 0.66;
/** Bookshelf turn held between spreading and opening. */
const SHELF_ANGLE = 30;

function ProductRailCardContent({ product }: { product: ProductDetail }) {
  const image = product.images[0];
  const href =
    product.slug.startsWith("look-") ? "/shop" : `/product/${product.slug}`;
  const priceLabel = `${formatPricePrecise(product.price_cents, product.currency)} EUR`;

  return (
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
  );
}

function TrendingCard({
  product,
  index,
  count,
  step,
  phase,
}: {
  product: ProductDetail;
  index: number;
  count: number;
  step: number;
  phase: MotionValue<number>;
}) {
  /** Closed = every card stacked on the row center, turned away in depth. */
  const stackX = -(index - (count - 1) / 2) * step;

  /** Spread first while still turned like books on a shelf, then open flat at the end. */
  const spread = (p: number) => easeOut(p / SPREAD_END);
  const x = useTransform(phase, (p) => stackX * (1 - spread(p)));
  const z = useTransform(phase, (p) => index * 10 * (1 - spread(p)));
  const rotateY = useTransform(phase, (p) => {
    if (p < SPREAD_END) {
      return 70 - (70 - SHELF_ANGLE) * spread(p);
    }
    return SHELF_ANGLE * (1 - smoothstep((p - FLATTEN_START) / (1 - FLATTEN_START)));
  });
  const scale = useTransform(phase, (p) => 0.5 + 0.5 * spread(p));
  const opacity = useTransform(phase, (p) => easeOut(p / 0.45));

  return (
    <motion.li
      className="flex min-w-0 flex-col"
      style={{
        x,
        z,
        rotateY,
        scale,
        opacity,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      <ProductRailCardContent product={product} />
    </motion.li>
  );
}

type FashionTrendingLayersProps = {
  /** 0 = one word, products stacked; 1 = word split off-screen, products in a row. */
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

  const railRef = useRef<HTMLUListElement>(null);
  const [step, setStep] = useState(0);

  useLayoutEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const measure = () => {
      const first = el.children[0] as HTMLElement | undefined;
      const second = el.children[1] as HTMLElement | undefined;
      if (!first) return;
      setStep(second ? second.offsetLeft - first.offsetLeft : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rail.length]);

  const leftX = useTransform(phase, (p) => `${-50 * easeOut(p)}vw`);
  const rightX = useTransform(phase, (p) => `${50 * easeOut(p)}vw`);
  const wordOpacity = useTransform(phase, (p) => 1 - easeOut(p));
  const linkOpacity = useTransform(phase, (p) => easeOut((p - 0.6) / 0.4));

  const titleClassName =
    "select-none whitespace-nowrap font-sans text-[clamp(1.65rem,min(6.6vw,11vh),6.75rem)] font-normal uppercase leading-[0.9] tracking-[0.01em] [grid-row:1]";

  return (
    <div className="overflow-hidden px-[max(0.5rem,1.25vw)] py-[clamp(1.75rem,5vh,3.5rem)] text-neutral-950">
      <div className="grid grid-cols-2 items-center">
        <motion.span
          className={`${titleClassName} [grid-column:1] justify-self-end`}
          style={{ x: leftX, opacity: wordOpacity }}
        >
          {copy.wordLeft}
        </motion.span>
        <motion.span
          className={`${titleClassName} [grid-column:2] justify-self-start`}
          style={{ x: rightX, opacity: wordOpacity }}
        >
          {copy.wordRight}
        </motion.span>

        <ul
          ref={railRef}
          className="pointer-events-none z-[1] mx-auto grid gap-[clamp(0.35rem,0.75vw,1.25rem)] [grid-column:1/3] [grid-row:1] [&_a]:pointer-events-auto"
          style={{
            width: `min(90vw, ${rail.length * 11}rem)`,
            gridTemplateColumns: `repeat(${rail.length}, minmax(0, 1fr))`,
            transformStyle: "preserve-3d",
          }}
        >
          {rail.map((product, index) => (
            <TrendingCard
              key={product.id}
              product={product}
              index={index}
              count={rail.length}
              step={step}
              phase={phase}
            />
          ))}
        </ul>
      </div>

      <motion.div
        className="mt-3 flex justify-center md:mt-4"
        style={{ opacity: linkOpacity }}
      >
        <Link
          href="/shop"
          className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-600 transition hover:text-neutral-950"
        >
          {copy.viewAll}
        </Link>
      </motion.div>
    </div>
  );
}
