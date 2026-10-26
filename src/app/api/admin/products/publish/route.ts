import { isAdminAuthenticated } from "@/lib/admin/session";
import { publishStoredProduct } from "@/lib/products/store";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string };
  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const product = await publishStoredProduct(id);
  if (!product) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/shop");

  return NextResponse.json({ ok: true, product });
}
