import type { AiProductDraft } from "@/lib/ai/product-schema";
import { createAdminClient, isAdminStorageConfigured } from "@/lib/supabase/admin";
import { uniqueSlug } from "@/lib/products/slug";
import type { CreateStoredProductInput, StoredProduct } from "@/lib/products/types";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const LOCAL_FILE = path.join(process.cwd(), "data", "catalog-products.json");

async function readLocalProducts(): Promise<StoredProduct[]> {
  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoredProduct[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((row) => ({
      ...row,
      image_urls: row.image_urls ?? [],
      colors: row.colors ?? [],
      color_images: row.color_images ?? {},
    }));
  } catch {
    return [];
  }
}

async function writeLocalProducts(rows: StoredProduct[]) {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(rows, null, 2), "utf8");
}

function eurosToCents(price: number): number {
  return Math.round(price * 100);
}

function buildInsertRow(
  draft: AiProductDraft,
  id: string,
  isActive: boolean,
): Omit<StoredProduct, "created_at" | "updated_at"> {
  const slug = uniqueSlug(draft.name, id.slice(0, 8));
  const sku = `MM-AI-${id.replace(/-/g, "").slice(0, 10).toUpperCase()}`;

  return {
    id,
    name: draft.name,
    slug,
    sku,
    subtitle: draft.subtitle,
    description: draft.description,
    category: draft.category,
    price_cents: eurosToCents(draft.price),
    currency: "EUR",
    sizes: draft.sizes,
    features: draft.features,
    colors: draft.colors,
    is_bundle: draft.is_bundle,
    stock: draft.is_bundle ? 3 : 5,
    is_active: isActive,
    image_urls: [],
    color_images: {},
  };
}

export async function setProductColorImages(
  id: string,
  colorImages: Record<string, string>,
): Promise<StoredProduct | null> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (admin) {
      const { data, error } = await admin
        .from("products")
        .update({ color_images: colorImages })
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        return data as StoredProduct;
      }
      if (error) {
        console.warn("[setProductColorImages] supabase", error.message);
      }
    }
  }

  const rows = await readLocalProducts();
  const index = rows.findIndex((p) => p.id === id);
  if (index === -1) return null;
  rows[index] = {
    ...rows[index],
    color_images: colorImages,
    updated_at: new Date().toISOString(),
  };
  await writeLocalProducts(rows);
  return rows[index];
}

export async function setProductImageUrls(
  id: string,
  imageUrls: string[],
): Promise<StoredProduct | null> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (admin) {
      const { data, error } = await admin
        .from("products")
        .update({ image_urls: imageUrls })
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        return data as StoredProduct;
      }
      if (error) {
        console.warn("[setProductImageUrls] supabase", error.message);
      }
    }
  }

  const rows = await readLocalProducts();
  const index = rows.findIndex((p) => p.id === id);
  if (index === -1) return null;
  rows[index] = {
    ...rows[index],
    image_urls: imageUrls,
    updated_at: new Date().toISOString(),
  };
  await writeLocalProducts(rows);
  return rows[index];
}

async function insertLocalProduct(
  row: Omit<StoredProduct, "created_at" | "updated_at">,
): Promise<StoredProduct> {
  const now = new Date().toISOString();
  const product: StoredProduct = {
    ...row,
    created_at: now,
    updated_at: now,
  };
  const rows = await readLocalProducts();
  rows.unshift(product);
  await writeLocalProducts(rows);
  return product;
}

async function publishLocalProduct(id: string): Promise<StoredProduct | null> {
  const rows = await readLocalProducts();
  const index = rows.findIndex((p) => p.id === id);
  if (index === -1) return null;
  rows[index] = {
    ...rows[index],
    is_active: true,
    updated_at: new Date().toISOString(),
  };
  await writeLocalProducts(rows);
  return rows[index];
}

export async function insertProductFromAiDraft(
  input: CreateStoredProductInput,
): Promise<StoredProduct | null> {
  const id = randomUUID();
  const isActive = input.isActive ?? false;
  const row = buildInsertRow(input.draft, id, isActive);

  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (!admin) return insertLocalProduct(row);

    const fullPayload = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      sku: row.sku,
      subtitle: row.subtitle,
      description: row.description,
      category: row.category,
      price_cents: row.price_cents,
      currency: row.currency,
      sizes: row.sizes,
      features: row.features,
      is_bundle: row.is_bundle,
      stock: row.stock,
      is_active: row.is_active,
      image_urls: row.image_urls,
      colors: row.colors,
    };

    let { data, error } = await admin
      .from("products")
      .insert(fullPayload)
      .select("*")
      .single();

    if (error) {
      console.warn("[insertProductFromAiDraft] extended insert failed, retrying base columns", error.message);
      ({ data, error } = await admin
        .from("products")
        .insert({
          id: row.id,
          name: row.name,
          slug: row.slug,
          sku: row.sku,
          description: row.description,
          price_cents: row.price_cents,
          currency: row.currency,
          sizes: row.sizes,
          stock: row.stock,
          is_active: row.is_active,
          image_urls: row.image_urls,
          colors: row.colors,
        })
        .select("*")
        .single());
    }

    if (error) {
      console.error("[insertProductFromAiDraft]", error);
      return insertLocalProduct(row);
    }

    return data as StoredProduct;
  }

  return insertLocalProduct(row);
}

