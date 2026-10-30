"use client";

import { FashionTrendingLayers } from "@/components/home/FashionTrendingLayers";
import { FashionTrendingMobile } from "@/components/home/FashionTrendingMobile";
import type { ProductDetail } from "@/lib/types/database";
import { useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

type FashionLandingSequenceProps = {
  featuredProducts?: ProductDetail[];
};

export function FashionLandingSequence({
  featuredProducts = [],
}: FashionLandingSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);

  /** Not pinned: the split runs while the block scrolls in (top at 55% → bottom at 65% of the viewport). */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.55", "end 0.65"],
  });
  const phase = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.6,
    restDelta: 0.0005,
  });

  return (
    <>
      <FashionTrendingMobile products={featuredProducts} />

      <section
        ref={sectionRef}
        className="relative z-10 hidden bg-[#eceae5] md:block"
      >
        <FashionTrendingLayers phase={phase} products={featuredProducts} />
      </section>
    </>
  );
}
