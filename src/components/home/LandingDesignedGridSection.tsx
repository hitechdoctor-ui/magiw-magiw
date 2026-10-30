"use client";

import { TRENDING_FALLBACK_PRODUCTS } from "@/components/home/FashionTrendingLayers";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

/** Pinned scroll length after the first screen. */
const PIN_VH = 175;
/** Dark space after the pin so the lower grid row scrolls out instead of being cut. */
const TAIL_VH = 60;
/** Timeline (same proportions as 3 × image rise + spread + short hold). */
const RISE_END = 1.5 / 2.1;
const SPREAD_END = 2.0 / 2.1;
const GRID_SIZE = 12;
/** Products per column, left → right. */
const COLUMN_COUNTS = [2, 3, 2, 3, 2] as const;

const COLLECTION_IMAGES = [
  { src: "/featured/t0-main.jpg", href: "/shop#atelier" },
  { src: "/featured/t1-main.webp", href: "/shop#editorial" },
  { src: "/featured/t2-main.jpg", href: "/shop" },
] as const;

const LINE_PATHS = [
  "M456 -195C456 463.876 -78.1243 998 -737 998",
  "M456 -195C456 463.876 990.124 998 1649 998",
  "M456 -195C456 1747.94 -1119.06 3323 -3062 3323",
  "M456 -195C456 1747.94 2031.06 3323 3974 3323",
  "M456 -195C456 187.733 145.733 498 -237 498",
  "M456 -195C456 91.6358 223.636 324 -63 324",
  "M456 -195C456 187.733 766.267 498 1149 498",
  "M456 -195C456 91.6358 688.364 324 975 324",
];

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeOut = (t: number) => 1 - (1 - clamp01(t)) ** 2;
const sineInOut = (t: number) => -(Math.cos(Math.PI * clamp01(t)) - 1) / 2;

type Metrics = { width: number; height: number };

function cardSize({ width, height }: Metrics) {
  const colW = width / 5;
  const cardH = width >= 1025 ? height / 2 : height / 3;
  return { colW, cardH };
}

function fillGrid(products: ProductDetail[]) {
  const source = products.length > 0 ? products : TRENDING_FALLBACK_PRODUCTS;
  return Array.from({ length: GRID_SIZE }, (_, i) => source[i % source.length]);
}

