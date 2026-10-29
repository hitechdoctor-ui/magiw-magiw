"use client";

import {
  FashionTrendingLayers,
  TRENDING_FALLBACK_PRODUCTS,
} from "@/components/home/FashionTrendingLayers";
import type { ProductDetail } from "@/lib/types/database";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type FashionProductScrollSectionProps = {
  products?: ProductDetail[];
};

/** Standalone trending block (legacy). Prefer `FashionLandingSequence`. */
export function FashionProductScrollSection({
  products = [],
}: FashionProductScrollSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const phase = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 h-[min(220vh,2000px)] bg-[#eceae5] text-neutral-950"
    >
      <div className="sticky top-0 h-[100dvh] min-h-[520px] overflow-hidden">
        <FashionTrendingLayers phase={phase} products={products} />
      </div>
    </section>
  );
}

export { TRENDING_FALLBACK_PRODUCTS };
