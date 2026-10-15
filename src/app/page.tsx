import { BrandInfoBar } from "@/components/layout/BrandInfoBar";
import { FashionGrid } from "@/components/feed/FashionGrid";
import { mockFeed } from "@/lib/data/mock-feed";

export default function Home() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:pt-16">
        <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
          @magiwmagiw
        </p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-neutral-950 sm:text-4xl">
          Shoppable Feed
        </h1>
      </section>

      <BrandInfoBar />

      <FashionGrid posts={mockFeed} />
    </div>
  );
}
