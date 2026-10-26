import type { ProductCategory } from "@/lib/ai/product-schema";

export type StoredProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  subtitle: string | null;
  description: string | null;
  category: ProductCategory | null;
  price_cents: number;
  currency: string;
  sizes: string[];
  features: string[];
  colors: string[];
  is_bundle: boolean;
  stock: number;
  is_active: boolean;
  image_urls: string[];
  /** Color label → image URL for PDP color switcher */
  color_images: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type CreateStoredProductInput = {
  draft: import("@/lib/ai/product-schema").AiProductDraft;
  /** When false, product is saved as draft until admin publishes. */
  isActive?: boolean;
};
