import { FloatingTulipBouquet } from "@/components/decor/FloatingTulipBouquet";

/** @deprecated name kept for layout imports — same floating bouquet, softer on shop pages */
export function SubtleTulipBackdrop({
  tone = "site",
}: {
  tone?: "site" | "landing";
}) {
  return (
    <FloatingTulipBouquet prominence={tone === "landing" ? "hero" : "soft"} />
  );
}
