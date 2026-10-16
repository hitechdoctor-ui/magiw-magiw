type VirtualTryOnCtaProps = {
  onClick: () => void;
  variant?: "card" | "sticky";
  className?: string;
};

export function VirtualTryOnCta({
  onClick,
  variant = "card",
  className = "",
}: VirtualTryOnCtaProps) {
  if (variant === "sticky") {
    return (
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-[#faf8f5]/95 px-4 py-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden ${className}`}
      >
        <button
          type="button"
          onClick={onClick}
          className="flex w-full items-center justify-center gap-2 bg-neutral-950 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-neutral-900/25 transition hover:bg-neutral-800"
        >
          <span aria-hidden className="text-base">
            ✨
          </span>
          Δες το πάνω σου · Virtual Try-On
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-sm border-2 border-neutral-900 bg-gradient-to-br from-white via-[#faf8f5] to-neutral-100 px-4 py-5 text-left shadow-[0_8px_30px_rgba(23,23,23,0.12)] transition hover:shadow-[0_12px_40px_rgba(23,23,23,0.16)] ${className}`}
    >
      <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neutral-900/5 transition group-hover:bg-neutral-900/10" />
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-500">
            AI Atelier
          </span>
          <span className="mt-2 block font-serif text-xl leading-tight text-neutral-950 sm:text-2xl">
            Δες το πάνω σου
          </span>
          <span className="mt-2 block text-sm text-neutral-600">
            Virtual Try-On — ανέβασε selfie και δες το look live.
          </span>
        </span>
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-lg text-white transition group-hover:scale-105"
          aria-hidden
        >
          ✨
        </span>
      </span>
    </button>
  );
}
