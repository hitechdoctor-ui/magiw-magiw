import { isAdminAuthenticated } from "@/lib/admin/session";
import { getAllProductsAsync } from "@/lib/data/products-server";
import {
  buildAdminCreateOrderPayload,
  type AdminCreateOrderInput,
} from "@/lib/orders/admin-create";
import { createCheckoutOrder, listCheckoutOrders } from "@/lib/orders/store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const orders = await listCheckoutOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as AdminCreateOrderInput;
    const catalog = await getAllProductsAsync();
    const catalogBySlug = new Map(catalog.map((p) => [p.slug, p]));

    const built = buildAdminCreateOrderPayload(body, catalogBySlug);
    if (!built.ok) {
      return NextResponse.json({ error: built.error }, { status: 400 });
    }

    const order = await createCheckoutOrder(built.payload);
    if (!order) {
      return NextResponse.json({ error: "save_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
