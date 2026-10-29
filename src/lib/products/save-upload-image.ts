import { createAdminClient, isAdminStorageConfigured } from "@/lib/supabase/admin";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const SUPABASE_BUCKET = "product-images";

function mimeToExt(mimeType: string): string {
  return MIME_EXT[mimeType.toLowerCase()] ?? "jpg";
}

async function saveProductUploadImageLocal(
  slug: string,
  buffer: Buffer,
  mimeType: string,
  index: number,
): Promise<string> {
  const ext = mimeToExt(mimeType);
  const relativeDir = path.join("images", "products", slug);
  const padded = String(index).padStart(2, "0");
  const fileName = `${padded}-upload.${ext}`;
  const diskDir = path.join(process.cwd(), "public", relativeDir);
  await mkdir(diskDir, { recursive: true });
  await writeFile(path.join(diskDir, fileName), buffer);

  return `/${relativeDir}/${fileName}`.replace(/\\/g, "/");
}

async function saveProductUploadImageSupabase(
  slug: string,
  buffer: Buffer,
  mimeType: string,
  index: number,
): Promise<string> {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("supabase_not_configured");
  }

  const ext = mimeToExt(mimeType);
  const padded = String(index).padStart(2, "0");
  const fileName = `${padded}-upload.${ext}`;
  const objectPath = `${slug}/${fileName}`;

  const { error } = await admin.storage.from(SUPABASE_BUCKET).upload(objectPath, buffer, {
    contentType: mimeType,
    upsert: true,
    cacheControl: "3600",
  });

  if (error) {
    console.error("[saveProductUploadImage] supabase upload", error.message);
    throw new Error("image_upload_failed");
  }

  const { data } = admin.storage.from(SUPABASE_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

/** Prefer Supabase Storage in production; local public/ for dev without Supabase. */
export async function saveProductUploadImage(
  slug: string,
  buffer: Buffer,
  mimeType: string,
  index = 1,
): Promise<string> {
  if (isAdminStorageConfigured()) {
    return saveProductUploadImageSupabase(slug, buffer, mimeType, index);
  }

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[saveProductUploadImage] Supabase not configured — saving to ephemeral disk (images may not persist on Railway). Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return saveProductUploadImageLocal(slug, buffer, mimeType, index);
}

export function usesPersistentProductImageStorage(): boolean {
  return isAdminStorageConfigured();
}
