import type { StoredProduct } from "@/lib/products/types";
import Image from "next/image";

const FALLBACK = "/images/sample-set.jpg";

type AdminProductThumbnailProps = {
  product: Pick<StoredProduct, "name" | "image_urls">;
  className?: string;
};

export function AdminProductThumbnail({
  product,
  className = "",
}: AdminProductThumbnailProps) {
  const src = product.image_urls?.[0]?.trim() || FALLBACK;
  const hasUpload = Boolean(product.image_urls?.[0]);

  return (
    <div
      className={`relative aspect-[4/5] w-[4.5rem] shrink-0 overflow-hidden rounded-sm border border-stone-200 bg-neutral-100 sm:w-20 ${className}`}
    >
      <Image
        src={src}
        alt={product.name}
        fill
        className="object-cover object-center"
        sizes="80px"
      />
      {!hasUpload && (
        <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5 text-center text-[8px] uppercase tracking-wider text-white">
          Placeholder
        </span>
      )}
    </div>
  );
}
