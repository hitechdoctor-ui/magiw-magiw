"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { StyleWithLookSection } from "@/components/product/StyleWithLookSection";
import { VirtualTryOnCta } from "@/components/product/VirtualTryOnCta";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";
import { ShowcaseDetailsSection } from "@/components/product/showcase/ShowcaseDetailsSection";
import { ShowcaseHighlightsSection } from "@/components/product/showcase/ShowcaseHighlightsSection";
import { ShowcasePurchasePanel } from "@/components/product/showcase/ShowcasePurchasePanel";
import { PRODUCT_PAGE_COPY } from "@/lib/product/productPageCopy";
import type { ProductDetail } from "@/lib/types/database";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const TAB_TARGETS = [
  { key: "overview", id: "product-overview" },
  { key: "description", id: "product-description" },
  { key: "specifications", id: "product-specifications" },
] as const;

type TabKey = (typeof TAB_TARGETS)[number]["key"];

function useActiveTab() {
  const [active, setActive] = useState<TabKey>("overview");
  const [pastOverview, setPastOverview] = useState(false);

  useEffect(() => {
    const update = () => {
      const probe = window.innerHeight * 0.45;
      let current: TabKey = "overview";
      for (const tab of TAB_TARGETS) {
        const el = document.getElementById(tab.id);
        if (el && el.getBoundingClientRect().top <= probe) current = tab.key;
      }
      setActive(current);
      const overview = document.getElementById("product-overview");
      const specs = document.getElementById("product-specifications");
      const overviewBottom = overview?.getBoundingClientRect().bottom ?? 0;
      const specsBottom = specs?.getBoundingClientRect().bottom ?? 0;
      setPastOverview(overviewBottom < window.innerHeight * 0.35 && specsBottom > window.innerHeight * 0.4);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { active, pastOverview };
}

function TabPill({ active, className }: { active: TabKey; className?: string }) {
  const { locale } = useLocale();
  const copy = PRODUCT_PAGE_COPY[locale];
  return (
    <nav
      aria-label={copy.tabs.overview}
      className={`flex items-center gap-1 rounded-full bg-white/85 p-1 shadow-[0_6px_24px_rgba(0,0,0,.12)] backdrop-blur-md ${className ?? ""}`}
    >
      {TAB_TARGETS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          aria-current={active === tab.key ? "true" : undefined}
          onClick={() => document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className={`rounded-full px-3.5 py-2 text-[9.5px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 ${
            active === tab.key ? "bg-neutral-950 text-white" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          {copy.tabs[tab.key]}
        </button>
      ))}
    </nav>
  );
}

type ProductShowcaseViewProps = {
  product: ProductDetail;
  styleWithPartner?: ProductDetail | null;
  styleWithGallery?: string[];
  hasTryOn?: boolean;
};

export function ProductShowcaseView({
  product,
  styleWithPartner,
  styleWithGallery,
  hasTryOn = false,
}: ProductShowcaseViewProps) {
  const { locale } = useLocale();
  const copy = PRODUCT_PAGE_COPY[locale];
  const [selectedColor, setSelectedColor] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const { active, pastOverview } = useActiveTab();

  const heroImage = useMemo(
    () => (selectedColor && product.colorImages?.[selectedColor]) || product.images[0],
    [selectedColor, product.colorImages, product.images],
  );
  const sideImages = product.images.filter((image, index) => index > 0 && image !== heroImage);
  const detailImage = product.images[1] ?? product.images[0];

  return (
    <div className={`bg-white ${hasTryOn ? "pb-20 lg:pb-0" : ""}`}>
      <section id="product-overview" className="relative scroll-mt-16 bg-[#f1f1f1]">
        {/* Mobile: swipe gallery */}
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto md:hidden">
          {[heroImage, ...sideImages].map((image, index) => (
            <div key={`${image}-${index}`} className="relative aspect-[4/5] w-[86vw] shrink-0 snap-center bg-[#e9e9e9]">
              <Image
                src={image}
                alt={copy.imageAlt(product.name, index)}
                fill
                priority={index === 0}
                sizes="86vw"
                className="object-cover object-top"
              />
            </div>
          ))}
        </div>

        <div
          className={`md:grid ${
            sideImages.length > 0
              ? "md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,25rem)]"
              : "md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]"
          }`}
        >
          <div className="relative z-10 hidden md:block">
            <div className="sticky top-16 h-[calc(100dvh-4rem)]">
              <div className="absolute inset-0 overflow-hidden bg-[#e9e9e9]">
                <Image
                  key={heroImage}
                  src={heroImage}
                  alt={copy.imageAlt(product.name, 0)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 60vw, 34vw"
                  className="object-cover object-top"
                />
              </div>
              <TabPill active={active} className="absolute bottom-6 left-6 whitespace-nowrap" />
            </div>
          </div>

          {sideImages.length > 0 && (
            <div className="hidden flex-col gap-px border-l border-white lg:flex">
              {sideImages.map((image, index) => (
                <div key={`${image}-${index}`} className="relative h-[calc((100dvh-4rem)*0.62)] bg-[#e9e9e9]">
                  <Image
                    src={image}
                    alt={copy.imageAlt(product.name, index + 1)}
                    fill
                    sizes="34vw"
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>
          )}

          <aside className="bg-[#f1f1f1] px-5 py-8 sm:px-8 md:sticky md:top-16 md:max-h-[calc(100dvh-4rem)] md:self-start md:overflow-y-auto md:px-8 md:py-10 lg:px-10">
            <ShowcasePurchasePanel
              product={product}
              styleWithPartner={styleWithPartner}
              selectedColor={selectedColor}
              onSelectedColorChange={setSelectedColor}
              onOpenSizeGuide={() => setSizeGuideOpen(true)}
              onOpenTryOn={hasTryOn ? () => setTryOnOpen(true) : undefined}
            />
          </aside>
        </div>
      </section>

      <div
        className={`pointer-events-none fixed left-6 top-20 z-30 hidden transition-all duration-300 md:block ${
          pastOverview ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <TabPill active={active} className={pastOverview ? "pointer-events-auto" : ""} />
      </div>

      <ShowcaseDetailsSection product={product} image={detailImage} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
      <ShowcaseHighlightsSection product={product} partner={styleWithPartner} image={product.images[0]} />

      {styleWithPartner && styleWithGallery && styleWithGallery.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <StyleWithLookSection current={product} partner={styleWithPartner} galleryImages={styleWithGallery} />
        </div>
      )}

      {hasTryOn && !tryOnOpen && <VirtualTryOnCta variant="sticky" onClick={() => setTryOnOpen(true)} />}

      {sizeGuideOpen && (
        <SizeGuideModal
          productName={product.name}
          sku={product.sku}
          sizeGuide={
            product.sizeGuide ?? {
              rows: product.sizes.map((size) => ({ size, bust: "—", waist: "—", hips: "—" })),
              customFitNote: "Για custom fit, επικοινώνησε με το ατελιέ MAGIW MAGIW.",
            }
          }
          onClose={() => setSizeGuideOpen(false)}
        />
      )}

      {tryOnOpen && (
        <VirtualTryOnModal
          productName={product.name}
          productImage={product.images[0]}
          productSlug={product.slug}
          garmentDescription={product.garmentDescription}
          tryOnCategory={product.tryOnCategory}
          onClose={() => setTryOnOpen(false)}
        />
      )}
    </div>
  );
}
