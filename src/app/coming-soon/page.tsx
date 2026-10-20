import { ComingSoonPage } from "@/components/coming-soon/ComingSoonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAGIW MAGIW — Σύντομα κοντά σας",
  description:
    "Handmade Atelier & Custom Design. Ενημερωθείτε πρώτοι για το launch του magiwmagiw.gr.",
};

export default function ComingSoonRoute() {
  return <ComingSoonPage />;
}
