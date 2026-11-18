import { ProductShowcaseView } from "@/components/product/showcase/ProductShowcaseView";
import {
  getProductByIdAsync,
  getProductDraftPreviewByIdAsync,
} from "@/lib/data/products-server";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { JsonLd, productJsonLd } from "@/lib/seo/json-ld";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
};

/** Always render on demand — never hit Supabase during `next build`. */
export const dynamic = "force-dynamic";
export const dynamicParams = true;

async function resolveProduct(id: string, previewDraft: boolean) {
  const published = await getProductByIdAsync(id);
  if (published) return { product: published, draftPreview: false as const };

  if (previewDraft && (await isAdminAuthenticated())) {
    const draft = await getProductDraftPreviewByIdAsync(id);
    if (draft) return { product: draft, draftPreview: true as const };
  }

  return null;
}

export async function generateMetadata({
  params,
  searchParams,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const preview = (await searchParams).preview === "draft";
  const resolved = await resolveProduct(id, preview);

  if (!resolved) {
    return { title: "Δεν βρέθηκε", robots: { index: false, follow: false } };
  }

  const { product, draftPreview } = resolved;
  const suffix = draftPreview ? " · Πρόχειρο" : "";
  const description = product.description?.slice(0, 160) ?? undefined;
  const canonical = `/product/${product.slug}`;
  const images = product.images.slice(0, 4).map((url) => ({ url, alt: product.name }));
  return {
    title: `${product.name}${suffix}`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: product.name,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: product.name, description },
    robots: draftPreview ? { index: false, follow: false } : undefined,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { id } = await params;
  const previewDraft = (await searchParams).preview === "draft";
  const resolved = await resolveProduct(id, previewDraft);

  if (!resolved) {
    notFound();
  }

  const { product, draftPreview } = resolved;

  const hasTryOn = product.showVirtualTryOn === true;
  const styleWithSlug = product.styleWith?.slug;
  const styleWithPartner = styleWithSlug
    ? await getProductByIdAsync(styleWithSlug)
    : undefined;
  const styleWithGallery =
    product.styleWith?.galleryImages ??
    (styleWithPartner
      ? [...product.images, ...styleWithPartner.images]
      : undefined);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {!draftPreview && <JsonLd data={productJsonLd(product)} />}
      {draftPreview && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
          <span className="font-medium">Προεπισκόπηση πρόχειρου</span> — δεν
          είναι δημοσιευμένο στο Shop. Άφησε αυτή την καρτέλα ανοιχτή και
          γύρνα στην καρτέλα{" "}
          <strong className="font-medium">AI Copilot</strong> για δημοσίευση ή
          επεξεργασία.
        </div>
      )}
      <ProductShowcaseView
        product={product}
        styleWithPartner={styleWithPartner}
        styleWithGallery={styleWithGallery}
        hasTryOn={hasTryOn}
      />
    </div>
  );
}
