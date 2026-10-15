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
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

function parseCategory(value: FormDataEntryValue | null): TryOnGarmentCategory | null {
  if (typeof value !== "string") return null;
  if (value === "dresses" || value === "upper_body" || value === "lower_body") {
    return value;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userImage = formData.get("userImage");
    const productImageUrl = formData.get("productImageUrl");
    const productSlug = formData.get("productSlug");
    const garmentDescriptionField = formData.get("garmentDescription");
    const categoryField = formData.get("tryOnCategory");

    if (!(userImage instanceof File)) {
      return NextResponse.json(
        { error: "Missing user image." },
        { status: 400 },
      );
    }

    if (typeof productImageUrl !== "string" || !productImageUrl.startsWith("/")) {
      return NextResponse.json(
        { error: "Missing or invalid product image path." },
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
          ? garmentDescriptionField.trim()
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

    console.error("[virtual-try-on]", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
