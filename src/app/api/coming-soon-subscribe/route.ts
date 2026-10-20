import { subscribeEmail } from "@/lib/subscribers/store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; locale?: string };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const locale = body.locale === "en" ? "en" : "el";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "invalid_email" },
        { status: 400 },
      );
    }

    const result = await subscribeEmail(email, locale);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      discountCode: result.discountCode,
      discountPercent: result.discountPercent,
      existing: result.existing ?? false,
    });
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
