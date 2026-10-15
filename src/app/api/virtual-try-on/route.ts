import { runReplicateVirtualTryOn } from "@/lib/ai/replicate-try-on";
import { fileToDataUri, publicAssetToDataUri } from "@/lib/ai/image-data-uri";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userImage = formData.get("userImage");
    const productImageUrl = formData.get("productImageUrl");
    const garmentDescription = formData.get("garmentDescription");

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

    const description =
      typeof garmentDescription === "string" && garmentDescription.trim().length
        ? garmentDescription.trim()
        : "Handmade fashion garment";

    const [humanImageDataUri, garmentImageDataUri] = await Promise.all([
      fileToDataUri(userImage),
      publicAssetToDataUri(productImageUrl),
    ]);

    const outputUrl = await runReplicateVirtualTryOn({
      humanImageDataUri,
      garmentImageDataUri,
      garmentDescription: description,
    });

    return NextResponse.json({ outputUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Virtual try-on failed.";

    console.error("[virtual-try-on]", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
