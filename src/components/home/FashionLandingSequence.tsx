"use client";

import { FashionTrendingLayers } from "@/components/home/FashionTrendingLayers";
import { FashionTrendingMobile } from "@/components/home/FashionTrendingMobile";
import type { ProductDetail } from "@/lib/types/database";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Trending starts while hero still pinned — avoids half-screen black under pills. */
/**
 * Pin length = SEQUENCE_HEIGHT_VH − 100 (sticky). Raise it to keep trending pinned
 * longer with products fully open, before the carousel appears.
 */
const SEQUENCE_HEIGHT_VH = 170;

/** Opening animation expressed in absolute vh of scroll (unchanged feel from the 128vh tuning). */
const OPEN_START_VH = 10.24;
const OPEN_END_VH = 56.32;
const PANEL_ENTER_VH = 30.72;

type FashionLandingSequenceProps = {
  featuredProducts?: ProductDetail[];
};

export function FashionLandingSequence({
  featuredProducts = [],
}: FashionLandingSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /** Phase hits 1 by ~half the section — lower scroll = already fully open. */
  /** Keep phase at 0 while panel enters — titles start closed, then split on scroll. */
  const trendPhase = useTransform(
    scrollYProgress,
    [OPEN_START_VH / SEQUENCE_HEIGHT_VH, OPEN_END_VH / SEQUENCE_HEIGHT_VH, 1],
    [0, 1, 1],
  );
  const trendPanelY = useTransform(scrollYProgress, (p) => {
    const t = Math.min(
      1,
      Math.max(0, p / (PANEL_ENTER_VH / SEQUENCE_HEIGHT_VH)),
    );
    const x = t * t * (3 - 2 * t);
    return `${100 - x * 100}%`;
  });

  return (
    <>
      <FashionTrendingMobile products={featuredProducts} />

      <section
        ref={sectionRef}
        className="relative z-10 -mt-[94vh] hidden bg-transparent md:block"
        style={{ height: `${SEQUENCE_HEIGHT_VH}vh` }}
      >
        <div className="sticky top-0 h-[100dvh] min-h-[560px] overflow-hidden">
          <motion.div
            className="absolute inset-0 z-20 bg-[#eceae5] will-change-transform [transform:translateZ(0)]"
            style={{ y: trendPanelY }}
          >
            <FashionTrendingLayers
              phase={trendPhase}
              products={featuredProducts}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
