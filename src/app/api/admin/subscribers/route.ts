import { isAdminAuthenticated } from "@/lib/admin/session";
import { listSubscribers } from "@/lib/subscribers/store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const subscribers = await listSubscribers();
  return NextResponse.json({ subscribers });
}
