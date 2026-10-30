"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { PRODUCT_PAGE_COPY } from "@/lib/product/productPageCopy";
import type { ProductDetail } from "@/lib/types/database";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useId, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Faint star dust used on the dark product sections. */
export const STAR_DUST_STYLE = {
  backgroundColor: "#060606",
  backgroundImage:
    "radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,.35) 50%, transparent 51%)," +
    "radial-gradient(1px 1px at 68% 42%, rgba(255,255,255,.25) 50%, transparent 51%)," +
    "radial-gradient(1.5px 1.5px at 35% 76%, rgba(255,255,255,.2) 50%, transparent 51%)," +
    "radial-gradient(1px 1px at 88% 85%, rgba(255,255,255,.3) 50%, transparent 51%)," +
    "radial-gradient(1px 1px at 52% 8%, rgba(255,255,255,.2) 50%, transparent 51%)",
  backgroundSize: "260px 260px",
} as const;

type DetailItem = { id: string; title: string; body: ReactNode };

function CircleToggle({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white/90"
    >
      <span
        className={`absolute h-[1.5px] w-2.5 bg-white transition-transform duration-300 ${open ? "rotate-45" : ""}`}
      />
      <span
        className={`absolute h-2.5 w-[1.5px] bg-white transition-transform duration-300 ${open ? "rotate-45" : ""}`}
      />
    </span>
  );
}

type ShowcaseDetailsSectionProps = {
  product: ProductDetail;
  image: string;
  onOpenSizeGuide: () => void;
};

export function ShowcaseDetailsSection({ product, image, onOpenSizeGuide }: ShowcaseDetailsSectionProps) {
  const { locale } = useLocale();
  const copy = PRODUCT_PAGE_COPY[locale];
  const baseId = useId();

  const items: DetailItem[] = [
    ...(product.description
      ? [{ id: "description", title: copy.descriptionTitle, body: <p>{product.description}</p> }]
      : []),
    ...(product.sections ?? []).map((section) => ({
      id: section.id,
      title: section.title,
      body: <p className="whitespace-pre-line">{section.content}</p>,
    })),
    {
      id: "shipping",
      title: copy.shippingTitle,
      body: (
        <>
          <p>{copy.shippingText}</p>
          <Link href="/legal/shipping" className="mt-3 inline-block text-white underline underline-offset-4">
            {copy.shippingMore} →
          </Link>
        </>
      ),
    },
    {
      id: "size",
      title: copy.sizeTitle,
      body: (
        <>
          <p>{copy.sizeText}</p>
          <button type="button" onClick={onOpenSizeGuide} className="mt-3 text-white underline underline-offset-4">
            {copy.sizeOpen} →
          </button>
        </>
      ),
    },
  ];

  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section id="product-description" className="relative scroll-mt-16 text-white" style={STAR_DUST_STYLE}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-14 md:py-24 lg:px-12">
        <ul className="divide-y divide-white/15">
          {items.map((item) => {
            const open = openId === item.id;
            const panelId = `${baseId}-${item.id}`;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[clamp(1rem,1.5vw,1.25rem)] font-semibold uppercase tracking-[0.02em]">
                    {item.title}
                  </span>
                  <CircleToggle open={open} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-[13px] leading-relaxed text-white/80">{item.body}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-200 md:aspect-[5/4]">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
