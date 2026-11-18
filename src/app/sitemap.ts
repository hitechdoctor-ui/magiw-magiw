import {
  getAllProductsAsync,
  getProductByIdAsync,
} from "@/lib/data/products-server";
import { LEGAL_SLUGS } from "@/lib/legal/legalPages";
import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

/** Built per request so new products appear without a redeploy (and no DB access at build). */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/legal"), changeFrequency: "yearly", priority: 0.2 },
    ...LEGAL_SLUGS.map((slug) => ({
      url: absoluteUrl(`/legal/${slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];

  let products: MetadataRoute.Sitemap = [];
  try {
    const all = await getAllProductsAsync();
    const visible = await Promise.all(
      all.map(async (product) =>
        (await getProductByIdAsync(product.slug)) ? product : null,
      ),
    );
    products = visible
      .filter((product) => product !== null)
      .map((product) => ({
        url: absoluteUrl(`/product/${product.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: product.images.slice(0, 3).map(absoluteUrl),
      }));
  } catch (error) {
    console.error("[sitemap] products unavailable", error);
  }

  return [...pages, ...products];
}
