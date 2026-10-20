import { ShopPageContent } from "@/components/shop/ShopPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Συλλογή | MAGIW MAGIW",
  description: "Editorial και Atelier συλλογές MAGIW MAGIW.",
};

export default function ShopPage() {
  return <ShopPageContent />;
}
