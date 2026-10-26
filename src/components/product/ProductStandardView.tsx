"use client";

import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { StyleWithLookSection } from "@/components/product/StyleWithLookSection";
import type { ProductDetail } from "@/lib/types/database";
import { useMemo, useState } from "react";

type ProductStandardViewProps = {
  product: ProductDetail;
  styleWithPartner?: ProductDetail | null;
  styleWithGallery?: string[];
  hasTryOn?: boolean;
};

export function ProductStandardView({
  product,
  styleWithPartner,
  styleWithGallery,
  hasTryOn = false,
}: ProductStandardViewProps) {
  const colorOptions = product.colors ?? [];
  const [selectedColor, setSelectedColor] = useState("");

  const heroImage = useMemo(() => {
    if (!selectedColor) return undefined;
    return product.colorImages?.[selectedColor];
  }, [selectedColor, product.colorImages]);

  return (
    <div
      className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16 ${hasTryOn ? "pb-24 lg:pb-16" : ""}`}
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <ProductGallery
          images={product.images}
          productName={product.name}
          heroImage={heroImage}
        />

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProductPurchasePanel
            product={product}
            styleWithPartner={styleWithPartner}
            selectedColor={selectedColor}
            onSelectedColorChange={setSelectedColor}
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
  );
}
