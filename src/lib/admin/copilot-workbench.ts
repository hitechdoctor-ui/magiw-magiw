import type { AiProductDraft } from "@/lib/ai/product-schema";
import type { StoredProduct } from "@/lib/products/types";

export const COPILOT_WORKBENCH_KEY = "magiw-copilot-workbench-v1";

export type CopilotWorkbenchState = {
  messages: { id: string; role: "user" | "assistant"; text: string }[];
  lastProduct: StoredProduct | null;
  lastDraft: AiProductDraft | null;
};

export function storedProductToDraftFallback(
  product: StoredProduct,
): AiProductDraft {
  return {
    name: product.name,
    subtitle: product.subtitle ?? "",
    description: product.description ?? "",
    category: product.category ?? "Evelina's",
    price: product.price_cents / 100,
    sizes: product.sizes as AiProductDraft["sizes"],
    features: product.features ?? [],
    is_bundle: product.is_bundle,
    colors: product.colors ?? [],
    color_photos: [],
  };
}

export function loadCopilotWorkbench(): CopilotWorkbenchState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(COPILOT_WORKBENCH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CopilotWorkbenchState;
  } catch {
    return null;
  }
}

export function saveCopilotWorkbench(state: CopilotWorkbenchState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(COPILOT_WORKBENCH_KEY, JSON.stringify(state));
  } catch {
    /* quota */
  }
}

export function clearCopilotWorkbench() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(COPILOT_WORKBENCH_KEY);
  } catch {
    /* ignore */
  }
}

/** URL for admin preview — never navigates the current Copilot tab. */
export function productAdminPreviewHref(
  slug: string,
  isActive: boolean,
): string {
  if (isActive) return `/product/${slug}`;
  return `/product/${slug}?preview=draft`;
}
