import { readFile } from "node:fs/promises";
import path from "node:path";

export function bufferToDataUri(buffer: Buffer, mimeType: string): string {
  const base64 = buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

export async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = file.type || "image/jpeg";
  return bufferToDataUri(buffer, mimeType);
}

const ALLOWED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/**
 * Resolves a site-relative asset path (e.g. `/products/a.webp`) to a file
 * inside `public/`. Returns null for anything that escapes `public/` or is
 * not an image, so request input can never read other files on the server.
 */
export function resolvePublicImagePath(assetPath: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(assetPath.split(/[?#]/)[0] ?? "");
  } catch {
    return null;
  }
  if (decoded.includes("\0")) return null;

  const publicRoot = path.resolve(process.cwd(), "public");
  const absolutePath = path.resolve(publicRoot, `.${path.posix.normalize(`/${decoded}`)}`);

  if (!absolutePath.startsWith(publicRoot + path.sep)) return null;
  if (!ALLOWED_IMAGE_EXTENSIONS.has(path.extname(absolutePath).toLowerCase())) {
    return null;
  }
  return absolutePath;
}

export async function publicAssetToDataUri(assetPath: string): Promise<string> {
  const absolutePath = resolvePublicImagePath(assetPath);
  if (!absolutePath) {
    throw new Error("Invalid product image path.");
  }

  const buffer = await readFile(absolutePath);
  const extension = path.extname(absolutePath).toLowerCase();

  const mimeType =
    extension === ".png"
      ? "image/png"
      : extension === ".webp"
        ? "image/webp"
        : "image/jpeg";

  return bufferToDataUri(buffer, mimeType);
}
