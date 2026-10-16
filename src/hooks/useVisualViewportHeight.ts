"use client";

import { useEffect } from "react";

/** Sets --app-vh to the visible viewport (excludes mobile browser chrome when possible). */
export function useVisualViewportHeight(active = true) {
  useEffect(() => {
    if (!active) return;

    const update = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-vh", `${height}px`);
    };

    update();

    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      document.documentElement.style.removeProperty("--app-vh");
    };
  }, [active]);
}
