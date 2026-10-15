import type { MediaSprite } from "@/lib/utils/sprite";

export type MediaType = "image" | "reel";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  currency: string;
  sizes: string[];
  stock: number;
  is_active: boolean;
};

export type ProductAccordionSection = {
  id: string;
  title: string;
  content: string;
};

export type ProductDetail = Product & {
  images: string[];
  sku?: string;
  statusLabel?: string;
  showVirtualTryOn?: boolean;
  sections?: ProductAccordionSection[];
};

export type InstagramPost = {
  id: string;
  instagram_id: string | null;
  media_type: MediaType;
  media_url: string;
  media_sprite?: MediaSprite | null;
  thumbnail_url: string | null;
  caption: string | null;
  aspect_ratio: number;
  product_id: string | null;
  display_order: number;
  is_featured: boolean;
  posted_at: string | null;
  product: Product | null;
  gallery?: string[];
};

export type FeedPost = InstagramPost & {
  product: Product;
};
