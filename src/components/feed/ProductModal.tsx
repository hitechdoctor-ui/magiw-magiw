"use client";

import type { FeedPost } from "@/lib/types/database";
import { formatPrice } from "@/lib/utils/format";
import Image from "next/image";
import { useEffect, useState } from "react";

type ProductModalProps = {
  post: FeedPost;
  onClose: () => void;
  onAddToCart: (size: string) => void;
};

export function ProductModal({ post, onClose, onAddToCart }: ProductModalProps) {
  const { product } = post;
  const images = post.gallery?.length ? post.gallery : [post.media_url];
  const [activeImage, setActiveImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    onAddToCart(selectedSize);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[85vh] sm:flex-row sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur transition hover:bg-white"
          aria-label="Κλείσιμο"
        >
          ✕
        </button>

        <div className="relative aspect-[4/5] w-full shrink-0 bg-neutral-100 sm:aspect-auto sm:h-auto sm:min-h-[28rem] sm:w-1/2">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              {images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`relative h-14 flex-1 overflow-hidden rounded-sm border-2 transition ${
                    activeImage === image
                      ? "border-white"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col overflow-y-auto p-6 sm:w-1/2 sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            MAGIW MAGIW
          </p>
          <h2
            id="product-modal-title"
            className="mt-3 font-serif text-3xl tracking-tight text-neutral-950"
          >
            {product.name}
          </h2>
          <p className="mt-2 text-2xl font-medium text-neutral-900">
            {formatPrice(product.price_cents, product.currency)}
          </p>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Μέγεθος
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`min-w-12 rounded-full border px-4 py-2 text-sm transition ${
                    selectedSize === size
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="mt-2 text-xs text-red-600">
                Επίλεξε μέγεθος πριν την προσθήκη στο καλάθι.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-8 w-full rounded-full bg-neutral-950 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {product.stock === 0
              ? "Εξαντλήθηκε"
              : selectedSize
                ? `Προσθήκη στο καλάθι · ${selectedSize}`
                : "Προσθήκη στο καλάθι"}
          </button>
        </div>
      </div>
    </div>
  );
}
