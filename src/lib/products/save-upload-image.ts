import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function saveProductUploadImage(
  slug: string,
  buffer: Buffer,
  mimeType: string,
  index = 1,
): Promise<string> {
  const ext = MIME_EXT[mimeType.toLowerCase()] ?? "jpg";
  const relativeDir = path.join("images", "products", slug);
  const padded = String(index).padStart(2, "0");
  const fileName = `${padded}-upload.${ext}`;
  const diskDir = path.join(process.cwd(), "public", relativeDir);
  await mkdir(diskDir, { recursive: true });
  await writeFile(path.join(diskDir, fileName), buffer);

  return `/${relativeDir}/${fileName}`.replace(/\\/g, "/");
}
