"use client";

import { CartIconButton } from "@/components/cart/CartIconButton";
import { useCart } from "@/components/cart/CartProvider";
import { FashionLandingSequence } from "@/components/home/FashionLandingSequence";
import { MayaCollectionCarouselSection } from "@/components/home/MayaCollectionCarouselSection";
import { MayaFeaturedCollectionsSection } from "@/components/home/MayaFeaturedCollectionsSection";
import { MayaHeroPinSection } from "@/components/home/MayaHeroPinSection";
import type { ProductDetail } from "@/lib/types/database";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { taglineFont } from "@/lib/fonts/tagline-font";
import Link from "next/link";

const STORY_BLOCKS = [
  "Μια ιδέα εμπνευσμένη από ψηλά! Έρχεται και αφιερώνεται στον αδερφό μου Γεράσιμο Παπαγιαννόπουλο. Ο πρώτος που πίστεψε στην ιδέα αυτή και σε εμένα... ΤΟ MAGIW MAGIW είναι ιδέα!",
  "Χτίζεται και μετρά χρόνια πριν την υλοποίησή του. Με την γνώση και την αγάπη για δημιουργία, βασισμένα στην μελέτη πρώτης ύλης, σχεδιασμού και κατασκευής...",
  "Θα καλύψει με τις σειρές του: την γυναίκα με σειρά Evelina's, τον άνδρα με σειρά Gino, και παιδί με σειρά Evelina's kids and baby.",
];

type MagiwBrightLandingProps = {
  featuredProducts?: ProductDetail[];
};

export function MagiwBrightLanding({
  featuredProducts = [],
}: MagiwBrightLandingProps) {
  const { count, openCart, hydrated } = useCart();
  const { t } = useLocale();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-neutral-950 text-white">
      <header className="absolute inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-10 lg:px-14">
        <Link
          href="/"
          className="font-sans text-lg font-semibold uppercase tracking-[0.28em] text-white sm:text-xl"
        >
          MAGIW MAGIW
        </Link>

        <nav className="hidden items-center justify-center gap-6 font-sans text-[11px] uppercase tracking-[0.14em] text-white/85 md:flex">
          <Link href="/?preview=true" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/shop" className="transition hover:text-white">
            {t("navCollection")}
          </Link>
          <Link href="#brand-story" className="transition hover:text-white">
            {t("navOurStory")}
          </Link>
        </nav>

        <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 font-sans text-[11px] tracking-[0.06em] text-white/75 sm:text-xs">
          <Link href="/shop" className="transition hover:text-white md:hidden">
            Shop
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

      <MayaHeroPinSection />
      <FashionLandingSequence featuredProducts={featuredProducts} />
      <MayaCollectionCarouselSection />
      <MayaFeaturedCollectionsSection />

      <section
        id="brand-story"
        className="relative scroll-mt-8 bg-[#f3eee4] px-6 py-24 text-[#5c4a32] sm:px-10"
      >
        <div className="mx-auto max-w-2xl rounded-sm bg-white/55 px-6 py-10 backdrop-blur-sm sm:px-10">
          <p
            className={`${taglineFont.className} text-center text-[clamp(1.25rem,3.6vw,1.55rem)] font-normal italic text-[#8a7348]`}
          >
            Αφιέρωση
          </p>
          <div className="mt-8 space-y-7">
            {STORY_BLOCKS.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`${taglineFont.className} text-[clamp(1.1rem,3.2vw,1.45rem)] font-normal italic leading-[1.85] text-[#8a7348]`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
