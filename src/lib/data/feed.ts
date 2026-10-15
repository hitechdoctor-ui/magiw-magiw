import { mockFeed } from "@/lib/data/mock-feed";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { FeedPost, Product } from "@/lib/types/database";

type SupabaseFeedRow = {
  id: string;
  instagram_id: string | null;
  media_type: "image" | "reel";
  media_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  aspect_ratio: number;
  product_id: string | null;
  display_order: number;
  is_featured: boolean;
  posted_at: string | null;
  products: Product | Product[] | null;
};

function normalizeProduct(
  products: Product | Product[] | null,
): Product | null {
  if (!products) return null;
  return Array.isArray(products) ? (products[0] ?? null) : products;
}

export async function getFeedPosts(): Promise<FeedPost[]> {
  if (!isSupabaseConfigured()) {
    return mockFeed;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("instagram_posts")
    .select(
      `
      id,
      instagram_id,
      media_type,
      media_url,
      thumbnail_url,
      caption,
      aspect_ratio,
      product_id,
      display_order,
      is_featured,
      posted_at,
      products (
        id,
        name,
        slug,
        description,
        price_cents,
        currency,
        sizes,
        stock,
        is_active
      )
    `,
    )
    .order("display_order", { ascending: false });

  if (error || !data?.length) {
    return mockFeed;
  }

  return (data as SupabaseFeedRow[])
    .map((row) => {
      const product = normalizeProduct(row.products);
      if (!product) return null;

      return {
        id: row.id,
        instagram_id: row.instagram_id,
        media_type: row.media_type,
        media_url: row.media_url,
        thumbnail_url: row.thumbnail_url,
        caption: row.caption,
        aspect_ratio: Number(row.aspect_ratio) || 1,
        product_id: row.product_id,
        display_order: row.display_order,
        is_featured: row.is_featured,
        posted_at: row.posted_at,
        product,
      } satisfies FeedPost;
    })
    .filter((post): post is FeedPost => post !== null);
}
