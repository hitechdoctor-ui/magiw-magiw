import type { FeedPost } from "@/lib/types/database";
import { FashionPostCard } from "./FashionPostCard";

type FashionGridProps = {
  posts: FeedPost[];
};

export function FashionGrid({ posts }: FashionGridProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {posts.map((post) => (
          <FashionPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
