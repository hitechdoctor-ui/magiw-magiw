import Link from "next/link";

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

        <nav className="flex items-center gap-5 text-[10px] uppercase tracking-[0.2em] text-neutral-600 sm:gap-6 sm:text-xs">
          <Link href="/" className="transition hover:text-neutral-950">
            Feed
          </Link>
          <span className="h-3 w-px bg-neutral-300" aria-hidden />
          <Link href="/shop" className="transition hover:text-neutral-950">
            Συλλογή
          </Link>
        </nav>
      </div>
    </header>
  );
}
