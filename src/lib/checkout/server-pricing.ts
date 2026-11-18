import "server-only";

import type { CartLine } from "@/components/cart/CartProvider";
import {
  discountCentsFor,
  shippingCentsFor,
  totalCentsFor,
} from "@/lib/checkout/pricing-rules";
import type { CheckoutDraft } from "@/lib/checkout/types";
import { getProductByIdAsync } from "@/lib/data/products-server";
import { findDiscountPercentByCode } from "@/lib/subscribers/store";

const MAX_LINES = 50;

const FIELD_LIMITS: Record<keyof CheckoutDraft, number> = {
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 40,
  addressLine1: 200,
  city: 100,
  postalCode: 20,
  country: 2,
  notes: 1000,
  discountCode: 40,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PricedCheckout = {
  draft: CheckoutDraft;
  lines: CartLine[];
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  currency: string;
};

export type PricingError =
  | "invalid_payload"
  | "empty_cart"
  | "too_many_items"
  | "unknown_product"
  | "mixed_currency";

function cleanString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Validates the contact/shipping form and clamps every field to a sane length. */
export function sanitizeDraft(input: unknown): CheckoutDraft | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;

  const draft = Object.fromEntries(
    (Object.keys(FIELD_LIMITS) as (keyof CheckoutDraft)[]).map((key) => [
      key,
      cleanString(raw[key], FIELD_LIMITS[key]),
    ]),
  ) as CheckoutDraft;

  draft.country = draft.country.toUpperCase() || "GR";
  draft.email = draft.email.toLowerCase();

  if (!EMAIL_RE.test(draft.email)) return null;
  return draft;
}

/**
 * Re-prices a cart from the catalog. Only product id/slug, size and color are
 * taken from the browser — names, prices and currency always come from the
 * server, so the stored order cannot be tampered with.
 */
export async function priceCheckout(
  draft: CheckoutDraft,
  rawLines: unknown,
): Promise<{ ok: true; value: PricedCheckout } | { ok: false; error: PricingError }> {
  if (!Array.isArray(rawLines)) return { ok: false, error: "invalid_payload" };
  if (rawLines.length === 0) return { ok: false, error: "empty_cart" };
  if (rawLines.length > MAX_LINES) return { ok: false, error: "too_many_items" };

  const lines: CartLine[] = [];
  let currency: string | null = null;

  for (const entry of rawLines) {
    if (!entry || typeof entry !== "object") {
      return { ok: false, error: "invalid_payload" };
    }
    const raw = entry as Record<string, unknown>;
    const slug = cleanString(raw.productSlug, 200);
    const size = cleanString(raw.size, 40);
    const color = cleanString(raw.color, 60) || undefined;
    if (!slug || !size) return { ok: false, error: "invalid_payload" };

    const product = await getProductByIdAsync(slug);
    if (!product) return { ok: false, error: "unknown_product" };

    const lineCurrency = product.currency || "EUR";
    if (currency && currency !== lineCurrency) {
      return { ok: false, error: "mixed_currency" };
    }
    currency = lineCurrency;

    lines.push({
      id: cleanString(raw.id, 200) || `${product.slug}-${size}`,
      productSlug: product.slug,
      productName: product.name,
      size,
      color,
      price_cents: product.price_cents,
      currency: lineCurrency,
      imageUrl: cleanString(raw.imageUrl, 500) || undefined,
    });
  }

  const subtotalCents = lines.reduce((sum, line) => sum + line.price_cents, 0);
  const shippingCents = shippingCentsFor(subtotalCents, lines.length);

  let discountCents = 0;
  if (draft.discountCode) {
    const percent = await findDiscountPercentByCode(draft.discountCode);
    if (percent) {
      discountCents = discountCentsFor(subtotalCents, percent);
      draft = { ...draft, discountCode: draft.discountCode.toUpperCase() };
    } else {
      // Unknown code: keep the order, just don't apply a discount.
      draft = { ...draft, discountCode: "" };
    }
  }

  return {
    ok: true,
    value: {
      draft,
      lines,
      subtotalCents,
      shippingCents,
      discountCents,
      totalCents: totalCentsFor(subtotalCents, shippingCents, discountCents),
      currency: currency ?? "EUR",
    },
  };
}
