import Link from "next/link";

export function LookbookTopBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
      <Link
        href="/"
        className="pointer-events-auto font-serif text-lg tracking-[0.22em] text-white drop-shadow-sm sm:text-xl"
      >
        MAGIW MAGIW
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/shop"
          className="pointer-events-auto hidden text-[10px] uppercase tracking-[0.25em] text-white/85 transition hover:text-white sm:inline"
        >
          Συλλογή
        </Link>
        <button
          type="button"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-md transition hover:bg-black/45"
          aria-label="Καλάθι (σύντομα)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M6 6h15l-1.5 9h-12z" />
            <path d="M6 6 5 3H2" />
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
