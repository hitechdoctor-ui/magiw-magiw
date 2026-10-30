"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { COMPANY, LEGAL_UPDATED } from "@/lib/legal/company";
import { LEGAL_PAGES, LEGAL_SLUGS, LEGAL_UI, type LegalSlug } from "@/lib/legal/legalPages";
import Link from "next/link";

export function LegalDocumentView({ slug }: { slug: LegalSlug }) {
  const { locale } = useLocale();
  const doc = LEGAL_PAGES[locale][slug];
  const ui = LEGAL_UI[locale];

  return (
    <div className="bg-white text-neutral-900">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:py-20">
        <article>
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            {ui.updated}: {LEGAL_UPDATED[locale]}
          </p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.1] tracking-tight">
            {doc.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-neutral-600">{doc.summary}</p>

          {COMPANY.isDemo && (
            <p className="mt-6 max-w-2xl border-l-2 border-amber-400 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
              {ui.demoNotice}
            </p>
          )}

          <div className="mt-12 space-y-10">
            {doc.sections.map((section) => (
              <section key={section.heading} className="border-t border-neutral-200 pt-8">
                <h2 className="text-lg font-medium sm:text-xl">{section.heading}</h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mt-3 text-[15px] leading-relaxed text-neutral-700">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-700 marker:text-neutral-400">
                    {section.list.map((item) => (
                      <li key={item.slice(0, 40)}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">{ui.otherPages}</p>
          <nav className="mt-4 flex flex-col border-t border-neutral-200">
            {LEGAL_SLUGS.map((other) => (
              <Link
                key={other}
                href={`/legal/${other}`}
                aria-current={other === slug ? "page" : undefined}
                className={`border-b border-neutral-200 py-3 text-sm transition ${
                  other === slug ? "font-medium text-neutral-950" : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                {LEGAL_PAGES[locale][other].navLabel}
              </Link>
            ))}
          </nav>
          <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-neutral-500">{ui.contact}</p>
          <p className="mt-3 text-sm text-neutral-700">
            <a href={`mailto:${COMPANY.email}`} className="underline-offset-4 hover:underline">
              {COMPANY.email}
            </a>
            <br />
            {COMPANY.phone}
          </p>
        </aside>
      </div>
    </div>
  );
}

export function LegalHubView() {
  const { locale } = useLocale();
  const ui = LEGAL_UI[locale];

  return (
    <div className="bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.1] tracking-tight">{ui.hubTitle}</h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-neutral-600">{ui.hubLede}</p>
        <ul className="mt-12 grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {LEGAL_SLUGS.map((slug) => {
            const doc = LEGAL_PAGES[locale][slug];
            return (
              <li key={slug} className="bg-white">
                <Link href={`/legal/${slug}`} className="group flex h-full flex-col gap-3 p-6 transition hover:bg-neutral-50">
                  <span className="text-lg font-medium">{doc.title}</span>
                  <span className="text-sm leading-relaxed text-neutral-600">{doc.summary}</span>
                  <span className="mt-auto pt-2 text-xs uppercase tracking-[0.18em] text-neutral-400 transition group-hover:text-neutral-900">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
