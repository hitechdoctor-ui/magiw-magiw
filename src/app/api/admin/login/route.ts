import {
  getAdminPasswordFromEnv,
  requestIsSecure,
} from "@/lib/admin/credentials";
import {
  adminSessionCookieName,
  getAdminSessionCookieValue,
  isAdminConfigured,
} from "@/lib/admin/session";
import {
  getClientIp,
  rateLimit,
  resetRateLimit,
} from "@/lib/security/rate-limit";
import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Brute-force protection: 5 attempts per 15 minutes per IP. */
const LOGIN_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

let warnedAboutSecret = false;

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }

  if (!process.env.ADMIN_SESSION_SECRET?.trim() && !warnedAboutSecret) {
    warnedAboutSecret = true;
    console.warn(
      "[admin/login] ADMIN_SESSION_SECRET is not set — the session cookie is derived from ADMIN_PASSWORD only. Set a long random ADMIN_SESSION_SECRET.",
    );
  }

  const limitKey = `admin-login:${getClientIp(request)}`;
  const limited = rateLimit(limitKey, LOGIN_LIMIT);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "too_many_attempts" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password.trim() : "";
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
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

  resetRateLimit(limitKey);

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
