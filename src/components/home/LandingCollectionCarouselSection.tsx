"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import { LandingCollectionCarouselMobile } from "@/components/home/LandingCollectionCarouselMobile";
import {
  COLLECTION_CAROUSEL_SLIDES,
  type CollectionCarouselSlide,
} from "@/lib/landing/collectionCarouselSlides";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import "@/styles/landing-collection-carousel.css";

const SCROLL_TAIL_PX = 50;

function CarouselSlideCard({
  slide,
  index,
  progress,
  slideCount,
}: {
  slide: CollectionCarouselSlide;
  index: number;
  progress: MotionValue<number>;
  slideCount: number;
}) {
  const overlayOpacity = useTransform(progress, (p) => {
    const active = Math.min(slideCount - 1, Math.floor(p * slideCount));
    if (active === index) return 1;
    if (active === index - 1 || active === index + 1) return 0.35;
    return 0;
  });

  return (
    <li className="landing-cc-slide">
      <div className="landing-cc-card">
        <div className="landing-cc-media">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            style={{ objectPosition: slide.objectPosition }}
            sizes="(min-width: 1200px) 48vw, 62vw"
            priority={index === 0}
          />
        </div>
        <motion.div className="landing-cc-overlay" style={{ opacity: overlayOpacity }}>
          <p className="landing-cc-overlay-text">{slide.tagline}</p>
        </motion.div>
      </div>
      <div className="landing-cc-caption">
        <h3 className="landing-cc-title">{slide.title}</h3>
        <Link href={slide.href} className="landing-cc-cta">
          {slide.cta}
        </Link>
      </div>
    </li>
  );
}

function LandingCollectionCarouselDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const [travelPx, setTravelPx] = useState(0);
  const { locale } = useLocale();
  const copy = LANDING_COPY[locale].carousel;
  const slides = COLLECTION_CAROUSEL_SLIDES.map((slide) => ({
    ...slide,
    ...copy.slides[slide.id],
  }));

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const rail = railRef.current;
      const layout = layoutRef.current;
      if (!track || !rail || !layout) return;
      /** Distance so the LAST slide's right edge lands at the viewport's right padding. */
      const railLeft = rail.getBoundingClientRect().left;
      const padRight = parseFloat(getComputedStyle(layout).paddingRight) || 0;
      const max = railLeft + track.scrollWidth - window.innerWidth + padRight;
      setTravelPx(Math.max(0, max));
    };
    measure();
    /** Re-measure when CSS/fonts/images settle — a single early measure can read 0. */
    const raf = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    [trackRef.current, railRef.current, layoutRef.current].forEach((el) => {
      if (el) observer.observe(el);
    });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /** Slides finish moving at 90% of the pin; last 10% = rest with last slide fully visible. */
  const slideProgress = useTransform(scrollYProgress, [0, 0.9, 1], [0, 1, 1]);
  const listX = useTransform(slideProgress, (p) => `${-travelPx * p}px`);
  const progressScale = slideProgress;
  const headerOpacity = useTransform(scrollYProgress, [0, 0.12, 0.78, 1], [1, 1, 0.15, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0.92]);

  const sectionHeight =
    travelPx > 0
      ? `calc(100dvh + ${Math.round(travelPx / 0.9) + SCROLL_TAIL_PX}px)`
      : "100dvh";

  return (
    <section
      ref={sectionRef}
      className="landing-cc-section relative z-10 hidden bg-[#eceae5] md:block"
      style={{ height: sectionHeight }}
      aria-label={copy.ariaLabel}
    >
      <div className="sticky top-0 flex h-[100dvh] min-h-[560px] flex-col justify-center overflow-hidden pb-[34vh]">
        <div ref={layoutRef} className="landing-cc-layout">
          <motion.header
            className="landing-cc-header"
            style={{ opacity: headerOpacity, scale: headerScale }}
          >
            <h2 className="landing-cc-heading">
              <span className="landing-cc-heading-stroke">{copy.headingStroke}</span>{" "}
              {copy.headingRest}
            </h2>
            <p className="landing-cc-lede">
              {copy.lede}
            </p>
            <div className="landing-cc-header-actions">
              <Link href="/shop" className="landing-cc-explore">
                {copy.explore}
              </Link>
            </div>
          </motion.header>

          <div ref={railRef} className="landing-cc-rail-wrap">
            <motion.ul
              ref={trackRef}
              className="landing-cc-track"
              style={{ x: listX }}
            >
              {slides.map((slide, index) => (
                <CarouselSlideCard
                  key={slide.id}
                  slide={slide}
                  index={index}
                  progress={scrollYProgress}
                  slideCount={slides.length}
                />
              ))}
            </motion.ul>
          </div>
        </div>

        <div className="landing-cc-progress-track" aria-hidden>
          <motion.div
            className="landing-cc-progress-fill"
            style={{ scaleX: progressScale }}
          />
        </div>
      </div>
    </section>
  );
}

export function LandingCollectionCarouselSection() {
  return (
    <>
      <LandingCollectionCarouselMobile />
      <LandingCollectionCarouselDesktop />
    </>
  );
}
