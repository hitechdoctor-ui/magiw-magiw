"use client";

import { CartIconButton } from "@/components/cart/CartIconButton";
import { useCart } from "@/components/cart/CartProvider";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { FloatingTulipBouquet } from "@/components/decor/FloatingTulipBouquet";
import { atelierStoryFont } from "@/lib/fonts/atelier-story-font";
import { taglineFont } from "@/lib/fonts/tagline-font";
import Image from "next/image";
import Link from "next/link";

const STORY_BLOCKS = [
  "Μια ιδέα εμπνευσμένη από ψηλά! Έρχεται και αφιερώνεται στον αδερφό μου Γεράσιμο Παπαγιαννόπουλο. Ο πρώτος που πίστεψε στην ιδέα αυτή και σε εμένα... ΤΟ MAGIW MAGIW είναι ιδέα!",
  "Χτίζεται και μετρά χρόνια πριν την υλοποίησή του. Με την γνώση και την αγάπη για δημιουργία, βασισμένα στην μελέτη πρώτης ύλης, σχεδιασμού και κατασκευής...",
  "Θα καλύψει με τις σειρές του: την γυναίκα με σειρά Evelina's, τον άνδρα με σειρά Gino, και παιδί με σειρά Evelina's kids and baby.",
];

export function MagiwBrightLanding() {
  const script = atelierStoryFont.className;
  const { count, openCart, hydrated } = useCart();
  const { t } = useLocale();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f3eee4] text-[#5c4a32]">
      <FloatingTulipBouquet prominence="hero" />

      <div className="relative z-10">
        <header className="flex flex-col items-center gap-5 px-5 pb-6 pt-[max(1.25rem,env(safe-area-inset-top))] sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-4 sm:px-10 lg:px-14">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-serif text-[11px] tracking-[0.08em] text-[#6b563c] sm:justify-start sm:text-xs">
            <Link href="/shop#editorial" className="transition hover:text-[#9a7b3c]">
              {t("navWomen")}
            </Link>
            <Link href="/shop#atelier" className="transition hover:text-[#9a7b3c]">
              {t("navMen")}
            </Link>
            <Link href="/shop" className="transition hover:text-[#9a7b3c]">
              {t("navCollection")}
            </Link>
          </nav>

          <p className="text-center font-serif text-[11px] uppercase tracking-[0.38em] text-[#8a7348] sm:text-xs">
            MAGIW MAGIW
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-serif text-[11px] tracking-[0.06em] text-[#6b563c] sm:justify-end sm:text-right sm:text-xs">
            <Link
              href="#brand-story"
              className={`${script} text-[13px] tracking-normal text-[#6b563c] transition hover:text-[#9a7b3c] sm:text-sm`}
            >
              {t("navOurStory")}
            </Link>
            <Link href="/shop" className="transition hover:text-[#9a7b3c]">
              {t("navSearch")}
            </Link>
            <LanguageSwitch variant="landing" />
            <CartIconButton
              count={count}
              hydrated={hydrated}
              onClick={openCart}
              variant="landing"
            />
          </nav>
        </header>

        <main className="flex min-h-[calc(100dvh-7rem)] flex-col items-center justify-center px-6 pb-24 pt-4 text-center">
          <div className="relative mx-auto h-[min(38vh,220px)] w-full max-w-[200px] sm:max-w-[220px]">
            <Image
              src="/logo-magiw.png"
              alt="MAGIW MAGIW"
              fill
              className="object-contain object-center drop-shadow-[0_4px_18px_rgba(154,123,60,0.2)]"
              sizes="220px"
              priority
            />
          </div>

          <h1 className="mt-6 font-serif text-[clamp(2rem,7vw,3.25rem)] font-light uppercase tracking-[0.28em] text-[#a8894a]">
            MAGIW MAGIW
          </h1>

          <p
            className={`${taglineFont.className} mt-5 max-w-lg text-[clamp(1.5rem,4.8vw,2.1rem)] font-normal italic leading-[1.35] tracking-[0.02em] text-[#8a7348]`}
          >
            Μια ιδέα εμπνευσμένη από ψυχή
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop#editorial"
              className="min-w-[140px] bg-[#b8954a] px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-[#a07f3d]"
            >
              Γυναικεία
            </Link>
            <Link
              href="/shop#atelier"
              className="min-w-[140px] border border-[#b8954a]/80 bg-white/25 px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-[#8a7348] backdrop-blur-[2px] transition hover:border-[#a07f3d] hover:bg-white/40"
            >
              Ανδρικά
            </Link>
          </div>
        </main>

        <p className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 text-[10px] uppercase tracking-[0.42em] text-[#8a7348]/75">
          Συνεχίστε να κυλίσετε
        </p>

        <section
          id="brand-story"
          className="relative scroll-mt-8 px-6 pb-24 pt-16 sm:px-10"
        >
          <div className="mx-auto max-w-2xl rounded-sm bg-white/45 px-6 py-10 backdrop-blur-sm sm:px-10">
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
    </div>
  );
}
