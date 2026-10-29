"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  FEATURED_COLLECTIONS_COPY,
  FEATURED_COLLECTION_TABS,
  FEATURED_DEFAULT_TAB,
  localizeFeaturedTab,
  type LocalizedFeaturedTab,
} from "@/lib/maya/featuredCollections";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useMemo, useRef, useState } from "react";

function useLocalizedFeatured() {
  const { locale } = useLocale();
  const tabs = useMemo(
    () => FEATURED_COLLECTION_TABS.map((tab) => localizeFeaturedTab(tab, locale)),
    [locale],
  );
  return { tabs, copy: FEATURED_COLLECTIONS_COPY[locale] };
}

/** Maya: pin length = 150% of the viewport. */
const PIN_VH = 150;
/** Maya timeline = 4 equal steps; thresholds below are fractions of the pin. */
const STAGE_MOVE_END = 0.25;
const STAGE_PILL_END = 0.5;
const STAGE_GRID_AT = 0.75;

const TAB_W = 106;
const TAB_GAP = 30;
const ACTIVE_TAB_W = "clamp(300px, 33vw, 475px)";
const CARD_RADIUS = 28;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** gsap power1.out */
const power1Out = (t: number) => 1 - (1 - t) * (1 - t);

function ArrowIcon() {
  return (
    <svg viewBox="0 0 7 7" fill="none" className="h-3 w-3" aria-hidden>
      <path
        d="M0.48249 0.923833L0.482511 1.77624L4.82887 1.77626L0.625632 5.77029L1.25997 6.37305L5.4632 2.37902L5.4632 6.50903L6.36025 6.50905L6.36025 0.923812L0.48249 0.923833Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Word → chars split (Maya SplitText). `heading` flips each char in; `type` fades chars in fast. */
function SplitChars({
  text,
  show,
  kind,
}: {
  text: string;
  show: boolean;
  kind: "heading" | "type";
}) {
  const words = text.split(" ");
  let index = 0;
  return (
    <span aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={`${word}-${wi}`}>
          <span className="inline-block whitespace-nowrap" aria-hidden>
            {Array.from(word).map((char) => {
              const i = index++;
              const style =
                kind === "heading"
                  ? {
                      display: "inline-block",
                      opacity: show ? 1 : 0,
                      transform: show
                        ? "perspective(500px) rotateX(0deg)"
                        : "perspective(500px) rotateX(90deg)",
                      transition: show
                        ? `opacity .8s cubic-bezier(.16,1,.3,1) ${i * 20}ms, transform .8s cubic-bezier(.16,1,.3,1) ${i * 20}ms`
                        : "opacity .2s ease, transform 0s linear .2s",
                    }
                  : {
                      display: "inline-block",
                      opacity: show ? 1 : 0,
                      transition: show
                        ? `opacity .5s cubic-bezier(0,.55,.45,1) ${i * 12}ms`
                        : "opacity .15s ease",
                    };
              return (
                <span key={i} style={style}>
                  {char}
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

function tabOrder(active: number, count: number) {
  /** Active tab always sits in the middle slot (Maya rotates the tab list on click). */
  const mid = Math.floor(count / 2);
  return Array.from({ length: count }, (_, slot) => (active + slot - mid + count * 2) % count);
}

function FeaturedCollectionsDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(FEATURED_DEFAULT_TAB);
  const [started, setStarted] = useState(false);
  const [textShown, setTextShown] = useState(false);
  const [pillShown, setPillShown] = useState(false);
  const [typeShown, setTypeShown] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.5,
    restDelta: 0.0005,
  });

  useMotionValueEvent(p, "change", (v) => {
    setStarted(v > 0.004);
    setTextShown(v >= STAGE_MOVE_END);
    setPillShown(v >= STAGE_MOVE_END + (STAGE_PILL_END - STAGE_MOVE_END) * 0.2);
    setTypeShown(v >= STAGE_PILL_END);
    setGridOpen(v >= STAGE_GRID_AT);
  });

  const moveP = useTransform(p, (v) => power1Out(clamp01(v / STAGE_MOVE_END)));
  const cardX = useTransform(moveP, (c) => `${-100 * (1 - c)}%`);
  const cardScale = useTransform(moveP, (c) => 0.7 + 0.3 * c);
  const pillWidth = useTransform(p, (v) => {
    const t = power1Out(clamp01((v - STAGE_MOVE_END) / (STAGE_PILL_END - STAGE_MOVE_END)));
    return `calc(58px + (100% - 58px) * ${t})`;
  });

  const { tabs, copy } = useLocalizedFeatured();
  const scheme = tabs[active].scheme;
  const order = tabOrder(active, tabs.length);

  return (
    <section
      ref={sectionRef}
      className="maya-fc-section relative z-10 hidden bg-black md:block"
      style={{ height: `${100 + PIN_VH}vh` }}
      aria-label="Featured collections"
    >
      <div
        className="sticky top-0 h-[100dvh] min-h-[600px] overflow-hidden"
        style={{ color: scheme.text, transition: "color .4s ease" }}
      >
        {tabs.map((tab, i) => (
          <div
            key={tab.id}
            className="pointer-events-none absolute inset-0"
            style={{
              background: tab.scheme.gradient,
              opacity: i === active ? 1 : 0,
              transition: "opacity .7s ease",
            }}
            aria-hidden
          />
        ))}

        {/* Front: heading + lede (fades out when scrolling starts) */}
        <div
          className="absolute inset-x-0 z-10 mx-auto flex max-w-[70%] flex-col items-center gap-[30px] text-center"
          style={{
            top: "13%",
            opacity: started ? 0 : 1,
            visibility: started ? "hidden" : "visible",
            transition: `opacity .4s ease, visibility 0s linear ${started ? ".4s" : "0s"}`,
          }}
        >
          <h3
            className="font-sans text-[clamp(1.75rem,3vw,2.75rem)] font-bold uppercase leading-[1.1] tracking-tight"
            style={{ color: scheme.heading }}
          >
            {copy.heading}
          </h3>
          <p className="max-w-[620px] font-sans text-[13px] leading-relaxed">
            {copy.lede}
          </p>
        </div>

        {/* Tabs: centred first, then glide to the top */}
        <div
          className="absolute left-1/2 z-20 -translate-x-1/2 px-[15px] py-[30px]"
          style={
            {
              top: started ? 0 : "calc(50% - 61px)",
              transition: "top .6s ease",
              "--fc-aw": ACTIVE_TAB_W,
            } as React.CSSProperties
          }
        >
          <div
            className="relative h-[86px]"
            style={{ width: `calc(${TAB_W * 2 + TAB_GAP * 2}px + var(--fc-aw))` }}
          >
            {tabs.map((tab, i) => {
              const slot = order.indexOf(i);
              const isActive = i === active;
              const left =
                slot === 0
                  ? 0
                  : slot === 1
                    ? `${TAB_W + TAB_GAP}px`
                    : `calc(${TAB_W + TAB_GAP * 2}px + var(--fc-aw))`;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-label={tab.label}
                  aria-pressed={isActive}
                  onClick={() => setActive(i)}
                  className="absolute top-0 h-[86px] overflow-hidden rounded-[50px] border-2"
                  style={{
                    left,
                    width: isActive ? "var(--fc-aw)" : TAB_W,
                    zIndex: isActive ? 2 : 1,
                    color: scheme.buttonText,
                    background: isActive
                      ? scheme.buttonBackground
                      : "linear-gradient(180deg,#ffffff26,#99999900)",
                    borderColor: isActive ? scheme.buttonText : "rgba(255,255,255,.15)",
                    backdropFilter: "blur(10px)",
                    transition:
                      "left .4s ease, width .4s ease, background .4s ease, border-color .4s ease",
                  }}
                >
                  <span
                    className="absolute top-0 block h-[86px] w-[86px] overflow-hidden rounded-full"
                    style={{
                      left: isActive ? 0 : `calc(50% - 43px)`,
                      transform: `scale(${isActive ? 0.85 : 0.9})`,
                      transition: "left .4s ease, transform .4s ease",
                    }}
                  >
                    <Image
                      src={tab.icon}
                      alt=""
                      fill
                      sizes="86px"
                      className="object-cover"
                    />
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap px-[60px] font-sans text-[17px]"
                    style={{
                      opacity: isActive ? 0.75 : 0,
                      transition: `opacity .4s ease ${isActive ? ".4s" : "0s"}`,
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content: text left, image card / grid right */}
        <div
          className="absolute bottom-0 left-1/2 z-10 grid w-[94%] -translate-x-1/2 grid-cols-2 lg:w-[80%]"
          style={{
            top: 161,
            opacity: started ? 1 : 0.3,
            transition: "opacity .4s ease",
          }}
        >
          <div className="grid items-center p-5">
            {tabs.map((tab, i) => (
              <TabText
                key={tab.id}
                tab={tab}
                isActive={i === active}
                textShown={textShown}
              />
            ))}
          </div>

          <motion.div
            className="relative h-full"
            style={{ x: cardX, scale: cardScale }}
          >
            {tabs.map((tab, i) => (
              <TabGrid
                key={tab.id}
                tab={tab}
                isActive={i === active}
                gridOpen={gridOpen}
                pillShown={pillShown}
                typeShown={typeShown}
                pillWidth={pillWidth}
                eager={i === FEATURED_DEFAULT_TAB}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TabText({
  tab,
  isActive,
  textShown,
}: {
  tab: LocalizedFeaturedTab;
  isActive: boolean;
  textShown: boolean;
}) {
  return (
    <div
      className="col-start-1 row-start-1 text-left"
      style={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
        userSelect: isActive ? "auto" : "none",
      }}
      aria-hidden={!isActive}
    >
      <h2
        className="mb-10 font-sans text-[clamp(1.5rem,2.7vw,2.6rem)] font-bold uppercase leading-[1.1]"
        style={{ color: tab.scheme.heading }}
      >
        <SplitChars text={tab.heading} show={textShown && isActive} kind="heading" />
      </h2>
      <div
        className="space-y-5 font-sans text-[12.5px] font-medium leading-[1.55] lg:text-[13px]"
        style={{
          opacity: textShown && isActive ? 1 : 0,
          transition: "opacity .5s ease",
        }}
      >
        {tab.description.map((paragraph) => (
          <p key={paragraph.slice(0, 20)}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function TabGrid({
  tab,
  isActive,
  gridOpen,
  pillShown,
  typeShown,
  pillWidth,
  eager,
}: {
  tab: LocalizedFeaturedTab;
  isActive: boolean;
  gridOpen: boolean;
  pillShown: boolean;
  typeShown: boolean;
  pillWidth: ReturnType<typeof useTransform<number, string>>;
  eager: boolean;
}) {
  const tileStyle = {
    transform: `scale(${gridOpen ? 1 : 0})`,
    transition: "transform .22s ease",
    borderRadius: CARD_RADIUS,
  } as const;

  return (
    <div
      className="absolute inset-0 grid grid-cols-2 gap-5 p-[15px]"
      style={{
        gridTemplateRows: "minmax(0,1fr) 58px minmax(0,1fr)",
        opacity: isActive ? 1 : 0,
        visibility: isActive ? "visible" : "hidden",
        pointerEvents: isActive ? "auto" : "none",
        transition: "opacity .3s ease, visibility 0s linear " + (isActive ? "0s" : ".3s"),
      }}
    >
      {/* Main collection image — covers the whole grid until the tiles pop in */}
      <div
        className="absolute inset-0 z-[1] overflow-hidden"
        style={{
          transform: `scale(${gridOpen ? 0 : 1})`,
          transition: "transform .18s ease",
          borderRadius: CARD_RADIUS,
          boxShadow: "-8px 13px 15px -5px rgba(255,255,255,.08)",
        }}
      >
        <Image
          src={tab.main}
          alt={tab.label}
          fill
          sizes="40vw"
          className="object-cover"
          priority={eager}
        />
      </div>

      {tab.products.slice(0, 2).map((product) => (
        <Link
          key={product.alt}
          href={product.href}
          aria-label={product.alt}
          className="relative block overflow-hidden"
          style={tileStyle}
        >
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="20vw"
            className="object-cover"
          />
        </Link>
      ))}

      <div
        className="relative z-[2] col-span-2 flex h-[58px] items-center"
        style={{ opacity: pillShown ? 1 : 0 }}
      >
        <motion.div
          className="flex h-full items-center justify-between gap-[15px] overflow-hidden whitespace-nowrap rounded-[50px] bg-[#f4f4f4] pl-[25px] pr-[10px] text-black shadow-[-8px_13px_15px_-5px_rgba(0,0,0,0.25)]"
          style={{ width: pillWidth }}
        >
          <p className="font-sans text-[14px]">
            <SplitChars text={tab.pillText} show={typeShown && isActive} kind="type" />
          </p>
          <Link
            href={tab.pillHref}
            aria-label={tab.heading}
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-black text-[#f4f4f4] transition hover:bg-[#f4f4f4] hover:text-black"
          >
            <ArrowIcon />
          </Link>
        </motion.div>
      </div>

      <Link
        href={tab.products[2].href}
        aria-label={tab.products[2].alt}
        className="relative col-span-2 block overflow-hidden"
        style={tileStyle}
      >
        <Image
          src={tab.products[2].image}
          alt={tab.products[2].alt}
          fill
          sizes="40vw"
          className="object-cover"
        />
      </Link>
    </div>
  );
}

/** Mobile: no pin / no effects — heading, tab row and the active collection stacked. */
function FeaturedCollectionsMobile() {
  const [active, setActive] = useState(FEATURED_DEFAULT_TAB);
  const { tabs, copy } = useLocalizedFeatured();
  const tab = tabs[active];

  return (
    <section
      className="relative bg-black px-5 py-14 md:hidden"
      style={{ color: tab.scheme.text }}
      aria-label="Featured collections"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: tab.scheme.gradient }}
        aria-hidden
      />
      <div className="relative">
        <h3
          className="text-center font-sans text-[1.7rem] font-bold uppercase leading-[1.1]"
          style={{ color: tab.scheme.heading }}
        >
          {copy.heading}
        </h3>
        <p className="mt-4 text-center font-sans text-[13px] leading-relaxed">
          {copy.lede}
        </p>

        <div className="-mx-5 mt-8 flex gap-3 overflow-x-auto px-5 pb-2">
          {tabs.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className="relative flex h-[60px] shrink-0 items-center overflow-hidden rounded-full border-2 font-sans text-[15px]"
                style={{
                  width: isActive ? "auto" : 80,
                  minWidth: isActive ? 220 : 80,
                  padding: isActive ? "0 20px 0 62px" : 0,
                  justifyContent: "center",
                  background: isActive
                    ? t.scheme.buttonBackground
                    : "linear-gradient(180deg,#ffffff26,#99999900)",
                  color: t.scheme.buttonText,
                  borderColor: isActive ? t.scheme.buttonText : "rgba(255,255,255,.15)",
                }}
              >
                <span
                  className="absolute top-0 block h-[60px] w-[60px] overflow-hidden rounded-full"
                  style={{ left: isActive ? 0 : "calc(50% - 30px)" }}
                >
                  <Image src={t.icon} alt="" fill sizes="60px" className="object-cover" />
                </span>
                {isActive ? <span className="whitespace-nowrap">{t.label}</span> : null}
              </button>
            );
          })}
        </div>

        <h2
          className="mt-8 font-sans text-[1.5rem] font-bold uppercase leading-[1.1]"
          style={{ color: tab.scheme.heading }}
        >
          {tab.heading}
        </h2>
        <div className="mt-4 space-y-4 font-sans text-[13px] font-medium leading-[1.55]">
          {tab.description.map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="relative col-span-2 h-[300px] overflow-hidden rounded-[22px]">
            <Image src={tab.main} alt={tab.label} fill sizes="100vw" className="object-cover" />
          </div>
          {tab.products.slice(0, 2).map((product) => (
            <Link
              key={product.alt}
              href={product.href}
              aria-label={product.alt}
              className="relative block aspect-square overflow-hidden rounded-[22px]"
            >
              <Image src={product.image} alt={product.alt} fill sizes="50vw" className="object-cover" />
            </Link>
          ))}
          <Link
            href={tab.pillHref}
            className="col-span-2 flex h-[52px] items-center justify-between rounded-full bg-[#f4f4f4] pl-5 pr-[10px] font-sans text-[14px] text-black"
          >
            <span>{tab.pillText}</span>
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black text-[#f4f4f4]">
              <ArrowIcon />
            </span>
          </Link>
          <Link
            href={tab.products[2].href}
            aria-label={tab.products[2].alt}
            className="relative col-span-2 block aspect-[5/3] overflow-hidden rounded-[22px]"
          >
            <Image
              src={tab.products[2].image}
              alt={tab.products[2].alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function MayaFeaturedCollectionsSection() {
  return (
    <>
      <FeaturedCollectionsMobile />
      <FeaturedCollectionsDesktop />
    </>
  );
}
