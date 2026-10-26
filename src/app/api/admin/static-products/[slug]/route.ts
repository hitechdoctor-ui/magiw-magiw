import { isAdminAuthenticated } from "@/lib/admin/session";
import {
  deleteStaticCatalogProduct,
  setStaticProductVisibleInEshop,
} from "@/lib/products/static-catalog-overrides";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  const body = (await request.json()) as { visible_in_eshop?: boolean };
  if (typeof body.visible_in_eshop !== "boolean") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const override = await setStaticProductVisibleInEshop(slug, body.visible_in_eshop);

  revalidatePath("/shop");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/admin/catalog");

  return NextResponse.json({ ok: true, override });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  await deleteStaticCatalogProduct(slug);

  revalidatePath("/shop");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/admin/catalog");

  return NextResponse.json({ ok: true });
}
