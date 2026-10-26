import OpenAI from "openai";
import {
  aiProductJsonSchema,
  parseAiProductDraft,
  type AiProductDraft,
} from "@/lib/ai/product-schema";
import { AI_PRODUCT_SYSTEM_PROMPT } from "@/lib/ai/product-system-prompt";

export type GenerateProductImageInput = {
  base64: string;
  mimeType: string;
};

export type GenerateProductInput = {
  prompt: string;
  images?: GenerateProductImageInput[];
};

export async function generateProductDraftFromPrompt(
  input: GenerateProductInput,
): Promise<AiProductDraft> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("openai_not_configured");
  }

  const openai = new OpenAI({ apiKey });

  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

  for (const image of input.images ?? []) {
    userContent.push({
      type: "image_url",
      image_url: {
        url: `data:${image.mimeType};base64,${image.base64}`,
        detail: "high",
      },
    });
  }

  userContent.push({
    type: "text",
    text: input.prompt.trim(),
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.55,
    messages: [
      { role: "system", content: AI_PRODUCT_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "magiw_product_draft",
        strict: true,
        schema: aiProductJsonSchema,
      },
    },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("openai_empty_response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("openai_invalid_json");
  }

  const draft = parseAiProductDraft(parsed);
  if (!draft) {
    throw new Error("openai_schema_mismatch");
  }

  return draft;
}
