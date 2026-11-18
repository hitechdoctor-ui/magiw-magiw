import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { LEGAL_PAGES, LEGAL_SLUGS, isLegalSlug } from "@/lib/legal/legalPages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type LegalPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return { title: "Νομικές πληροφορίες" };
  const doc = LEGAL_PAGES.el[slug];
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/legal/${slug}` },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  return <LegalDocumentView slug={slug} />;
}
