import type { CartLine } from "@/components/cart/CartProvider";
import type { CheckoutDraft } from "@/lib/checkout/types";
import type { ProductDetail } from "@/lib/types/database";
import type { CreateOrderPayload } from "@/lib/orders/types";

export type AdminOrderProductOption = {
  slug: string;
  name: string;
  sku: string;
  price_cents: number;
  currency: string;
  sizes: string[];
  colors: string[];
};

export type AdminCreateOrderItem = {
  productSlug: string;
  size: string;
  color?: string;
  quantity?: number;
};

export type AdminCreateOrderCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
  discountCode?: string;
};

export type AdminCreateOrderInput = {
  customer: AdminCreateOrderCustomer;
  items: AdminCreateOrderItem[];
  shippingCents?: number;
  discountCents?: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function productToOrderOption(product: ProductDetail): AdminOrderProductOption {
  return {
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    price_cents: product.price_cents,
    currency: product.currency,
    sizes: product.sizes,
    colors: product.colors ?? [],
  };
}

export function buildAdminCreateOrderPayload(
  input: AdminCreateOrderInput,
  catalogBySlug: Map<string, ProductDetail>,
):
  | { ok: true; payload: CreateOrderPayload }
  | { ok: false; error: string } {
  const customer = input.customer;
  if (!customer.firstName.trim() || !customer.lastName.trim()) {
    return { ok: false, error: "invalid_name" };
  }
  if (!customer.email.trim() || !EMAIL_RE.test(customer.email.trim())) {
    return { ok: false, error: "invalid_email" };
  }
  if (!customer.phone.trim() || customer.phone.trim().length < 6) {
    return { ok: false, error: "invalid_phone" };
  }
  if (
    !customer.addressLine1.trim() ||
    !customer.city.trim() ||
    customer.postalCode.trim().length < 4
  ) {
    return { ok: false, error: "invalid_address" };
  }
  if (!input.items.length) {
    return { ok: false, error: "no_items" };
  }

  const lines: CartLine[] = [];
  let currency = "EUR";

  for (const item of input.items) {
    const product = catalogBySlug.get(item.productSlug.trim());
    if (!product) {
      return { ok: false, error: "unknown_product" };
    }
    if (!item.size.trim() || !product.sizes.includes(item.size.trim())) {
      return { ok: false, error: "invalid_size" };
    }
    const color = item.color?.trim();
    if (product.colors?.length && color && !product.colors.includes(color)) {
      return { ok: false, error: "invalid_color" };
    }
    if (product.colors?.length && !color) {
      return { ok: false, error: "color_required" };
    }

    const qty = Math.min(Math.max(item.quantity ?? 1, 1), 20);
    currency = product.currency;

    for (let i = 0; i < qty; i += 1) {
      lines.push({
        id: `admin-${product.slug}-${item.size}-${i}-${Date.now()}`,
        productSlug: product.slug,
        productName: product.name,
        size: item.size.trim(),
        color: color || undefined,
        price_cents: product.price_cents,
        currency: product.currency,
        imageUrl: product.images[0],
      });
    }
  }

  const subtotalCents = lines.reduce((sum, line) => sum + line.price_cents, 0);
  const shippingCents = Math.max(0, input.shippingCents ?? 0);
  const discountCents = Math.min(
    Math.max(0, input.discountCents ?? 0),
    subtotalCents,
  );
  const totalCents = subtotalCents + shippingCents - discountCents;

  const draft: CheckoutDraft = {
    firstName: customer.firstName.trim(),
    lastName: customer.lastName.trim(),
    email: customer.email.trim(),
    phone: customer.phone.trim(),
    addressLine1: customer.addressLine1.trim(),
    city: customer.city.trim(),
    postalCode: customer.postalCode.trim(),
    country: customer.country || "GR",
    notes: customer.notes?.trim() ?? "",
    discountCode: customer.discountCode?.trim() ?? "",
  };

  return {
    ok: true,
    payload: {
      draft,
      lines,
      subtotalCents,
      shippingCents,
      discountCents,
      totalCents,
      currency,
      locale: "el",
      status: "admin_manual",
    },
  };
}
