import { LookbookFeed } from "@/components/lookbook/LookbookFeed";
import { getLookbookSlides } from "@/lib/data/lookbook";

/** Dev/preview route — full lookbook homepage (hidden from public nav). */
export default async function LookbookPreviewPage() {
  const slides = await getLookbookSlides();
  return <LookbookFeed slides={slides} />;
}
