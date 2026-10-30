"use client";

import { CartIconButton } from "@/components/cart/CartIconButton";
import { useCart } from "@/components/cart/CartProvider";
import { FashionLandingSequence } from "@/components/home/FashionLandingSequence";
import { LandingCollectionCarouselSection } from "@/components/home/LandingCollectionCarouselSection";
import { LandingDesignedGridSection } from "@/components/home/LandingDesignedGridSection";
import { LandingFeaturedCollectionsSection } from "@/components/home/LandingFeaturedCollectionsSection";
import { LandingHelpCenterSection } from "@/components/home/LandingHelpCenterSection";
import { LandingHeroPinSection } from "@/components/home/LandingHeroPinSection";
import type { ProductDetail } from "@/lib/types/database";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Scroll distance (px) that counts as a deliberate up/down move. */
const SCROLL_INTENT_PX = 6;
const TOP_ZONE_PX = 24;

/** Menu hides while scrolling down and comes back as soon as the user scrolls up. */
function useRevealOnScrollUp() {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const top = y <= TOP_ZONE_PX;
      setAtTop(top);
      if (top) {
        setVisible(true);
      } else if (y < lastY - SCROLL_INTENT_PX) {
        setVisible(true);
      } else if (y > lastY + SCROLL_INTENT_PX) {
        setVisible(false);
      } else {
        return;
      }
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { visible, atTop };
}

type MagiwBrightLandingProps = {
  featuredProducts?: ProductDetail[];
};

export function MagiwBrightLanding({
  featuredProducts = [],
}: MagiwBrightLandingProps) {
  const { count, openCart, hydrated } = useCart();
  const { t, locale } = useLocale();
  const copy = LANDING_COPY[locale];
  const { visible: headerVisible, atTop: headerAtTop } = useRevealOnScrollUp();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-neutral-950 text-white">
      <header
        className={`fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] transition-[transform,background-color,backdrop-filter] duration-300 ease-out sm:px-10 lg:px-14 ${
          headerAtTop ? "bg-transparent" : "bg-neutral-950/80 backdrop-blur-md"
        } ${headerVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <Link
          href="/"
          className="font-sans text-lg font-semibold uppercase tracking-[0.28em] text-white sm:text-xl"
        >
          MAGIW MAGIW
        </Link>

        <nav className="hidden items-center justify-center gap-6 font-sans text-[11px] uppercase tracking-[0.14em] text-white/85 md:flex">
          <Link href="/" className="transition hover:text-white">
            {copy.nav.home}
          </Link>
          <Link href="/shop" className="transition hover:text-white">
            {t("navCollection")}
          </Link>
          <Link href="#landing-hero" className="transition hover:text-white">
            {t("navOurStory")}
          </Link>
        </nav>

        <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 font-sans text-[11px] tracking-[0.06em] text-white/75 sm:text-xs">
          <Link href="/shop" className="transition hover:text-white md:hidden">
            {copy.nav.shop}
          </Link>
          <LanguageSwitch variant="runway" />
          <CartIconButton
            count={count}
            hydrated={hydrated}
            onClick={openCart}
            variant="runway"
          />
        </nav>
      </header>

      <LandingHeroPinSection />
      <FashionLandingSequence featuredProducts={featuredProducts} />
      <LandingCollectionCarouselSection />
      <LandingFeaturedCollectionsSection />
      <LandingDesignedGridSection products={featuredProducts} />

      <LandingHelpCenterSection />
    </div>
  );
}
