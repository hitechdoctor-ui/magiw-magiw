import { EB_Garamond } from "next/font/google";

/** Elegant Greek/Latin italic for hero taglines */
export const taglineFont = EB_Garamond({
  subsets: ["latin", "greek", "latin-ext"],
  weight: ["400", "500"],
  style: ["italic"],
  display: "swap",
});
