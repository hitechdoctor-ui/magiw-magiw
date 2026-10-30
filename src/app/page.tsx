import { MagiwAtelierHome } from "@/components/home/MagiwAtelierHome";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MAGIW MAGIW",
  description: "Handmade Atelier & Custom Design · magiwmagiw.gr",
};

export default function Home() {
  return <MagiwAtelierHome />;
}
