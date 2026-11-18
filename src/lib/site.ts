/** Public site identity — single source for SEO, sharing and structured data. */

function normalizeSiteUrl(raw: string | undefined): string {
  const fallback = "https://magiwmagiw.gr";
  if (!raw?.trim()) return fallback;
  try {
    const url = new URL(raw.trim());
    return url.origin;
  } catch {
    return fallback;
  }
}

export const SITE = {
  name: "MAGIW MAGIW",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  description:
    "MAGIW MAGIW — χειροποίητο atelier μόδας & custom design. Γυναικεία, ανδρική και παιδική συλλογή, φτιαγμένη με αγάπη στην Ελλάδα.",
  descriptionEn:
    "MAGIW MAGIW — handmade fashion atelier & custom design. Women's, men's and kids' collections, crafted in Greece.",
  locale: "el_GR",
  instagramUrl: "https://www.instagram.com/magiwmagiw/",
  instagramHandle: "@magiwmagiw",
  logo: "/logo-magiw.png",
  ogImage: "/landing-ref/Slide-1_Jacket_1.webp",
} as const;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.startsWith("/") ? path : `/${path}`, SITE.url).toString();
}