function draftToUpdateFields(draft: AiProductDraft) {
  return {
    name: draft.name,
    subtitle: draft.subtitle,
    description: draft.description,
    category: draft.category,
    price_cents: eurosToCents(draft.price),
    sizes: draft.sizes,
    features: draft.features,
    colors: draft.colors,
    is_bundle: draft.is_bundle,
  };
}

export async function updateStoredProductFromAiDraft(
  id: string,
  draft: AiProductDraft,
): Promise<StoredProduct | null> {
  const fields = draftToUpdateFields(draft);
  const now = new Date().toISOString();

  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (admin) {
      const { data, error } = await admin
        .from("products")
        .update({ ...fields, updated_at: now })
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        return data as StoredProduct;
      }
      if (error) {
        console.warn("[updateStoredProductFromAiDraft] supabase", error.message);
      }
    }
  }

  const rows = await readLocalProducts();
  const index = rows.findIndex((p) => p.id === id);
  if (index === -1) return null;
  rows[index] = {
    ...rows[index],
    ...fields,
    updated_at: now,
  };
  await writeLocalProducts(rows);
  return rows[index];
}

export async function setStoredProductActive(
  id: string,
  isActive: boolean,
): Promise<StoredProduct | null> {
  const now = new Date().toISOString();

  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (admin) {
      const { data, error } = await admin
        .from("products")
        .update({ is_active: isActive, updated_at: now })
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        return data as StoredProduct;
      }
      if (error) {
        console.warn("[setStoredProductActive] supabase", error.message);
      }
    }
  }

  const rows = await readLocalProducts();
  const index = rows.findIndex((p) => p.id === id);
  if (index === -1) return null;
  rows[index] = {
    ...rows[index],
    is_active: isActive,
    updated_at: now,
  };
  await writeLocalProducts(rows);
  return rows[index];
}

export async function deleteStoredProduct(id: string): Promise<boolean> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (admin) {
      const { error } = await admin.from("products").delete().eq("id", id);
      if (!error) return true;
      console.warn("[deleteStoredProduct] supabase", error.message);
    }
  }

  const rows = await readLocalProducts();
  const next = rows.filter((p) => p.id !== id);
  if (next.length === rows.length) return false;
  await writeLocalProducts(next);
  return true;
}

export async function publishStoredProduct(id: string): Promise<StoredProduct | null> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (admin) {
      const { data, error } = await admin
        .from("products")
        .update({ is_active: true })
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        return data as StoredProduct;
      }
      if (error) {
        console.warn("[publishStoredProduct] supabase miss, trying local file", error.message);
      }
    }
  }

  return publishLocalProduct(id);
}

export async function listAllStoredProducts(): Promise<StoredProduct[]> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (!admin) return [];

    const { data, error } = await admin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[listAllStoredProducts]", error);
      return [];
    }

    return (data ?? []) as StoredProduct[];
  }

  return readLocalProducts();
}

export async function listDraftStoredProducts(): Promise<StoredProduct[]> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (!admin) return [];

    const { data, error } = await admin
      .from("products")
      .select("*")
      .eq("is_active", false)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error("[listDraftStoredProducts]", error);
      return [];
    }

    return (data ?? []) as StoredProduct[];
  }

  const rows = await readLocalProducts();
  return rows.filter((p) => !p.is_active);
}

export async function listActiveStoredProducts(): Promise<StoredProduct[]> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (!admin) return [];

    const { data, error } = await admin
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[listActiveStoredProducts]", error);
      return [];
    }

    return (data ?? []) as StoredProduct[];
  }

  const rows = await readLocalProducts();
  return rows.filter((p) => p.is_active);
}

export async function getStoredProductBySlugOrId(
  idOrSlug: string,
): Promise<StoredProduct | null> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (!admin) return null;

    const { data, error } = await admin
      .from("products")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug},sku.eq.${idOrSlug}`)
      .maybeSingle();

    if (error) {
      console.error("[getStoredProductBySlugOrId]", error);
      return null;
    }

    return (data as StoredProduct | null) ?? null;
  }

  const rows = await readLocalProducts();
  return (
    rows.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug || p.sku === idOrSlug,
    ) ?? null
  );
}
