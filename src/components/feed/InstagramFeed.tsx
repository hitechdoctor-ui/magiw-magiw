"use client";

import { useCart } from "@/components/cart/CartProvider";
import { getProductById } from "@/lib/data/products";
import type { FeedPost } from "@/lib/types/database";
import { FeedPostCard } from "./FeedPostCard";
import { ProductModal } from "./ProductModal";
import { useState } from "react";

type InstagramFeedProps = {
  posts: FeedPost[];
};

export function InstagramFeed({ posts }: InstagramFeedProps) {
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const { addProduct } = useCart();

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              Shoppable Feed
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-950 sm:text-4xl">
              Ζήσε το look. Αγόρασε το τώρα.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
            Κάθε post από το Instagram συνδέεται άμεσα με το προϊόν — scroll,
            discover, shop.
          </p>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {posts.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              onShop={() => setSelectedPost(post)}
            />
          ))}
        </div>
      </section>

      {selectedPost && (
        <ProductModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onAddToCart={(size) => {
            const detail = getProductById(selectedPost.product.slug);
            if (detail) addProduct(detail, size);
            setSelectedPost(null);
          }}
        />
      )}
    </>
  );
}
