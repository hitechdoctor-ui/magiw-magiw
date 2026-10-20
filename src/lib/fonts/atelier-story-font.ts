import { Playpen_Sans } from "next/font/google";

/**
 * Handwriting font with full Greek + Latin (Caveat / Marck Script lack Greek glyphs in Google Fonts).
 */
export const atelierStoryFont = Playpen_Sans({
  weight: ["300", "400"],
  subsets: ["latin", "greek", "latin-ext"],
  display: "swap",
});
