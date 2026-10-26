import type { AiProductDraft } from "@/lib/ai/product-schema";
import type { StoredProduct } from "@/lib/products/types";

export type ColorPhotoLink = {
  color: string;
  photo_index: number;
};

/** Build map color label → public image URL from AI links + uploaded paths. */
export function buildColorImagesMap(input: {
  colors: string[];
  colorPhotos: ColorPhotoLink[];
  imageUrls: string[];
  /** Index in imageUrls where this request's uploads start */
  uploadStartIndex: number;
  uploadCount: number;
}): Record<string, string> {
  const { colors, colorPhotos, imageUrls, uploadStartIndex, uploadCount } =
    input;
  const map: Record<string, string> = {};

  for (const link of colorPhotos) {
    const color = link.color.trim();
    if (!color) continue;
    const batchIdx = link.photo_index - 1;
    if (batchIdx < 0 || batchIdx >= uploadCount) continue;
    const url = imageUrls[uploadStartIndex + batchIdx];
    if (url) map[color] = url;
  }

  if (Object.keys(map).length === 0 && colors.length > 0 && uploadCount > 0) {
    for (let i = 0; i < colors.length; i += 1) {
      const batchIdx = Math.min(i, uploadCount - 1);
      const url = imageUrls[uploadStartIndex + batchIdx];
      if (url) map[colors[i]] = url;
    }
  }

  return map;
}

export function mergeColorImagesForProduct(
  existing: Record<string, string> | undefined,
  fresh: Record<string, string>,
  activeColors: string[],
): Record<string, string> {
  const merged = { ...(existing ?? {}), ...fresh };
  for (const key of Object.keys(merged)) {
    if (!activeColors.includes(key)) delete merged[key];
  }
  return merged;
}

/** Fallback for older products: 1st color → 1st image, etc. */
export function inferColorImagesFromGallery(
  product: Pick<StoredProduct, "colors" | "image_urls" | "color_images">,
): Record<string, string> {
  if (product.color_images && Object.keys(product.color_images).length > 0) {
    return product.color_images;
  }
  const colors = product.colors ?? [];
  const urls = product.image_urls ?? [];
  if (colors.length < 2 || urls.length < 2) return {};

  const map: Record<string, string> = {};
  for (let i = 0; i < colors.length; i += 1) {
    const url = urls[i];
    if (url) map[colors[i]] = url;
  }
  return map;
}

export function colorImageFromDraft(
  draft: AiProductDraft,
  imageUrls: string[],
  uploadStartIndex: number,
  uploadCount: number,
): Record<string, string> {
  return buildColorImagesMap({
    colors: draft.colors,
    colorPhotos: draft.color_photos,
    imageUrls,
    uploadStartIndex,
    uploadCount,
  });
}
