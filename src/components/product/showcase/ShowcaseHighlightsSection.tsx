"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { STAR_DUST_STYLE } from "@/components/product/showcase/ShowcaseDetailsSection";
import { PRODUCT_PAGE_COPY } from "@/lib/product/productPageCopy";
import type { ProductDetail } from "@/lib/types/database";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useMemo, useRef } from "react";

/** Scroll length of each highlight while the section is pinned (as in the reference: 75% of the viewport). */
const VH_PER_ITEM = 75;
const LINE_COLOR = "#c3ec52";
/** Half-width of the centre photo and the gap to the side boxes, as CSS lengths. */
const HALF_CENTER = "min(15vw, 13.5rem)";
const SIDE_GAP = "7vw";

const LEFT_TOPS = ["30%", "52%", "38%"];
const RIGHT_TOPS = ["46%", "30%", "58%"];

export type ShowcaseHighlight = {
  image: string;
  label: string;
  title: string;
  text: string;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function truncate(text: string, max = 150) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function useShowcaseHighlights(product: ProductDetail, partner?: ProductDetail | null) {
  const { locale } = useLocale();
  const copy = PRODUCT_PAGE_COPY[locale];

  return useMemo(() => {
    const pool = product.images.length > 1 ? product.images.slice(1) : product.images;
    const imageAt = (i: number) => pool[i % pool.length] ?? product.images[0];

    const fromSections = (product.sections ?? []).map((section) => ({
      title: section.title,
      text: truncate(section.content),
    }));
    const texts = [...fromSections, ...copy.fallbackHighlights].slice(0, partner ? 2 : 3);

    const items: ShowcaseHighlight[] = texts.map((entry, i) => ({
      image: imageAt(i),
      label: copy.highlightLabels[i] ?? entry.title,
      title: entry.title,
      text: entry.text,
    }));

    if (partner?.images[0]) {
      items.push({
        image: partner.images[0],
        label: partner.name,
        title: copy.pairsWithTitle,
        text: copy.pairsWithText(partner.name),
      });
    }
    return items;
  }, [product, partner, copy]);
}

function HighlightItem({
  item,
  index,
  count,
  segment,
}: {
  item: ShowcaseHighlight;
  index: number;
  count: number;
  segment: MotionValue<number>;
}) {
  const local = useTransform(segment, (s) => s - index);
  const grow = useTransform(local, (l) => clamp01(l / 0.5));
  const infoOpacity = useTransform(local, (l) => clamp01((l - 0.25) / 0.25));
  const itemOpacity = useTransform(local, (l) => {
    if (l < 0) return 0;
    if (index === count - 1) return 1;
    return 1 - clamp01((l - 1) / 0.25);
  });

  const leftTop = LEFT_TOPS[index % LEFT_TOPS.length];
  const rightTop = RIGHT_TOPS[index % RIGHT_TOPS.length];

  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: itemOpacity }}>
      <motion.div
        className="absolute h-[1.5px] origin-left"
        style={{
          top: leftTop,
          left: `calc(50% - ${HALF_CENTER} - ${SIDE_GAP})`,
          width: `calc(${HALF_CENTER} + ${SIDE_GAP})`,
          backgroundColor: LINE_COLOR,
          boxShadow: `0 0 10px ${LINE_COLOR}, 0 0 2px ${LINE_COLOR}`,
          scaleX: grow,
        }}
      />
      <motion.div
        className="absolute flex -translate-y-1/2 flex-col items-start gap-1.5"
        style={{
          top: leftTop,
          right: `calc(50% + ${HALF_CENTER} + ${SIDE_GAP})`,
          scale: grow,
          opacity: grow,
          transformOrigin: "right center",
        }}
      >
        <span className="text-[13px] font-semibold text-white">{item.label}</span>
        <span className="relative block h-24 w-28 overflow-hidden rounded-lg bg-neutral-200 lg:h-28 lg:w-32">
          <Image src={item.image} alt="" fill sizes="128px" className="object-cover object-top" />
        </span>
      </motion.div>

      <motion.div
        className="absolute h-[1.5px] origin-left"
        style={{
          top: rightTop,
          left: "50%",
          width: `calc(${HALF_CENTER} + ${SIDE_GAP})`,
          backgroundColor: LINE_COLOR,
          boxShadow: `0 0 10px ${LINE_COLOR}, 0 0 2px ${LINE_COLOR}`,
          scaleX: grow,
        }}
      />
      <motion.div
        className="absolute w-[min(22vw,17rem)] pt-3"
        style={{ top: rightTop, left: `calc(50% + ${HALF_CENTER} + ${SIDE_GAP} * 0.35)`, opacity: infoOpacity }}
      >
        <p className="text-[15px] font-semibold text-white">{item.title}</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-white/75">{item.text}</p>
      </motion.div>
    </motion.div>
  );
}

type ShowcaseHighlightsSectionProps = {
  product: ProductDetail;
  partner?: ProductDetail | null;
  image: string;
};

export function ShowcaseHighlightsSection({ product, partner, image }: ShowcaseHighlightsSectionProps) {
  const { locale } = useLocale();
  const copy = PRODUCT_PAGE_COPY[locale];
  const items = useShowcaseHighlights(product, partner);
  const pinRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6, restDelta: 0.0005 });
  const segment = useTransform(smooth, (p) => p * items.length);

  const glow = (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(130,200,40,.85) 0%, rgba(80,140,20,.45) 35%, transparent 66%)",
        filter: "blur(40px)",
      }}
    />
  );

  return (
    <section id="product-specifications" className="relative scroll-mt-16 text-white" style={STAR_DUST_STYLE}>
      {/* Mobile: static list */}
      <div className="relative overflow-hidden px-5 py-16 md:hidden">
        {glow}
        <h2 className="relative text-center text-3xl font-semibold">{copy.highlightsTitle}</h2>
        <div className="relative mx-auto mt-8 aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl bg-neutral-200">
          <Image src={image} alt={product.name} fill sizes="320px" className="object-cover object-top" />
        </div>
        <ul className="relative mt-10 space-y-6">
          {items.map((item) => (
            <li key={`${item.label}-${item.title}`} className="flex gap-4 border-t border-white/15 pt-6">
              <span className="relative block h-20 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-200">
                <Image src={item.image} alt="" fill sizes="64px" className="object-cover object-top" />
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-[0.16em]" style={{ color: LINE_COLOR }}>
                  {item.label}
                </span>
                <span className="mt-1 block text-[15px] font-semibold">{item.title}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-white/75">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tablet & desktop: pinned, scroll-driven */}
      <div ref={pinRef} className="relative hidden md:block" style={{ height: `${100 + items.length * VH_PER_ITEM}vh` }}>
        <div className="sticky top-16 flex h-[calc(100dvh-4rem)] flex-col items-center overflow-hidden">
          {glow}
          <h2 className="relative z-10 pt-[8vh] text-[clamp(2rem,3.6vw,3rem)] font-semibold tracking-tight">
            {copy.highlightsTitle}
          </h2>
          <div className="relative w-full flex-1">
            <div
              className="absolute left-1/2 top-[8%] h-[78%] -translate-x-1/2 overflow-hidden rounded-3xl bg-neutral-200 shadow-[0_30px_80px_rgba(0,0,0,.45)]"
              style={{ width: `calc(${HALF_CENTER} * 2)` }}
            >
              <Image src={image} alt={product.name} fill sizes="440px" className="object-cover object-top" />
            </div>
            {items.map((item, index) => (
              <HighlightItem
                key={`${item.label}-${item.title}`}
                item={item}
                index={index}
                count={items.length}
                segment={segment}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
