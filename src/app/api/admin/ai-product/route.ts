import { buildProductEditUserPrompt } from "@/lib/ai/build-edit-prompt";
import { generateProductDraftFromPrompt } from "@/lib/ai/generate-product-draft";
import { isAdminAuthenticated } from "@/lib/admin/session";
import {
  saveProductUploadImage,
  usesPersistentProductImageStorage,
} from "@/lib/products/save-upload-image";
import {
  colorImageFromDraft,
  mergeColorImagesForProduct,
} from "@/lib/products/color-images";
import {
  getStoredProductBySlugOrId,
  insertProductFromAiDraft,
  setProductColorImages,
  setProductImageUrls,
  updateStoredProductFromAiDraft,
} from "@/lib/products/store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PROMPT_LENGTH = 4000;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGES = 10;

type ParsedUpload = {
  buffer: Buffer;
  mimeType: string;
};

async function parseUploads(form: FormData): Promise<ParsedUpload[]> {
  const raw = [...form.getAll("images"), form.get("image")].filter(
    (entry): entry is File => entry instanceof File && entry.size > 0,
  );

  const uploads: ParsedUpload[] = [];
  for (const file of raw) {
    if (uploads.length >= MAX_IMAGES) break;
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("image_too_large");
    }
    uploads.push({
      buffer: Buffer.from(await file.arrayBuffer()),
      mimeType: file.type || "image/jpeg",
    });
  }
  return uploads;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    let prompt = "";
    let uploads: ParsedUpload[] = [];
    let productId = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      prompt = String(form.get("prompt") ?? "").trim();
      productId = String(form.get("productId") ?? "").trim();
      uploads = await parseUploads(form);
    } else {
      const body = (await request.json()) as {
        prompt?: string;
        productId?: string;
        images?: { base64?: string; mimeType?: string }[];
        imageBase64?: string;
        imageMimeType?: string;
      };
      prompt = String(body.prompt ?? "").trim();
      productId = String(body.productId ?? "").trim();
      const fromArray =
        body.images
          ?.filter((img) => img.base64 && img.mimeType)
          .slice(0, MAX_IMAGES)
          .map((img) => ({
            buffer: Buffer.from(img.base64!, "base64"),
            mimeType: img.mimeType!,
          })) ?? [];
      uploads = fromArray;
      if (body.imageBase64 && body.imageMimeType && uploads.length === 0) {
        uploads = [
          {
            buffer: Buffer.from(body.imageBase64, "base64"),
            mimeType: body.imageMimeType,
          },
        ];
      }
      for (const upload of uploads) {
        if (upload.buffer.length > MAX_IMAGE_BYTES) {
          return NextResponse.json({ error: "image_too_large" }, { status: 400 });
        }
      }
    }

    if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ error: "invalid_prompt" }, { status: 400 });
    }

    const existing = productId
      ? await getStoredProductBySlugOrId(productId)
      : null;

    if (productId && !existing) {
      return NextResponse.json({ error: "product_not_found" }, { status: 404 });
    }

    let aiPrompt =
      existing != null
        ? buildProductEditUserPrompt(prompt, existing)
        : prompt;

    if (uploads.length > 1) {
      aiPrompt += `\n\n[Admin: ${uploads.length} φωτογραφίες συνημμένες — όρισε color_photos ώστε κάθε χρώμα στο colors να δείχνει στη σωστή photo_index (1 = πρώτη εικόνα).]`;
    }

    const draft = await generateProductDraftFromPrompt({
      prompt: aiPrompt,
      images: uploads.map((upload) => ({
        base64: upload.buffer.toString("base64"),
        mimeType: upload.mimeType,
      })),
    });

    const product =
      existing != null
        ? await updateStoredProductFromAiDraft(existing.id, draft)
        : await insertProductFromAiDraft({
            draft,
            isActive: false,
          });

    if (!product) {
      return NextResponse.json({ error: "save_failed" }, { status: 500 });
    }

    let savedProduct = product;
    const uploadStartIndex = product.image_urls?.length ?? 0;
    if (uploads.length > 0) {
      const startIndex = uploadStartIndex + 1;
      const publicPaths = [...(product.image_urls ?? [])];
      for (let i = 0; i < uploads.length; i += 1) {
        const upload = uploads[i];
        if (publicPaths.length >= MAX_IMAGES) break;
        publicPaths.push(
          await saveProductUploadImage(
            product.slug,
            upload.buffer,
            upload.mimeType,
            startIndex + i,
          ),
        );
      }
      const withImages = await setProductImageUrls(product.id, publicPaths);
      if (withImages) savedProduct = withImages;

      const freshColorImages = colorImageFromDraft(
        draft,
        publicPaths,
        uploadStartIndex,
        uploads.length,
      );
      const merged = mergeColorImagesForProduct(
        existing?.color_images ?? product.color_images,
        freshColorImages,
        draft.colors,
      );
      const withColors = await setProductColorImages(product.id, merged);
      if (withColors) savedProduct = withColors;
    } else if (draft.colors.length > 0) {
      const merged = mergeColorImagesForProduct(
        existing?.color_images ?? product.color_images,
        {},
        draft.colors,
      );
      const withColors = await setProductColorImages(product.id, merged);
      if (withColors) savedProduct = withColors;
    }

    const hadUploads = uploads.length > 0;

    return NextResponse.json({
      ok: true,
      draft,
      product: savedProduct,
      mode: existing ? "update" : "create",
      storage_warning:
        hadUploads && !usesPersistentProductImageStorage()
          ? "ephemeral_disk"
          : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (message === "image_upload_failed") {
      return NextResponse.json({ error: "image_upload_failed" }, { status: 502 });
    }
    if (message === "image_too_large") {
      return NextResponse.json({ error: "image_too_large" }, { status: 400 });
    }
    if (message === "openai_not_configured") {
      return NextResponse.json({ error: "openai_not_configured" }, { status: 503 });
    }
    if (message.startsWith("openai_")) {
      return NextResponse.json({ error: message }, { status: 502 });
    }
    console.error("[ai-product]", error);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
