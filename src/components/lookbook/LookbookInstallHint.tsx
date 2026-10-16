"use client";

import { useEffect, useState } from "react";

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari standalone
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export function LookbookInstallHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay() || !isMobile()) return;

    const dismissed = sessionStorage.getItem("magiw-lookbook-hint-dismissed");
    if (dismissed) return;

    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] rounded-sm border border-white/20 bg-black/80 p-4 text-white backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">
        Full screen
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/90">
        Για εμπειρία χωρίς μπάρες browser:{" "}
        <strong className="font-normal text-white">Κοινοποίηση → Πρόσθεση στην Αρχική</strong>{" "}
        (Safari / Chrome).
      </p>
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem("magiw-lookbook-hint-dismissed", "1");
          setVisible(false);
        }}
        className="mt-3 text-[10px] uppercase tracking-[0.25em] text-white/70 underline-offset-2 hover:underline"
      >
        Κλείσιμο
      </button>
    </div>
  );
}
