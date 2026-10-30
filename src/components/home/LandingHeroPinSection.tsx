"use client";

import { LandingHeroSection } from "@/components/home/LandingHeroSection";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { taglineFont } from "@/lib/fonts/tagline-font";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import { useMotionValue, useScroll } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

/** Hero pin-spacer: ~100vh sticky + ~100vh scrub. */
const PIN_SCROLL_VH = 200;

export function LandingHeroPinSection() {
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
          <LandingHeroSection scrollProgress={mobileHeroProgress} />
        </div>
        <MobileDedication />
      </section>

      <section
        ref={pinRef}
        className="relative hidden bg-neutral-950 md:block"
        style={{ height: `${PIN_SCROLL_VH}dvh` }}
        aria-label="Hero"
      >
        <div className="sticky top-0 h-[100dvh] min-h-[560px] overflow-hidden">
          <LandingHeroSection scrollProgress={scrollYProgress} />
        </div>
      </section>
    </>
  );
}

/** Static dedication for phones. The scroll reveal that shows it on desktop never runs here. */
function MobileDedication() {
  const { locale } = useLocale();
  const copy = LANDING_COPY[locale].dedication;
  const lines = [copy.title, ...copy.blocks];

  return (
    <div className="bg-neutral-950 px-6 pb-16 pt-4 text-center text-white">
      <Image
        src="/brand/magiw-angel-mark.png"
        alt=""
        width={419}
        height={551}
        aria-hidden
        className="mx-auto mb-6 h-auto w-[min(46vw,180px)]"
      />
      <div className={`${taglineFont.className} mx-auto max-w-md italic`}>
        {lines.map((line, index) => (
          <p
            key={line.slice(0, 24)}
            className={
              index === 0
                ? "text-[1.35rem] leading-snug text-white"
                : "mt-5 text-[1.02rem] leading-[1.7] text-white/90"
            }
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
