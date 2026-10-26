import { inferColorImagesFromGallery } from "@/lib/products/color-images";
import type { StoredProduct } from "@/lib/products/types";
import type { ProductDetail } from "@/lib/types/database";

const PLACEHOLDER_IMAGE = "/images/sample-set.jpg";

export function storedProductToDetail(row: StoredProduct): ProductDetail {
  const colorImages = inferColorImagesFromGallery(row);
  const featureSection =
    row.features.length > 0
      ? [
          {
            id: "features",
            title: "Λεπτομέρειες & Υλικά",
            content: row.features.map((f) => `· ${f}`).join("\n"),
          },
        ]
      : [];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    description: row.description,
    price_cents: row.price_cents,
    currency: row.currency,
    sizes: row.sizes,
    colors: row.colors?.length ? row.colors : undefined,
    colorImages: Object.keys(colorImages).length > 0 ? colorImages : undefined,
    stock: row.stock,
    is_active: row.is_active,
    images:
      row.image_urls?.length > 0 ? row.image_urls : [PLACEHOLDER_IMAGE],
    statusLabel: row.subtitle ?? "Χειροποίητο στο ατελιέ μας",
    showVirtualTryOn: false,
    editorial: row.subtitle
      ? { collectionLine: row.subtitle }
      : undefined,
    sections: featureSection,
  };
}
