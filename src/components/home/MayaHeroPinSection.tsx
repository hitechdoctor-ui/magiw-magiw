"use client";

import { MayaHeroSection } from "@/components/home/MayaHeroSection";
import { useMotionValue, useScroll } from "framer-motion";
import { useRef } from "react";

/** Maya pin-spacer: ~100vh sticky + ~100vh scrub (see `engine.js` → `bannerSlider`). */
const PIN_SCROLL_VH = 200;

export function MayaHeroPinSection() {
  const pinRef = useRef<HTMLElement>(null);
  const mobileHeroProgress = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      <section className="relative bg-neutral-950 md:hidden" aria-label="Hero">
        <div className="h-[100dvh] min-h-[560px] overflow-hidden">
          <MayaHeroSection scrollProgress={mobileHeroProgress} />
        </div>
      </section>

      <section
        ref={pinRef}
        className="relative hidden bg-neutral-950 md:block"
        style={{ height: `${PIN_SCROLL_VH}dvh` }}
        aria-label="Hero"
      >
        <div className="sticky top-0 h-[100dvh] min-h-[560px] overflow-hidden">
          <MayaHeroSection scrollProgress={scrollYProgress} />
        </div>
      </section>
    </>
  );
}
