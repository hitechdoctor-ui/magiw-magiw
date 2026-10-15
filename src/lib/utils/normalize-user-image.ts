const OUTPUT_MIME = "image/jpeg";
const OUTPUT_QUALITY = 0.92;

/**
 * Bakes EXIF orientation into pixels (upright portrait/landscape) for upload & preview.
 * Uses createImageBitmap when available (respects imageOrientation: from-image).
 */
export async function normalizeUserImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });

      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const context = canvas.getContext("2d");
      if (!context) {
        bitmap.close();
        return file;
      }

      context.drawImage(bitmap, 0, 0);
      bitmap.close();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, OUTPUT_MIME, OUTPUT_QUALITY);
      });

      if (!blob) return file;

      const baseName = file.name.replace(/\.[^.]+$/, "") || "try-on-photo";
      return new File([blob], `${baseName}-oriented.jpg`, {
        type: OUTPUT_MIME,
        lastModified: Date.now(),
      });
    } catch {
      return file;
    }
  }

  return file;
}

export function isLandscapeDimensions(width: number, height: number): boolean {
  return width > height * 1.05;
}

/** Heuristic: model output stored as landscape pixels though subject is portrait. */
export function portraitDisplayRotation(
  naturalWidth: number,
  naturalHeight: number,
  expectPortrait = true,
): number {
  if (!expectPortrait) return 0;
  if (isLandscapeDimensions(naturalWidth, naturalHeight)) return 90;
  return 0;
}
