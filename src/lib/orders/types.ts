import type { CartLine } from "@/components/cart/CartProvider";
import type { CheckoutDraft } from "@/lib/checkout/types";

export type OrderLineItem = Pick<
  CartLine,
  "productSlug" | "productName" | "size" | "price_cents" | "currency"
>;

export type CheckoutOrder = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_line1: string;
  city: string;
  postal_code: string;
  country: string;
  notes: string | null;
  discount_code: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  discount_cents: number;
  total_cents: number;
  currency: string;
  line_items: OrderLineItem[];
  status: string;
  locale: string;
  created_at: string;
};

export type CreateOrderPayload = {
  draft: CheckoutDraft;
  lines: CartLine[];
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  currency: string;
  locale: string;
};
