import { MagiwBrightLanding } from "@/components/home/MagiwBrightLanding";
import { getAllProductsAsync } from "@/lib/data/products-server";
import { getHiddenStaticSlugs } from "@/lib/products/static-catalog-overrides";

export async function MagiwAtelierHome() {
  const [allProducts, hiddenStaticSlugs] = await Promise.all([
    getAllProductsAsync(),
    getHiddenStaticSlugs(),
  ]);
  const hidden = new Set(hiddenStaticSlugs);
  const featuredProducts = allProducts
    .filter((product) => product.is_active && !hidden.has(product.slug))
    .slice(0, 12);

  return <MagiwBrightLanding featuredProducts={featuredProducts} />;
}
