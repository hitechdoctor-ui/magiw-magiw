import {
  buildGarmentDescription,
  resolveTryOnCategory,
  type TryOnGarmentCategory,
} from "@/lib/ai/garment-try-on";
import { runReplicateVirtualTryOn } from "@/lib/ai/replicate-try-on";
import { publicAssetToDataUri } from "@/lib/ai/image-data-uri";
import {
  fileToOrientedDataUri,
  remoteImageToOrientedDataUri,
} from "@/lib/ai/normalize-orientation";
import { getProductById } from "@/lib/data/products";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const MAX_DESCRIPTION_LENGTH = 300;

/** Each try-on is a paid Replicate call — cap per visitor. */
const TRY_ON_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

function parseCategory(value: FormDataEntryValue | null): TryOnGarmentCategory | null {
  if (typeof value !== "string") return null;
  if (value === "dresses" || value === "upper_body" || value === "lower_body") {
    return value;
  }
  return null;
}

export async function POST(request: Request) {
  const limited = rateLimit(`try-on:${getClientIp(request)}`, TRY_ON_LIMIT);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Έφτασες το όριο δοκιμών. Δοκίμασε ξανά αργότερα." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } },
    );
  }

  try {
    const formData = await request.formData();
    const userImage = formData.get("userImage");
    const productImageUrl = formData.get("productImageUrl");
    const productSlug = formData.get("productSlug");
    const garmentDescriptionField = formData.get("garmentDescription");
    const categoryField = formData.get("tryOnCategory");

    if (!(userImage instanceof File)) {
      return NextResponse.json(
        { error: "Ανέβασε μια φωτογραφία σου." },
        { status: 400 },
      );
    }

    if (userImage.size === 0 || userImage.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Η φωτογραφία πρέπει να είναι έως 10 MB." },
        { status: 413 },
      );
    }

    if (userImage.type && !ALLOWED_UPLOAD_TYPES.has(userImage.type)) {
      return NextResponse.json(
        { error: "Υποστηρίζονται φωτογραφίες JPG, PNG, WEBP ή HEIC." },
        { status: 415 },
      );
    }

    if (typeof productImageUrl !== "string" || !productImageUrl.startsWith("/")) {
      return NextResponse.json(
        { error: "Μη έγκυρη εικόνα προϊόντος." },
        { status: 400 },
      );
    }

    const catalogProduct =
      typeof productSlug === "string" && productSlug.trim().length
        ? getProductById(productSlug.trim())
        : undefined;

    let garmentDescription: string;
    let category: TryOnGarmentCategory;

    if (catalogProduct) {
      garmentDescription = buildGarmentDescription(catalogProduct);
      category = resolveTryOnCategory(catalogProduct);
    } else {
      garmentDescription =
        typeof garmentDescriptionField === "string" &&
        garmentDescriptionField.trim().length
          ? garmentDescriptionField.trim().slice(0, MAX_DESCRIPTION_LENGTH)
          : "Handmade fashion garment, preserve full length from reference image, not mini";

      category = parseCategory(categoryField) ?? "dresses";
    }

    const [humanImageDataUri, garmentImageDataUri] = await Promise.all([
      fileToOrientedDataUri(userImage),
      publicAssetToDataUri(productImageUrl),
    ]);

    const replicateOutputUrl = await runReplicateVirtualTryOn({
      humanImageDataUri,
      garmentImageDataUri,
      garmentDescription,
      category,
    });

    const outputUrl = await remoteImageToOrientedDataUri(replicateOutputUrl);

    return NextResponse.json({ outputUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Virtual try-on failed.";

    // Log details server-side only; never echo internal errors to visitors.
    console.error("[virtual-try-on]", message);

    return NextResponse.json(
      { error: "Η δημιουργία απέτυχε. Δοκίμασε ξανά σε λίγο." },
      { status: 500 },
    );
  }
}
