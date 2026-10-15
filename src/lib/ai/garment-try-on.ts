import type { ProductDetail, TryOnGarmentCategory } from "@/lib/types/database";

export type { TryOnGarmentCategory };

export function resolveTryOnCategory(
  product: Pick<ProductDetail, "tryOnCategory" | "name" | "description">,
): TryOnGarmentCategory {
  if (product.tryOnCategory) return product.tryOnCategory;

  const text = `${product.name} ${product.description ?? ""}`.toLowerCase();

  if (/dress|φόρεμα|gown|maxi dress|midi dress/.test(text)) {
    return "dresses";
  }
  if (
    /skirt|φούστα|trouser|pants|jeans|lower body/.test(text) &&
    !/dress|φόρεμα/.test(text)
  ) {
    return "lower_body";
  }
  if (/bustier|top|blouse|shirt|jacket|upper body|μπουστιέ/.test(text)) {
    return "upper_body";
  }

  return "dresses";
}

const LENGTH_HINT_MAXI =
  "full length maxi, hem at ankle or floor, below knee, preserve long dress length, not mini or short";
const LENGTH_HINT_MIDI =
  "midi length dress, hem below knee, not mini or cropped";
const LENGTH_HINT_SET_MAXI =
  "maxi full-length skirt to ankle or floor, not mini; preserve long hem";

function inferLengthHint(
  product: Pick<ProductDetail, "name" | "description" | "garmentDescription">,
): string | null {
  const text = `${product.garmentDescription ?? ""} ${product.name} ${product.description ?? ""}`.toLowerCase();

  if (/maxi|floor.?length|full.?length|μακρ/.test(text)) {
    if (/set|σετ|bustier|φούστα/.test(text)) return LENGTH_HINT_SET_MAXI;
    return LENGTH_HINT_MAXI;
  }
  if (/midi/.test(text)) return LENGTH_HINT_MIDI;
  return null;
}

/**
 * Builds the English `garment_des` prompt for IDM-VTON.
 * Prefer explicit `garmentDescription` on the product when set.
 */
export function buildGarmentDescription(
  product: Pick<
    ProductDetail,
    "garmentDescription" | "name" | "description" | "tryOnCategory"
  >,
): string {
  const explicit = product.garmentDescription?.trim();
  if (explicit) return explicit;

  const category = resolveTryOnCategory(product);
  const lengthHint = inferLengthHint(product);
  const base = [product.name, product.description?.trim()]
    .filter(Boolean)
    .join(". ");

  if (lengthHint) {
    return `${base}. ${lengthHint}.`;
  }

  if (category === "dresses") {
    return `${base}. Long dress, preserve garment length and hem from reference image, not mini.`;
  }

  return `${base}. Preserve proportions and length from reference garment image.`;
}
