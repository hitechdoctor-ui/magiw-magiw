import {
  getAdminPasswordFromEnv,
  requestIsSecure,
} from "@/lib/admin/credentials";
import {
  adminSessionCookieName,
  getAdminSessionCookieValue,
  isAdminConfigured,
} from "@/lib/admin/session";
import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }

  const body = (await request.json()) as { password?: string };
  const password =
    typeof body.password === "string" ? body.password.trim() : "";
  const expected = getAdminPasswordFromEnv();

  try {
    const a = Buffer.from(password, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "invalid_password" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  const token = getAdminSessionCookieValue();
  if (!token) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: requestIsSecure(request),
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
