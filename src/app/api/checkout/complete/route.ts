import type { CartLine } from "@/components/cart/CartProvider";
import type { CheckoutDraft } from "@/lib/checkout/types";
import { createCheckoutOrder } from "@/lib/orders/store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  draft?: CheckoutDraft;
  lines?: CartLine[];
  subtotalCents?: number;
  shippingCents?: number;
  discountCents?: number;
  totalCents?: number;
  currency?: string;
  locale?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const draft = body.draft;
    const lines = body.lines ?? [];

    if (
      !draft?.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) ||
      lines.length === 0
    ) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const order = await createCheckoutOrder({
      draft,
      lines,
      subtotalCents: body.subtotalCents ?? 0,
      shippingCents: body.shippingCents ?? 0,
      discountCents: body.discountCents ?? 0,
      totalCents: body.totalCents ?? 0,
      currency: body.currency ?? "EUR",
      locale: body.locale === "en" ? "en" : "el",
    });

    if (!order) {
      return NextResponse.json({ error: "save_failed" }, { status: 500 });
    }

    const notifyEmail = process.env.SHOP_ORDERS_NOTIFY_EMAIL;
    if (notifyEmail) {
      console.info(
        "[checkout/complete] notify",
        notifyEmail,
        order.id,
        order.email,
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      customerEmail: order.email,
    });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
