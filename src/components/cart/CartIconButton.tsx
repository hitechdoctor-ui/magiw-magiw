"use client";

type CartIconButtonProps = {
  count: number;
  hydrated?: boolean;
  onClick: () => void;
  variant?: "site" | "landing" | "runway";
  className?: string;
};

const variantClasses = {
  site: "text-neutral-700 hover:text-neutral-950",
  landing: "text-[#6b563c] hover:text-[#9a7b3c]",
  runway:
    "h-10 w-10 rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md hover:bg-black/45",
};

const badgeClasses = {
  site: "bg-neutral-950 text-white",
  landing: "bg-[#9a7b3c] text-white",
  runway: "bg-white text-black",
};

export function CartIconButton({
  count,
  hydrated = true,
  onClick,
  variant = "site",
  className = "",
}: CartIconButtonProps) {
  const displayCount = hydrated ? count : 0;
  const isRunway = variant === "runway";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition ${variantClasses[variant]} ${
        isRunway ? "" : "p-1"
      } ${className}`}
      aria-label={
        displayCount > 0
          ? `Καλάθι αγορών, ${displayCount} είδη`
          : "Καλάθι αγορών"
      }
    >
      <svg
        width={isRunway ? 17 : 22}
        height={isRunway ? 17 : 22}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1" fill="currentColor" stroke="none" />
      </svg>
      {displayCount > 0 && (
        <span
          className={`absolute flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-medium leading-none ${badgeClasses[variant]} ${
            isRunway ? "-right-0.5 -top-0.5" : "-right-1 -top-1"
          }`}
        >
          {displayCount > 9 ? "9+" : displayCount}
        </span>
      )}
    </button>
  );
}
