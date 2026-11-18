import { priceCheckout, sanitizeDraft } from "@/lib/checkout/server-pricing";
import { createCheckoutOrder } from "@/lib/orders/store";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ORDER_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 };

type Body = {
  draft?: unknown;
  lines?: unknown;
  locale?: string;
};

export async function POST(request: Request) {
  const limited = rateLimit(`checkout:${getClientIp(request)}`, ORDER_LIMIT);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const draft = sanitizeDraft(body.draft);
  if (!draft) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  // Never trust amounts from the browser: re-price everything from the catalog.
  const priced = await priceCheckout(draft, body.lines);
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: 400 });
  }

  const order = await createCheckoutOrder({
    ...priced.value,
    locale: body.locale === "en" ? "en" : "el",
  });

  if (!order) {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  if (process.env.SHOP_ORDERS_NOTIFY_EMAIL) {
    console.info("[checkout/complete] new order", order.id);
  }

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    customerEmail: order.email,
    totalCents: order.total_cents,
  });
}
