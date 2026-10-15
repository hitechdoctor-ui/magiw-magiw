import { handmadeSatinSet } from "@/lib/data/featured-product";
import { mockFeed } from "@/lib/data/mock-feed";
import type { ProductDetail } from "@/lib/types/database";

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

    if (!existing) {
      catalog.set(post.product.id, {
        ...post.product,
        images,
      });
      continue;
    }

    const mergedImages = [...existing.images];
    for (const image of images) {
      if (!mergedImages.includes(image)) mergedImages.push(image);
    }

    catalog.set(post.product.id, {
      ...existing,
      images: mergedImages,
    });
  }

  return Array.from(catalog.values());
}

function mergeFeaturedProducts(catalog: ProductDetail[]): ProductDetail[] {
  const featured = [handmadeSatinSet];
  const bySlug = new Map(catalog.map((product) => [product.slug, product]));

  for (const product of featured) {
    bySlug.set(product.slug, product);
  }

  return Array.from(bySlug.values());
}

const productCatalog = mergeFeaturedProducts(buildProductCatalog());

export function getAllProducts(): ProductDetail[] {
  return productCatalog;
}

export function getProductById(id: string): ProductDetail | undefined {
  return productCatalog.find(
    (product) => product.id === id || product.slug === id,
  );
}

export function getProductSlugs(): string[] {
  return productCatalog.map((product) => product.slug);
}
