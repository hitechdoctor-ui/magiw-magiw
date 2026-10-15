"use client";

import { useEffect } from "react";

type SizeGuideModalProps = {
  onClose: () => void;
};

const SIZE_ROWS = [
  { size: "S", bust: "82", waist: "64", hips: "88" },
  { size: "M", bust: "86", waist: "68", hips: "92" },
  { size: "L", bust: "90", waist: "72", hips: "96" },
  { size: "XL", bust: "94", waist: "76", hips: "100" },
];

export function SizeGuideModal({ onClose }: SizeGuideModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md bg-[#faf8f5] p-6 shadow-xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
              MAGIW MAGIW
            </p>
            <h2
              id="size-guide-title"
              className="mt-2 font-serif text-2xl text-neutral-900"
            >
              Οδηγός Μεγεθών
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 transition hover:text-neutral-900"
            aria-label="Κλείσιμο"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-neutral-600">
          Μετρήσεις σε εκατοστά. Για custom fit, επικοινώνησε με το ατελιέ.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Bust</th>
                <th className="py-2 pr-4">Waist</th>
                <th className="py-2">Hips</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map((row) => (
                <tr key={row.size} className="border-b border-stone-100">
                  <td className="py-3 pr-4 font-medium">{row.size}</td>
                  <td className="py-3 pr-4 text-neutral-600">{row.bust}</td>
                  <td className="py-3 pr-4 text-neutral-600">{row.waist}</td>
                  <td className="py-3 text-neutral-600">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
