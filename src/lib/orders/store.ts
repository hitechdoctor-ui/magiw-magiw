import type { CreateOrderPayload, CheckoutOrder } from "@/lib/orders/types";
import { createAdminClient, isAdminStorageConfigured } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const LOCAL_FILE = path.join(process.cwd(), "data", "checkout-orders.json");

async function readLocalOrders(): Promise<CheckoutOrder[]> {
  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as CheckoutOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalOrders(rows: CheckoutOrder[]) {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(rows, null, 2), "utf8");
}

function toRow(payload: CreateOrderPayload): Omit<CheckoutOrder, "id" | "created_at"> {
  const { draft, lines } = payload;
  return {
    email: draft.email.trim().toLowerCase(),
    first_name: draft.firstName.trim(),
    last_name: draft.lastName.trim(),
    phone: draft.phone.trim(),
    address_line1: draft.addressLine1.trim(),
    city: draft.city.trim(),
    postal_code: draft.postalCode.trim(),
    country: draft.country,
    notes: draft.notes.trim() || null,
    discount_code: draft.discountCode.trim() || null,
    subtotal_cents: payload.subtotalCents,
    shipping_cents: payload.shippingCents,
    discount_cents: payload.discountCents,
    total_cents: payload.totalCents,
    currency: payload.currency,
    line_items: lines.map((line) => ({
      productSlug: line.productSlug,
      productName: line.productName,
      size: line.size,
      price_cents: line.price_cents,
      currency: line.currency,
    })),
    status: "demo_pending",
    locale: payload.locale,
  };
}

export async function createCheckoutOrder(
  payload: CreateOrderPayload,
): Promise<CheckoutOrder | null> {
  const row = toRow(payload);

  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (!admin) return null;

    const { data, error } = await admin
      .from("checkout_orders")
      .insert(row)
      .select("*")
      .single();

    if (error) {
      console.error("[createCheckoutOrder]", error);
      return null;
    }

    return data as CheckoutOrder;
  }

  const order: CheckoutOrder = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...row,
  };

  const rows = await readLocalOrders();
  rows.unshift(order);
  await writeLocalOrders(rows);
  return order;
}

export async function listCheckoutOrders(): Promise<CheckoutOrder[]> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (!admin) return [];

    const { data, error } = await admin
      .from("checkout_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[listCheckoutOrders]", error);
      return [];
    }

    return (data ?? []) as CheckoutOrder[];
  }

  return readLocalOrders();
}