function productHref(product: ProductDetail) {
  return product.slug.startsWith("look-") ? "/shop" : `/product/${product.slug}`;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-3.5 w-3.5">
      <path
        d="M3 11 11 3M5 3h6v6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MovingLines({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 select-none"
      style={{
        transform: "scale(-1.5)",
        WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 80%)",
        maskImage: "linear-gradient(to top, #000 0%, transparent 80%)",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 912 317" fill="none">
        <g>
          {LINE_PATHS.map((d) => (
            <path
              key={d}
              d={d}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <g>
          {LINE_PATHS.map((d) => (
            <path
              key={`a-${d}`}
              d={d}
              pathLength={1}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: "1 2",
                strokeDashoffset: active ? 0 : 1,
                transition: "stroke-dashoffset 2.5s cubic-bezier(0.37, 0, 0.63, 1)",
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

function GridProductCard({
  product,
  column,
  row,
  zIndex,
  metrics,
  spread,
  revealed,
}: {
  product: ProductDetail;
  column: number;
  row: number;
  zIndex: number;
  metrics: Metrics;
  spread: MotionValue<number>;
  revealed: boolean;
}) {
  const { colW, cardH } = cardSize(metrics);
  const h = metrics.height;
  const columnTop =
    COLUMN_COUNTS[column] === 3 ? h / 2 - cardH : h / 2 - 0.75 * cardH;
  const top = columnTop + row * cardH;
  const fromX = (2 - column) * colW;
  const fromY = h / 3 - top;

  const x = useTransform(spread, (s) => fromX * (1 - sineInOut(s)));
  const y = useTransform(spread, (s) => fromY * (1 - sineInOut(s)));
  const scale = useTransform(spread, (s) => 1 - 0.05 * sineInOut(s));
  const priceLabel = `${formatPricePrecise(product.price_cents, product.currency)} EUR`;
  const image = product.images[0];

  return (
    <motion.div
      className="absolute"
      style={{
        left: column * colW,
        top,
        width: colW,
        height: cardH,
        zIndex,
        x,
        y,
        scale,
        opacity: revealed ? 1 : 0,
        pointerEvents: revealed ? "auto" : "none",
        transition: "opacity 0.5s ease",
        willChange: "transform",
      }}
    >
      <Link
        href={productHref(product)}
        aria-label={product.name}
        tabIndex={revealed ? 0 : -1}
        className="group relative block h-full w-full overflow-hidden rounded-[1.1rem] bg-neutral-800"
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="20vw"
            className="object-cover object-top"
          />
        ) : null}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-medium text-white">
              {product.name}
            </span>
            <span className="block translate-y-2 text-[10px] tabular-nums text-white/80 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {priceLabel}
            </span>
          </span>
          <span className="flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full bg-white text-neutral-950 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowIcon />
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

function CollectionRiser({
  src,
  href,
  label,
  index,
  metrics,
  progress,
  revealed,
}: {
  src: string;
  href: string;
  label: string;
  index: number;
  metrics: Metrics;
  progress: MotionValue<number>;
  revealed: boolean;
}) {
  const { colW, cardH } = cardSize(metrics);
  const h = metrics.height;
  const top = h / 3;
  const step = RISE_END / COLLECTION_IMAGES.length;
  const y = useTransform(progress, (p) => {
    const t = easeOut((p - index * step) / step);
    return (h - top) * (1 - t);
  });

  return (
    <motion.div
      className="absolute"
      style={{
        left: 2 * colW,
        top,
        width: colW,
        height: cardH,
        zIndex: 40 + index,
        y,
        opacity: revealed ? 0 : 1,
        pointerEvents: revealed ? "none" : "auto",
        transition: "opacity 0.5s ease",
        willChange: "transform",
      }}
    >
      <Link
        href={href}
        aria-label={label}
        tabIndex={revealed ? -1 : 0}
        className="relative block h-full w-full overflow-hidden rounded-[1.1rem] bg-neutral-800"
      >
        <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
      </Link>
    </motion.div>
  );
}

function Heading({
  stroke,
  solid,
  overlay,
  show,
}: {
  stroke: string;
  solid: string;
  overlay: string;
  show: "header" | "overlay" | "both";
}) {
  const headingClass =
    "font-sans text-[clamp(2.25rem,6.4vw,6rem)] font-semibold uppercase leading-[1.05] tracking-[0.01em]";
  const strokeStyle = {
    color: "transparent",
    WebkitTextStroke: "1.5px rgba(255,255,255,0.95)",
  } as const;

  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className={headingClass}
        style={{ visibility: show === "overlay" ? "hidden" : "visible" }}
      >
        <span style={strokeStyle}>{stroke}</span>{" "}
        <span className="text-white">{solid}</span>
      </h2>
      <p
        aria-hidden={show === "header"}
        className={headingClass}
        style={{
          ...strokeStyle,
          visibility: show === "header" ? "hidden" : "visible",
        }}
      >
        {overlay}
      </p>
    </div>
  );
}

function DesignedGridDesktop({ products }: { products: ProductDetail[] }) {
  const { locale } = useLocale();
  const copy = LANDING_COPY[locale].designedGrid;
  const pinRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [linesActive, setLinesActive] = useState(false);

  useLayoutEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const measure = () =>
      setMetrics({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.6,
    restDelta: 0.0005,
  });

  useMotionValueEvent(progress, "change", (p) => {
    setRevealed(p >= RISE_END);
    if (p > 0.001) setLinesActive(true);
    else if (p <= 0) setLinesActive(false);
  });

  const spread = useTransform(progress, (p) =>
    clamp01((p - RISE_END) / (SPREAD_END - RISE_END)),
  );
  const headingOpacity = useTransform(spread, (s) => 1 - sineInOut(s));

  const grid = fillGrid(products);
  let productIndex = 0;
  const placed = COLUMN_COUNTS.flatMap((count, column) =>
    Array.from({ length: count }, (_, row) => {
      const index = productIndex++;
      const zIndex =
        index === 5 || index === 6 ? 2 * GRID_SIZE + index : 2 * GRID_SIZE - index;
      return { product: grid[index], column, row, zIndex, key: `${index}` };
    }),
  );

  return (
    <section
      aria-label={copy.ariaLabel}
      className="relative z-10 hidden overflow-x-clip bg-[#0a0a0a] text-white md:block"
    >
      <div ref={pinRef} className="relative" style={{ height: `${100 + PIN_VH}vh` }}>
        <div ref={stickyRef} className="sticky top-0 h-[100dvh] min-h-[560px]">
          <MovingLines active={linesActive} />

          <motion.div
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            style={{ opacity: headingOpacity }}
          >
            <Heading
              stroke={copy.headingStroke}
              solid={copy.headingSolid}
              overlay={copy.overlay}
              show="header"
            />
          </motion.div>

          {metrics ? (
            <div className="absolute inset-0 z-10">
              {placed.map((item) => (
                <GridProductCard
                  key={item.key}
                  product={item.product}
                  column={item.column}
                  row={item.row}
                  zIndex={item.zIndex}
                  metrics={metrics}
                  spread={spread}
                  revealed={revealed}
                />
              ))}
              {COLLECTION_IMAGES.map((image, index) => (
                <CollectionRiser
                  key={image.src}
                  src={image.src}
                  href={image.href}
                  label={copy.collections[index]}
                  index={index}
                  metrics={metrics}
                  progress={progress}
                  revealed={revealed}
                />
              ))}
            </div>
          ) : null}

          <motion.div
            className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center"
            style={{ opacity: headingOpacity }}
          >
            <Heading
              stroke={copy.headingStroke}
              solid={copy.headingSolid}
              overlay={copy.overlay}
              show="overlay"
            />
          </motion.div>
        </div>
      </div>
      <div aria-hidden style={{ height: `${TAIL_VH}vh` }} />
    </section>
  );
}

function DesignedGridMobile({ products }: { products: ProductDetail[] }) {
  const { locale } = useLocale();
  const copy = LANDING_COPY[locale].designedGrid;
  const grid = fillGrid(products).slice(0, 8);

  return (
    <section
      aria-label={copy.ariaLabel}
      className="relative bg-[#0a0a0a] px-4 py-14 text-white md:hidden"
    >
      <Heading
        stroke={copy.headingStroke}
        solid={copy.headingSolid}
        overlay={copy.overlay}
        show="both"
      />
      <ul className="mt-8 grid grid-cols-2 gap-3">
        {grid.map((product, index) => (
          <li key={`${product.id}-${index}`}>
            <Link
              href={productHref(product)}
              className="relative block aspect-square overflow-hidden rounded-2xl bg-neutral-800"
            >
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="50vw"
                  className="object-cover object-top"
                />
              ) : null}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-2.5">
                <span className="block truncate text-[11px] font-medium">{product.name}</span>
                <span className="block text-[10px] tabular-nums text-white/80">
                  {formatPricePrecise(product.price_cents, product.currency)} EUR
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LandingDesignedGridSection({
  products = [],
}: {
  products?: ProductDetail[];
}) {
  return (
    <>
      <DesignedGridMobile products={products} />
      <DesignedGridDesktop products={products} />
    </>
  );
}
