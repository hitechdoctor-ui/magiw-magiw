import { EditorialProductView } from "@/components/product/editorial/EditorialProductView";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { StyleWithLookSection } from "@/components/product/StyleWithLookSection";
import { getAllProducts, getProductById } from "@/lib/data/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllProducts().map((product) => ({
    id: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Product Not Found | MAGIW MAGIW" };
  }

  return {
    title: `${product.name} | MAGIW MAGIW`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  if (product.pageLayout === "editorial") {
    return <EditorialProductView product={product} />;
  }

  const hasTryOn = product.showVirtualTryOn === true;
  const styleWithSlug = product.styleWith?.slug;
  const styleWithPartner = styleWithSlug
    ? getProductById(styleWithSlug)
    : undefined;
  const styleWithGallery =
    product.styleWith?.galleryImages ??
    (styleWithPartner
      ? [...product.images, ...styleWithPartner.images]
      : undefined);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900">
      <div
        className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16 ${hasTryOn ? "pb-24 lg:pb-16" : ""}`}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <ProductGallery images={product.images} productName={product.name} />

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ProductPurchasePanel
              product={product}
              styleWithPartner={styleWithPartner}
            />
          </aside>
        </div>

        {styleWithPartner && styleWithGallery && styleWithGallery.length > 0 && (
          <StyleWithLookSection
            current={product}
            partner={styleWithPartner}
            galleryImages={styleWithGallery}
          />
        )}
      </div>
    </div>
  );
}
