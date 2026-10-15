"use client";

import type { ProductSizeGuide } from "@/lib/types/database";
import { useEffect, useState } from "react";

type SizeGuideModalProps = {
  productName: string;
  sku: string;
  sizeGuide: ProductSizeGuide;
  onClose: () => void;
};

export function SizeGuideModal({
  productName,
  sku,
  sizeGuide,
  onClose,
}: SizeGuideModalProps) {
  const [openSection, setOpenSection] = useState<"chart" | "custom">("chart");

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-t-2xl bg-[#faf8f5] shadow-2xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
      >
        <div className="flex items-start justify-between border-b border-stone-200 px-5 py-5 sm:px-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
              Size Guide · {sku}
            </p>
            <h2
              id="size-guide-title"
              className="mt-2 font-serif text-2xl text-neutral-900"
            >
              Οδηγός Μεγεθών
            </h2>
            <p className="mt-1 text-xs text-neutral-500">{productName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-neutral-600 transition hover:border-neutral-900"
            aria-label="Κλείσιμο"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 sm:px-7">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpenSection("chart")}
              className={`flex-1 border px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition ${
                openSection === "chart"
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-stone-300 bg-white text-neutral-600"
              }`}
            >
              Πίνακας
            </button>
            <button
              type="button"
              onClick={() => setOpenSection("custom")}
              className={`flex-1 border px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition ${
                openSection === "custom"
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-stone-300 bg-white text-neutral-600"
              }`}
            >
              Custom Fit
            </button>
          </div>

          {openSection === "chart" ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[300px] text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-300 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    <th className="py-3 pr-4">Size</th>
                    <th className="py-3 pr-4">Bust (cm)</th>
                    <th className="py-3 pr-4">Waist (cm)</th>
                    <th className="py-3">Hips (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.rows.map((row) => (
                    <tr
                      key={row.size}
                      className="border-b border-stone-100 last:border-0"
                    >
                      <td className="py-3 pr-4 font-medium text-neutral-900">
                        {row.size}
                      </td>
                      <td className="py-3 pr-4 text-neutral-600">{row.bust}</td>
                      <td className="py-3 pr-4 text-neutral-600">{row.waist}</td>
                      <td className="py-3 text-neutral-600">{row.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5 border border-stone-200 bg-white p-5">
              <p className="text-sm leading-7 text-neutral-700">
                {sizeGuide.customFitNote ??
                  "Επικοινώνησε με το ατελιέ για προσαρμογή πατρόν και custom fit."}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-400">
                SKU · {sku}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
