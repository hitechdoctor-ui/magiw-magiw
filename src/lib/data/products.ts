import { FEATURED_PRODUCTS } from "@/lib/data/featured-products";
import { mockFeed } from "@/lib/data/mock-feed";
import type { Product, ProductDetail } from "@/lib/types/database";

function resolvePostImages(
  mediaUrl: string,
  gallery?: string[],
  mediaType?: string,
  thumbnailUrl?: string | null,
  hasSprite?: boolean,
): string[] {
  if (gallery?.length) return gallery;
  if (hasSprite && thumbnailUrl) return [thumbnailUrl];
  if (mediaType === "image" && !hasSprite) return [mediaUrl];
  if (thumbnailUrl) return [thumbnailUrl];
  return [mediaUrl];
}

function toProductDetail(product: Product, images: string[]): ProductDetail {
  return {
    ...product,
    images,
    sku: product.sku ?? `REF-${product.slug.toUpperCase().replace(/-/g, "")}`,
  };
}

function buildProductCatalog(): ProductDetail[] {
  const catalog = new Map<string, ProductDetail>();

  for (const post of mockFeed) {
    const images = resolvePostImages(
      post.media_url,
      post.gallery,
      post.media_type,
      post.thumbnail_url,
      Boolean(post.media_sprite),
    );

    const existing = catalog.get(post.product.id);
    const detail = toProductDetail(post.product, images);

    if (!existing) {
      catalog.set(post.product.id, detail);
      continue;
    }

    const mergedImages = [...existing.images];
    for (const image of images) {
      if (!mergedImages.includes(image)) mergedImages.push(image);
    }

    catalog.set(post.product.id, {
      ...existing,
      ...detail,
      images: mergedImages,
      sku: post.product.sku ?? existing.sku,
    });
  }

  return Array.from(catalog.values());
}

function mergeFeaturedProducts(catalog: ProductDetail[]): ProductDetail[] {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const bySlug = new Map(catalog.map((product) => [product.slug, product]));

  for (const featured of FEATURED_PRODUCTS) {
    byId.set(featured.id, featured);
    bySlug.set(featured.slug, featured);
  }

  const merged = new Map<string, ProductDetail>();
  for (const product of byId.values()) {
    merged.set(product.id, product);
  }
  for (const featured of FEATURED_PRODUCTS) {
    merged.set(featured.id, featured);
  }

  return Array.from(merged.values());
}

const productCatalog = mergeFeaturedProducts(buildProductCatalog());

export function getAllProducts(): ProductDetail[] {
  return productCatalog;
}

export function getProductById(id: string): ProductDetail | undefined {
  return productCatalog.find(
    (product) =>
      product.id === id || product.slug === id || product.sku === id,
  );
}

export function getProductSlugs(): string[] {
  return productCatalog.map((product) => product.slug);
}
