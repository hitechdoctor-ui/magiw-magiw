const values = [
  {
    label: "Σχεδιασμένο & Ραμμένο στο Χέρι",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-5 w-5" aria-hidden>
        <path d="M12 2v4M8 6h8M6 10l2 10h8l2-10M9 14h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Made in Greece",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-5 w-5" aria-hidden>
        <path d="M12 21s6-4.5 6-10a6 6 0 1 0-12 0c0 5.5 6 10 6 10Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
  },
  {
    label: "Ethical & Slow Fashion",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-5 w-5" aria-hidden>
        <path d="M12 3c-1 2-4 3-4 7a4 4 0 0 0 8 0c0-4-3-5-4-7Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 21c1.5-2 6.5-2 8 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

export function BrandInfoBar() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {values.map(({ label, icon }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-3 px-4 py-5 text-neutral-700 sm:py-6"
          >
            <span className="text-neutral-400">{icon}</span>
            <p className="text-[11px] uppercase tracking-[0.22em] sm:text-xs">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
