import { isAdminAuthenticated } from "@/lib/admin/session";
import {
  deleteStoredProduct,
  getStoredProductBySlugOrId,
  setStoredProductActive,
} from "@/lib/products/store";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const product = await getStoredProductBySlugOrId(id);
  if (!product) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as { is_active?: boolean };
  if (typeof body.is_active !== "boolean") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const product = await setStoredProductActive(id, body.is_active);
  if (!product) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  revalidatePath("/shop");
  revalidatePath(`/product/${product.slug}`);

  return NextResponse.json({ ok: true, product });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getStoredProductBySlugOrId(id);
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const ok = await deleteStoredProduct(existing.id);
  if (!ok) {
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }

  revalidatePath("/shop");
  revalidatePath("/admin/catalog");
  revalidatePath("/admin/dashboard");

  return NextResponse.json({ ok: true });
}
