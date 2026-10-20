import { adminSessionCookieName } from "@/lib/admin/session";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookieName, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
