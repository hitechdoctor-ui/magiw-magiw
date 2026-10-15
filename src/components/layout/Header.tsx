import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.2em] text-neutral-950 sm:text-2xl"
        >
          MAGIW MAGIW
        </Link>

        <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-neutral-600">
          <Link href="/" className="transition hover:text-neutral-950">
            Feed
          </Link>
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
