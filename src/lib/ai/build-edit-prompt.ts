import type { StoredProduct } from "@/lib/products/types";

export function buildProductEditUserPrompt(
  userPrompt: string,
  existing: StoredProduct,
): string {
  const context = {
    name: existing.name,
    subtitle: existing.subtitle,
    description: existing.description,
    category: existing.category,
    price_eur: existing.price_cents / 100,
    sizes: existing.sizes,
    colors: existing.colors,
    features: existing.features,
    is_bundle: existing.is_bundle,
    sku: existing.sku,
    slug: existing.slug,
  };

  return [
    "Επεξεργασία υπάρχοντος προϊόντος — κράτα SKU/slug λογική, ενημέρωσε τα πεδία σύμφωνα με το αίτημα.",
    "Τρέχον προϊόν (JSON):",
    JSON.stringify(context, null, 2),
    "",
    "Αίτημα admin:",
    userPrompt.trim(),
  ].join("\n");
}
