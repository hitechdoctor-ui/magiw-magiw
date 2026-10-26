"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { COLLECTIONS, COLLECTION_KEYS } from "@/lib/data/collections";
import { getCollectionMessages } from "@/lib/i18n/messages";
import { getProductById } from "@/lib/data/products";
import type { ProductDetail } from "@/lib/types/database";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";

type ShopPageContentProps = {
  catalogExtras?: ProductDetail[];
  hiddenStaticSlugs?: string[];
};

function ProductGrid({ products }: { products: ProductDetail[] }) {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/product/${product.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover object-center transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <p className="mt-4 font-serif text-lg text-neutral-950">{product.name}</p>
            <p className="mt-1 text-sm text-neutral-600">
              {formatPricePrecise(product.price_cents, product.currency)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ShopPageContent({
  catalogExtras = [],
  hiddenStaticSlugs = [],
}: ShopPageContentProps) {
  const { t, locale } = useLocale();
  const hidden = new Set(hiddenStaticSlugs);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.32em] text-neutral-400 transition hover:text-neutral-700"
        >
          {t("shopBack")}
        </Link>
        <h1 className="mt-6 font-serif text-4xl tracking-tight text-neutral-950 sm:text-5xl">
          {t("shopTitle")}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600">
          {t("shopIntro")}
        </p>

        <div className="mt-14 space-y-16">
          {COLLECTION_KEYS.map((key) => {
            const collection = getCollectionMessages(locale, key);
            const products = COLLECTIONS[key].productSlugs
              .filter((slug) => !hidden.has(slug))
              .map((slug) => getProductById(slug))
              .filter((product) => product !== undefined);

            return (
              <section key={key} id={key}>
                <div className="border-b border-stone-200 pb-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                    {collection.navLabel}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-neutral-950 sm:text-3xl">
                    {collection.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
                    {collection.description}
                  </p>
                </div>

                <ProductGrid products={products} />
              </section>
            );
          })}

          {catalogExtras.length > 0 && (
            <section id="ai-catalog">
              <div className="border-b border-stone-200 pb-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  AI Copilot
                </p>
                <h2 className="mt-2 font-serif text-2xl text-neutral-950 sm:text-3xl">
                  Νέα από το ατελιέ
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
                  Δημοσιευμένα προϊόντα από το Admin AI Copilot — ζωντανά στο
                  κατάστημα.
                </p>
              </div>
              <ProductGrid products={catalogExtras} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
