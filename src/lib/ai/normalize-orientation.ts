import sharp from "sharp";
import { bufferToDataUri } from "@/lib/ai/image-data-uri";

/** Applies EXIF orientation and re-encodes without orientation metadata. */
export async function normalizeImageBuffer(
  input: Buffer,
  mimeType = "image/jpeg",
): Promise<{ buffer: Buffer; mimeType: string }> {
  const pipeline = sharp(input).rotate(); // auto-orient from EXIF, then strip tag

  const buffer =
    mimeType === "image/png"
      ? await pipeline.png().toBuffer()
      : mimeType === "image/webp"
        ? await pipeline.webp({ quality: 92 }).toBuffer()
        : await pipeline.jpeg({ quality: 92, mozjpeg: true }).toBuffer();

  const outMime =
    mimeType === "image/png"
      ? "image/png"
      : mimeType === "image/webp"
        ? "image/webp"
        : "image/jpeg";

  return { buffer, mimeType: outMime };
}

export async function fileToOrientedDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const input = Buffer.from(arrayBuffer);
  const mimeType = file.type?.startsWith("image/") ? file.type : "image/jpeg";
  const { buffer, mimeType: outMime } = await normalizeImageBuffer(
    input,
    mimeType,
  );
  return bufferToDataUri(buffer, outMime);
}

export async function remoteImageToOrientedDataUri(url: string): Promise<string> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch try-on output: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const mimeType = contentType.split(";")[0]?.trim() || "image/jpeg";
  const input = Buffer.from(await response.arrayBuffer());
  const { buffer, mimeType: outMime } = await normalizeImageBuffer(
    input,
    mimeType,
  );
  return bufferToDataUri(buffer, outMime);
}
