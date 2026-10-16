import { getFeedPosts } from "@/lib/data/feed";
import { getProductById } from "@/lib/data/products";
import type { FeedPost, ProductDetail } from "@/lib/types/database";

export type LookbookSlide = {
  post: FeedPost;
  product: ProductDetail;
  heroMediaUrl: string;
  posterUrl: string | null;
  isVideo: boolean;
};

export async function getLookbookSlides(): Promise<LookbookSlide[]> {
  const posts = await getFeedPosts();

  const slides: LookbookSlide[] = [];

  for (const post of posts) {
    const catalogProduct = getProductById(post.product.slug);
    const product: ProductDetail = catalogProduct ?? {
      ...post.product,
      images: post.gallery?.length
        ? post.gallery
        : [post.thumbnail_url ?? post.media_url],
      sku:
        post.product.sku ??
        `REF-${post.product.slug.toUpperCase().replace(/-/g, "")}`,
    };

    const isVideo = post.media_type === "reel";
    const heroMediaUrl = isVideo
      ? post.media_url
      : (post.gallery?.[0] ?? post.media_url);

    slides.push({
      post,
      product,
      heroMediaUrl,
      posterUrl: post.thumbnail_url ?? product.images[0] ?? null,
      isVideo,
    });
  }

  return slides;
}
