import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "magiw_admin_session";

function sessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET ?? password;
  if (!password || !secret) return null;
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function isAdminAuthenticated() {
  const expected = sessionToken();
  if (!expected) return false;

  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return false;

  try {
    const a = Buffer.from(value, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getAdminSessionCookieValue() {
  return sessionToken();
}

export const adminSessionCookieName = COOKIE_NAME;
