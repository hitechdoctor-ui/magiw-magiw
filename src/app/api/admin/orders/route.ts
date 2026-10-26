import { isAdminAuthenticated } from "@/lib/admin/session";
import { listCheckoutOrders } from "@/lib/orders/store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const orders = await listCheckoutOrders();
  return NextResponse.json({ orders });
}
