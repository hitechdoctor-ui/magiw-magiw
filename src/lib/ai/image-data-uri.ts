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

export async function publicAssetToDataUri(assetPath: string): Promise<string> {
  const normalized = assetPath.startsWith("/") ? assetPath.slice(1) : assetPath;
  const absolutePath = path.join(process.cwd(), "public", normalized);

  const buffer = await readFile(absolutePath);
  const extension = path.extname(normalized).toLowerCase();

  const mimeType =
    extension === ".png"
      ? "image/png"
      : extension === ".webp"
        ? "image/webp"
        : "image/jpeg";

  return bufferToDataUri(buffer, mimeType);
}
