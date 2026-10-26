import { isAdminAuthenticated } from "@/lib/admin/session";
import { listDraftStoredProducts } from "@/lib/products/store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const drafts = await listDraftStoredProducts();
  return NextResponse.json({ drafts });
}
