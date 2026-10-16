import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    // Placeholder until CRM / Supabase list is wired.
    console.info("[coming-soon-subscribe]", email);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
