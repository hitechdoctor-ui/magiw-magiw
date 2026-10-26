import "server-only";

import { getAllProducts, getProductById } from "@/lib/data/products";
import type { ProductDetail } from "@/lib/types/database";
import {
  getStoredProductBySlugOrId,
  listActiveStoredProducts,
} from "@/lib/products/store";
import { isStaticProductDeleted } from "@/lib/products/static-catalog-overrides";
import { storedProductToDetail } from "@/lib/products/to-product-detail";

export async function getProductByIdAsync(
  id: string,
): Promise<ProductDetail | undefined> {
  const staticProduct = getProductById(id);
  if (staticProduct) {
    if (await isStaticProductDeleted(staticProduct.slug)) return undefined;
    return staticProduct;
  }

  const stored = await listActiveStoredProducts();
  const match = stored.find(
    (p) => p.id === id || p.slug === id || p.sku === id,
  );
  return match ? storedProductToDetail(match) : undefined;
}

/** Draft AI products (is_active false) — admin preview only. */
export async function getProductDraftPreviewByIdAsync(
  id: string,
): Promise<ProductDetail | undefined> {
  const stored = await getStoredProductBySlugOrId(id);
  if (!stored || stored.is_active) return undefined;
  return storedProductToDetail(stored);
}

const STATIC_SLUGS = new Set(
  getAllProducts().map((product) => product.slug),
);

/** AI / DB products that are published and not already in the static catalog. */
export async function getPublishedCatalogExtras(): Promise<ProductDetail[]> {
  const stored = await listActiveStoredProducts();
  return stored
    .map(storedProductToDetail)
    .filter((product) => !STATIC_SLUGS.has(product.slug));
}

export async function getAllProductsAsync(): Promise<ProductDetail[]> {
  const stored = await listActiveStoredProducts();
  const dbDetails = stored.map(storedProductToDetail);
  const merged = new Map<string, ProductDetail>();

  for (const product of getAllProducts()) {
    merged.set(product.slug, product);
  }
  for (const product of dbDetails) {
    merged.set(product.slug, product);
  }

  return Array.from(merged.values());
}
