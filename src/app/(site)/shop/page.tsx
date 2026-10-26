import { ShopPageContent } from "@/components/shop/ShopPageContent";
import { getHiddenStaticSlugs } from "@/lib/products/static-catalog-overrides";
import { getPublishedCatalogExtras } from "@/lib/data/products-server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Συλλογή | MAGIW MAGIW",
  description: "Editorial και Atelier συλλογές MAGIW MAGIW.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [catalogExtras, hiddenStaticSlugs] = await Promise.all([
    getPublishedCatalogExtras(),
    getHiddenStaticSlugs(),
  ]);
  return (
    <ShopPageContent
      catalogExtras={catalogExtras}
      hiddenStaticSlugs={hiddenStaticSlugs}
    />
  );
}
