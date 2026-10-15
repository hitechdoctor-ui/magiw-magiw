"use client";

import { SpriteImage } from "@/components/ui/SpriteImage";
import type { FeedPost } from "@/lib/types/database";
import { formatPrice } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type FashionPostCardProps = {
  post: FeedPost;
};

export function FashionPostCard({ post }: FashionPostCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const productHref = `/product/${post.product.slug}`;

  const handleMouseEnter = () => {
    if (post.media_type === "reel" && videoRef.current) {
      void videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (post.media_type === "reel" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <article
      className="post-card group relative overflow-hidden bg-neutral-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={productHref} className="relative block aspect-[4/5] w-full overflow-hidden">
        {post.media_sprite ? (
          <SpriteImage
            sprite={post.media_sprite}
            alt={post.product.name}
            className="post-media"
          />
        ) : post.media_type === "reel" ? (
          <>
            <video
              ref={videoRef}
              className="post-media h-full w-full object-cover"
              muted
              loop
              playsInline
              poster={post.thumbnail_url ?? undefined}
            >
              <source src={post.media_url} type="video/mp4" />
            </video>
            <span className="absolute left-3 top-3 z-10 text-[10px] font-medium uppercase tracking-[0.2em] text-white drop-shadow-sm">
              Reel
            </span>
          </>
        ) : (
          <Image
            src={post.media_url}
            alt={post.product.name}
            fill
            className="post-media object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        <div className="post-overlay" aria-hidden="true" />

        <div className="post-overlay-content absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6">
          <p className="text-2xl font-light tracking-wide text-white sm:text-3xl">
            {formatPrice(post.product.price_cents, post.product.currency)}
          </p>
          {post.product.description && (
            <p className="max-w-[240px] text-center text-xs leading-relaxed text-white/85">
              {post.product.description}
            </p>
          )}
          <span className="post-cta mt-1 rounded-full border border-white/90 bg-white/10 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-neutral-950">
            Δες το προϊόν
          </span>
        </div>
      </Link>

      <Link
        href={productHref}
        className="block w-full px-1 py-3 transition hover:opacity-70"
      >
        <p className="text-sm text-neutral-800">{post.product.name}</p>
        {post.product.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
            {post.product.description}
          </p>
        )}
        <p className="mt-2 text-xs uppercase tracking-wider text-neutral-400">
          {post.product.sizes.join(" · ")}
        </p>
      </Link>
    </article>
  );
}
