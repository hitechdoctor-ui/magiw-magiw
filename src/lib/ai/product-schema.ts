export const PRODUCT_CATEGORIES = [
  "Evelina's",
  "Gino",
  "Evelina's Kids & Baby",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "Custom"] as const;

export type AiProductDraft = {
  name: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  price: number;
  sizes: (typeof PRODUCT_SIZES)[number][];
  features: string[];
  is_bundle: boolean;
  /** Greek color names when the piece comes in variants, e.g. Πράσινο, Λευκό */
  colors: string[];
  /** Which uploaded photo (1 = first in this message) shows each color on the shop */
  color_photos: { color: string; photo_index: number }[];
};

/** OpenAI strict JSON schema for `response_format.json_schema`. */
export const aiProductJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "name",
    "subtitle",
    "description",
    "category",
    "price",
    "sizes",
    "features",
    "is_bundle",
    "colors",
    "color_photos",
  ],
  properties: {
    name: {
      type: "string",
      description: "Product title in Greek or bilingual atelier tone",
    },
    subtitle: {
      type: "string",
      description: 'Collection line, e.g. "Evelina Collection — April 2026"',
    },
    description: {
      type: "string",
      description:
        "SEO-friendly Greek product description, 120–220 words, slow-fashion atelier voice",
    },
    category: {
      type: "string",
      enum: [...PRODUCT_CATEGORIES],
    },
    price: {
      type: "number",
      description: "Retail price in EUR (whole euros or decimals)",
    },
    sizes: {
      type: "array",
      items: {
        type: "string",
        enum: [...PRODUCT_SIZES],
      },
      minItems: 1,
    },
    features: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 8,
    },
    is_bundle: {
      type: "boolean",
      description: "True for multi-piece sets or styled looks sold as one offer",
    },
    colors: {
      type: "array",
      items: { type: "string" },
      minItems: 0,
      maxItems: 8,
      description:
        "Color variants when user mentions multiple colors; Greek labels (Πράσινο, Λευκό). Empty if single color only.",
    },
    color_photos: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["color", "photo_index"],
        properties: {
          color: {
            type: "string",
            description: "Must match an entry in colors",
          },
          photo_index: {
            type: "integer",
            description:
              "1-based index of the photo attached to this user message (first image = 1). Match each colorway to the photo that shows that garment color.",
          },
        },
      },
      description:
        "When multiple photos are attached, link each color to the photo that shows it. Empty if one photo or no color variants.",
    },
  },
} as const;

export function parseAiProductDraft(raw: unknown): AiProductDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const category = o.category;
  if (!PRODUCT_CATEGORIES.includes(category as ProductCategory)) return null;

  const sizesRaw = o.sizes;
  if (!Array.isArray(sizesRaw) || sizesRaw.length === 0) return null;
  const sizes = sizesRaw.filter((s): s is (typeof PRODUCT_SIZES)[number] =>
    PRODUCT_SIZES.includes(s as (typeof PRODUCT_SIZES)[number]),
  );
  if (sizes.length === 0) return null;

  const features = o.features;
  if (!Array.isArray(features) || features.some((f) => typeof f !== "string")) {
    return null;
  }

  const price = o.price;
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return null;
  }

  if (typeof o.name !== "string" || !o.name.trim()) return null;
  if (typeof o.subtitle !== "string" || !o.subtitle.trim()) return null;
  if (typeof o.description !== "string" || !o.description.trim()) return null;
  if (typeof o.is_bundle !== "boolean") return null;

  const colorsRaw = o.colors;
  const colors =
    Array.isArray(colorsRaw) && colorsRaw.every((c) => typeof c === "string")
      ? colorsRaw.map((c) => String(c).trim()).filter(Boolean)
      : [];

  const colorPhotosRaw = o.color_photos;
  const color_photos: AiProductDraft["color_photos"] = [];
  if (Array.isArray(colorPhotosRaw)) {
    for (const entry of colorPhotosRaw) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const color = typeof row.color === "string" ? row.color.trim() : "";
      const photo_index = row.photo_index;
      if (
        !color ||
        typeof photo_index !== "number" ||
        !Number.isInteger(photo_index) ||
        photo_index < 1
      ) {
        continue;
      }
      color_photos.push({ color, photo_index });
    }
  }

  return {
    name: o.name.trim(),
    subtitle: o.subtitle.trim(),
    description: o.description.trim(),
    category: category as ProductCategory,
    price,
    sizes,
    features: features.map((f) => String(f).trim()).filter(Boolean),
    is_bundle: o.is_bundle,
    colors,
    color_photos,
  };
}
