import { MagiwAtelierHome } from "@/components/home/MagiwAtelierHome";
import { ComingSoonPage } from "@/components/coming-soon/ComingSoonPage";
import type { Metadata } from "next";

type HomePageProps = {
  searchParams: Promise<{ preview?: string | string[] }>;
};

function isPreviewEnabled(
  preview: string | string[] | undefined,
): boolean {
  if (preview === "true") return true;
  if (Array.isArray(preview)) return preview.includes("true");
  return false;
}

export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  if (!isPreviewEnabled(params.preview)) {
    return {
      title: "MAGIW MAGIW — Σύντομα κοντά σας",
      description:
        "Handmade Atelier & Custom Design. Ενημερωθείτε πρώτοι για το launch του magiwmagiw.gr.",
    };
  }

  return {
    title: "MAGIW MAGIW",
    description: "Handmade Atelier & Custom Design · magiwmagiw.gr",
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  if (!isPreviewEnabled(params.preview)) {
    return <ComingSoonPage />;
  }

  return <MagiwAtelierHome />;
}
