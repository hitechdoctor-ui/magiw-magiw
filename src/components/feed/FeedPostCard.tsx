"use client";

import type { FeedPost } from "@/lib/types/database";
import { formatPrice, formatRelativeDate } from "@/lib/utils/format";
import Image from "next/image";
import { useRef, useState } from "react";

type FeedPostCardProps = {
  post: FeedPost;
  onShop: () => void;
};

export function FeedPostCard({ post, onShop }: FeedPostCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (post.media_type === "reel" && videoRef.current) {
      void videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (post.media_type === "reel" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <article
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-sm bg-neutral-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: String(post.aspect_ratio) }}
      >
        {post.media_type === "reel" ? (
          <>
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              poster={post.thumbnail_url ?? undefined}
            >
              <source src={post.media_url} type="video/mp4" />
            </video>
            <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white">
              Reel
            </span>
          </>
        ) : (
          <Image
            src={post.media_url}
            alt={post.caption ?? post.product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        <div
          className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="line-clamp-2 text-sm text-white/90">
            {post.caption}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70">
                {post.product.name}
              </p>
              <p className="text-lg font-medium text-white">
                {formatPrice(post.product.price_cents, post.product.currency)}
              </p>
            </div>
            <button
              type="button"
              onClick={onShop}
              className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition hover:bg-neutral-200"
            >
              Αγορά
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 py-3">
        <p className="text-sm text-neutral-800">{post.product.name}</p>
        <p className="text-sm text-neutral-500">
          {formatRelativeDate(post.posted_at)}
        </p>
      </div>
    </article>
  );
}
