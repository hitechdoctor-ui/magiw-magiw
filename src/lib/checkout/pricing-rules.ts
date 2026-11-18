import {
  CHECKOUT_FREE_SHIPPING_FROM_CENTS,
  CHECKOUT_SHIPPING_CENTS,
} from "@/lib/checkout/constants";

/** Pure pricing rules shared by the checkout UI (preview) and the server (authoritative). */

export const LAUNCH_DISCOUNT_PREFIX = "MAGIW5-";

/** Client-side preview only: the server checks the code really exists. */
export function looksLikeLaunchDiscountCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return normalized.startsWith(LAUNCH_DISCOUNT_PREFIX) && normalized.length >= 10;
}

export function discountCentsFor(subtotalCents: number, percent: number): number {
  if (percent <= 0) return 0;
  return Math.round((subtotalCents * Math.min(percent, 100)) / 100);
}

export function shippingCentsFor(subtotalCents: number, itemCount: number): number {
  if (itemCount === 0) return 0;
  return subtotalCents >= CHECKOUT_FREE_SHIPPING_FROM_CENTS ? 0 : CHECKOUT_SHIPPING_CENTS;
}

export function totalCentsFor(
  subtotalCents: number,
  shippingCents: number,
  discountCents: number,
): number {
  return Math.max(0, subtotalCents + shippingCents - discountCents);
}
