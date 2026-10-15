import { FEATURED_PRODUCTS } from "@/lib/data/featured-products";
import Link from "next/link";

const MENU_LABELS: Record<string, string> = {
  "atelier-green-satin-dress": "Green Dress",
  "handmade-satin-bustier-skirt-set": "Black Set",
};

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0 sm:h-16">
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.2em] text-neutral-950 sm:text-2xl"
        >
          MAGIW MAGIW
        </Link>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-neutral-600 sm:gap-6 sm:text-xs sm:tracking-[0.2em]">
          <Link href="/" className="transition hover:text-neutral-950">
            Feed
          </Link>

          <span className="hidden h-3 w-px bg-neutral-300 sm:inline" aria-hidden />

          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.slug}
              href={`/product/${product.slug}`}
              className="transition hover:text-neutral-950"
              title={`${product.name} · ${product.sku}`}
            >
              {MENU_LABELS[product.slug] ?? product.sku}
            </Link>
          ))}

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-neutral-950"
          >
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}
