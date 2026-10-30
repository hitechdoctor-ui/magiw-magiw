"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { LANDING_COPY } from "@/lib/landing/landingCopy";
import { LEGAL_PAGES, LEGAL_SLUGS } from "@/lib/legal/legalPages";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useId, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
        open ? "bg-white" : "bg-neutral-950"
      }`}
    >
      <span
        className={`absolute h-[1.5px] w-2.5 transition-[transform,background-color] duration-300 ${
          open ? "rotate-45 bg-neutral-950" : "bg-white"
        }`}
      />
      <span
        className={`absolute h-2.5 w-[1.5px] transition-[transform,background-color] duration-300 ${
          open ? "rotate-45 bg-neutral-950" : "bg-white"
        }`}
      />
    </span>
  );
}

export function LandingHelpCenterSection() {
  const { locale } = useLocale();
  const copy = LANDING_COPY[locale].helpCenter;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <>
      <section
        id="help-center"
        aria-label={copy.ariaLabel}
        className="relative scroll-mt-20 bg-white pb-20 pt-20 text-neutral-950 sm:pb-24 sm:pt-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <h2 className="text-[clamp(2rem,4.6vw,3rem)] font-medium leading-[1.1] tracking-tight">{copy.title}</h2>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-neutral-700 sm:text-[15px]">{copy.intro}</p>
        </div>

        <ul className="mt-10 border-t border-neutral-900">
          {copy.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            return (
              <li
                key={item.question}
                className={`border-b border-neutral-200 transition-colors duration-300 ${
                  open ? "bg-neutral-950 text-white" : "bg-white text-neutral-950"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-5 text-left sm:px-10"
                >
                  <span className="text-[15px] font-medium sm:text-[17px]">{item.question}</span>
                  <ToggleIcon open={open} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="mx-auto max-w-6xl px-5 pb-6 sm:px-10">
                        <p className="max-w-4xl text-[13px] leading-relaxed text-white/85 sm:text-sm">{item.answer}</p>
                        {item.link && (
                          <Link
                            href={item.link.href}
                            className="mt-3 inline-block text-[12px] uppercase tracking-[0.16em] text-white underline-offset-4 hover:underline"
                          >
                            {item.link.label} →
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="bg-neutral-950 px-5 py-10 text-white/70 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <nav aria-label={copy.legalLinksLabel} className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.14em]">
            {LEGAL_SLUGS.map((slug) => (
              <Link key={slug} href={`/legal/${slug}`} className="transition hover:text-white">
                {LEGAL_PAGES[locale][slug].navLabel}
              </Link>
            ))}
          </nav>
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">
            © {new Date().getFullYear()} MAGIW MAGIW · {copy.copyright} · HitechDoctor
          </p>
        </div>
      </footer>
    </>
  );
}
