"use client";

import {
  bannerSliderFrame,
  measureBannerSliderMetrics,
  type BannerSliderMetrics,
} from "@/lib/landing/bannerSliderMotion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { taglineFont } from "@/lib/fonts/tagline-font";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import { burstSideConfetti } from "@/lib/landing/burstConfetti";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import "@/styles/landing-hero-bridge.css";

const HERO_VIDEO =
  "/landing-ref/hero-banner.mp4";

const COLLECTION_LINKS = [
  { href: "/shop#atelier", key: "men", image: "/landing-ref/latest_img-1.webp" },
  { href: "/shop#editorial", key: "women", image: "/landing-ref/Text_Img1-1.webp" },
  { href: "/shop", key: "popular", image: "/landing-ref/Text_Img1-2.webp" },
] as const;

function ExploreArrowIcon() {
  return (
    <svg viewBox="0 0 52 43" fill="none" aria-hidden>
      <path
        d="M0.775823 37.8686L4.1886 42.7085L43.9453 14.675L40.6173 33.9547L46.4679 34.9684L51.5177 5.71225L22.2644 0.643612L21.2545 6.4948L40.5325 9.83504L0.775823 37.8686Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MarqueeBlocks({ text }: { text: string }) {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="marquee-block">
          <div className="marquee-block-item text-item">
            <div className="marquee-text body-font" data-marquee-text-banner-slider="true">
              {text}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

/** Reveal value at which the first collection pill has fully appeared (see `CollectionPill`). */
const CONFETTI_AT = 0.45 + 0.25;

const DEFAULT_METRICS: BannerSliderMetrics = {
  sectionHeight: 800,
  overlayContentHeight: 400,
};

export type LandingHeroSectionProps = {
  scrollProgress: MotionValue<number>;
};

export function LandingHeroSection({ scrollProgress }: LandingHeroSectionProps) {
  const { locale } = useLocale();
  const copy = LANDING_COPY[locale];
  const dedicationLines = [copy.dedication.title, ...copy.dedication.blocks];
  const mainRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  useLayoutEffect(() => {
    const measure = () => {
      if (!mainRef.current || !overlayRef.current || !overlayContentRef.current) {
        return;
      }
      setMetrics(
        measureBannerSliderMetrics(
          mainRef.current,
          overlayContentRef.current,
          overlayRef.current,
        ),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const frame = useTransform(scrollProgress, (p) => bannerSliderFrame(p, metrics));

  const overlayY = useTransform(frame, (f) => f.overlayY);
  const overlayStop = useTransform(frame, (f) => f.overlayStop);
  const overlayContentHeight = useTransform(
    frame,
    (f) => `${f.overlayContentHeightPx}px`,
  );
  const marqueeX = useTransform(frame, (f) => `${f.marqueeXPercent}%`);
  const introOpacity = useTransform(frame, (f) => f.introOpacity);

  const lineReveal = useTransform(scrollProgress, [0.42, 0.92], [0, 1]);

  const burstFiredRef = useRef(false);
  useMotionValueEvent(lineReveal, "change", (p) => {
    if (p >= CONFETTI_AT && !burstFiredRef.current) {
      burstFiredRef.current = true;
      void burstSideConfetti();
    }
  });

  return (
    <section
      id="landing-hero"
      className="landing-banner-section banner-slider-section h-full"
      aria-label={copy.hero.ariaLabel}
    >
      <div className="section-wrapper section-spacing scheme-scheme-6d9411dd-7dd7-4d41-89c8-bdb3669f100e section-solid section-height">
        <div
          ref={mainRef}
          className="banner-slider-main"
          data-banner-slide-component="true"
          data-section="landing-hero"
          data-block-size="1"
          data-section-index="1"
        >
          <div className="main-banner-slider-inner" data-banner-slider-wrapper-main="">
            <div className="banner-slider-wrapper is-stable" data-hero-slider-intiate="true">
              <div className="banner-slides">
                <div
                  className="banner-image-media scheme-scheme-f2e74476-a1c6-4836-be18-7af0d223e012"
                  data-index="1"
                  data-banner-slide-item="true"
                  data-id="banner-image-media-banner_Rd86Em"
                  data-media-id="banner_Rd86Em"
                >
                  <div className="slide-inner">
                    <div className="media-wrapper media-overlay">
                      <div className="media d-media-fixed m-media-fixed">
                        <video
                          playsInline
                          muted
                          autoPlay
                          loop
                          poster="/landing-ref/90d688b4a4ed4c3b82874021945dc4f9.thumbnail.0000000000.jpg"
                          aria-label="slide-show-banner-video"
                        >
                          <source src={HERO_VIDEO} type="video/mp4" />
                        </video>
                      </div>
                    </div>

                    <motion.div
                      className="slideshow-content container"
                      data-hero-slider-slide-item-content="true"
                      style={{ opacity: introOpacity }}
                    >
                      <div className="slideshow-content-wrapper pos-absolute center-left width-sm">
                        <div className="slideshow-content-inner text-left">
                          <h2
                            className="slideshow-heading heading-font h2"
                            data-slider-banner-content-heading="true"
                          >
                            {copy.hero.titleLines[0]} <br /> {copy.hero.titleLines[1]}
                          </h2>
                          <p className="slideshow-description body-font text-sm">
                            {copy.hero.descriptionLines[0]} <br />
                            {copy.hero.descriptionLines[1]}
                          </p>
                          <div className="slideshow-button">
                            <Link
                              href="/shop"
                              className="button-element button-primary button-animated button-medium body-font"
                            >
                              <span className="button-icon">
                                <span className="svg-wrapper">
                                  <ExploreArrowIcon />
                                </span>
                              </span>
                              <span className="button button-text">{copy.hero.cta}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="swiper-pagination landing-hero-pagination" />
            </div>
          </div>

          <motion.div
            ref={overlayRef}
            className="banner-overlay is-scroll-driven"
            data-banner-slider-overlay="true"
            style={{
              y: overlayY,
              ["--overlay-stop-value" as string]: overlayStop,
              ["--overlay-content-height" as string]: overlayContentHeight,
            }}
          >
            <motion.div
              className="banner-overlay-marquee marquee-block-node autoplay-infinite marquee-x rtl-direction scheme-scheme-4861db02-33da-4a19-a243-54306bc3e5d3"
              data-banner-slider-marquee="true"
              data-speed="15"
              data-direction="rtl"
              style={{ x: marqueeX }}
            >
              <div className="marquee-block-node-inner" data-speed="15" data-direction="left">
                <MarqueeBlocks text={copy.hero.marquee} />
                <MarqueeBlocks text={copy.hero.marquee} />
              </div>
            </motion.div>

            <div
              ref={overlayContentRef}
              className="banner-overlay-content text-center width-md"
              data-banner-slider-overlay-content="true"
            >
              <div
                className={`media-overlay-text dedication-copy ${taglineFont.className}`}
                data-banner-media-text-lines="true"
                role="doc-subtitle"
              >
                {dedicationLines.map((line, index) => (
                  <StoryLine key={line.slice(0, 24)} index={index} progress={lineReveal}>
                    {line}
                  </StoryLine>
                ))}
              </div>

              <div className="media-text-icons-wrapper media-icons-text">
                <div className="media-text-icons-inner">
                  {COLLECTION_LINKS.map((item, index) => (
                    <CollectionPill
                      key={item.key}
                      index={index}
                      progress={lineReveal}
                      href={item.href}
                      image={item.image}
                      label={copy.collectionPills[item.key]}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StoryLine({
  children,
  index,
  progress,
}: {
  children: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (p) => {
    const start = index * 0.14;
    return Math.min(1, Math.max(0, (p - start) / 0.22));
  });
  const y = useTransform(opacity, (o) => 50 * (1 - o));

  return (
    <motion.div style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

function CollectionPill({
  href,
  label,
  image,
  index,
  progress,
}: {
  href: string;
  label: string;
  image: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (p) => {
    const start = 0.45 + index * 0.12;
    return Math.min(1, Math.max(0, (p - start) / 0.25));
  });
  const y = useTransform(progress, (p) => {
    const start = 0.45 + index * 0.12;
    const o = Math.min(1, Math.max(0, (p - start) / 0.25));
    const from = index % 2 === 0 ? -100 : 100;
    return `${from * (1 - o)}%`;
  });

  return (
    <motion.div style={{ opacity, y }}>
      <Link href={href} className="media-text-icons-items" data-media-icons="">
        <div className="media-overlay-icon">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            width={60}
            height={60}
            loading="eager"
            className="banner-slider-tag-image"
          />
        </div>
        <div className="media-overlay-icon-text card-heading">
          <span>{label}</span>
        </div>
      </Link>
    </motion.div>
  );
}
