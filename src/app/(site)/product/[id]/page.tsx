import { EditorialProductView } from "@/components/product/editorial/EditorialProductView";
import { ProductStandardView } from "@/components/product/ProductStandardView";
import { getAllProducts } from "@/lib/data/products";
import {
  getAllProductsAsync,
  getProductByIdAsync,
  getProductDraftPreviewByIdAsync,
} from "@/lib/data/products-server";
import { isAdminAuthenticated } from "@/lib/admin/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const [staticProducts, allProducts] = await Promise.all([
    Promise.resolve(getAllProducts()),
    getAllProductsAsync(),
  ]);
  const slugs = new Set([
    ...staticProducts.map((p) => p.slug),
    ...allProducts.map((p) => p.slug),
  ]);
  return Array.from(slugs).map((id) => ({ id }));
}

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
    return { title: "Product Not Found | MAGIW MAGIW" };
  }

  const suffix = resolved.draftPreview ? " · Πρόχειρο" : "";
  return {
    title: `${resolved.product.name}${suffix} | MAGIW MAGIW`,
    description: resolved.product.description ?? undefined,
    robots: resolved.draftPreview ? { index: false, follow: false } : undefined,
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

  if (product.pageLayout === "editorial") {
    return <EditorialProductView product={product} />;
  }

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
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900">
      {draftPreview && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
          <span className="font-medium">Προεπισκόπηση πρόχειρου</span> — δεν
          είναι δημοσιευμένο στο Shop. Άφησε αυτή την καρτέλα ανοιχτή και
          γύρνα στην καρτέλα{" "}
          <strong className="font-medium">AI Copilot</strong> για δημοσίευση ή
          επεξεργασία.
        </div>
      )}
      <ProductStandardView
        product={product}
        styleWithPartner={styleWithPartner}
        styleWithGallery={styleWithGallery}
        hasTryOn={hasTryOn}
      />
    </div>
  );
}
