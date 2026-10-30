"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { LEGAL_PAGES, LEGAL_SLUGS } from "@/lib/legal/legalPages";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const { t, locale } = useLocale();

  return (
    <footer className="relative border-t border-neutral-200 bg-neutral-50">
      <div
        className="tulip-float pointer-events-none absolute bottom-0 left-0 z-20 h-[min(48vh,300px)] w-[min(62vw,320px)] origin-bottom-left -scale-x-100 sm:h-[min(50vh,340px)] sm:w-[360px] lg:h-[min(52vh,380px)] lg:w-[400px]"
        aria-hidden
      >
        <Image
          src="/brand/tulips-bouquet.png"
          alt=""
          fill
          className="object-contain object-left-bottom"
          sizes="(max-width: 640px) 320px, 400px"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 pl-[min(44vw,12rem)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pl-56 lg:pl-64">
        <p className="font-serif text-lg tracking-[0.15em] text-neutral-900">
          MAGIW MAGIW
        </p>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 transition hover:text-neutral-900"
          >
            Instagram
          </a>
          <p className="text-sm text-neutral-500">{t("footerTagline")}</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500 sm:justify-end">
            {LEGAL_SLUGS.map((slug) => (
              <Link key={slug} href={`/legal/${slug}`} className="transition hover:text-neutral-900">
                {LEGAL_PAGES[locale][slug].navLabel}
              </Link>
            ))}
          </nav>
          <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">{t("footerCreator")}</p>
        </div>
      </div>
    </footer>
  );
}
