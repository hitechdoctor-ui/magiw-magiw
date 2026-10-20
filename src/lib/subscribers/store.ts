import { generateLaunchDiscountCode } from "@/lib/subscribers/discount-code";
import type { LaunchSubscriber, SubscribeResult } from "@/lib/subscribers/types";
import { createAdminClient, isAdminStorageConfigured } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const LOCAL_FILE = path.join(process.cwd(), "data", "launch-subscribers.json");
const DISCOUNT_PERCENT = 5;

async function readLocalSubscribers(): Promise<LaunchSubscriber[]> {
  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as LaunchSubscriber[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalSubscribers(rows: LaunchSubscriber[]) {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(rows, null, 2), "utf8");
}

export async function subscribeEmail(
  email: string,
  locale = "el",
): Promise<SubscribeResult> {
  const normalized = email.trim().toLowerCase();

  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (!admin) {
      return { ok: false, error: "storage_unavailable" };
    }

    const { data: existing } = await admin
      .from("launch_subscribers")
      .select("discount_code, discount_percent")
      .eq("email", normalized)
      .maybeSingle();

    if (existing?.discount_code) {
      return {
        ok: true,
        discountCode: existing.discount_code,
        discountPercent: existing.discount_percent ?? DISCOUNT_PERCENT,
        existing: true,
      };
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const discount_code = generateLaunchDiscountCode();
      const { data, error } = await admin
        .from("launch_subscribers")
        .insert({
          email: normalized,
          discount_code,
          discount_percent: DISCOUNT_PERCENT,
          locale,
        })
        .select("discount_code, discount_percent")
        .single();

      if (!error && data) {
        return {
          ok: true,
          discountCode: data.discount_code,
          discountPercent: data.discount_percent ?? DISCOUNT_PERCENT,
        };
      }

      if (error?.code !== "23505") {
        console.error("[subscribeEmail]", error);
        return { ok: false, error: "insert_failed" };
      }
    }

    return { ok: false, error: "insert_failed" };
  }

  const rows = await readLocalSubscribers();
  const found = rows.find((row) => row.email === normalized);
  if (found) {
    return {
      ok: true,
      discountCode: found.discount_code,
      discountPercent: found.discount_percent,
      existing: true,
    };
  }

  const subscriber: LaunchSubscriber = {
    id: randomUUID(),
    email: normalized,
    discount_code: generateLaunchDiscountCode(),
    discount_percent: DISCOUNT_PERCENT,
    locale,
    created_at: new Date().toISOString(),
  };

  rows.unshift(subscriber);
  await writeLocalSubscribers(rows);

  return {
    ok: true,
    discountCode: subscriber.discount_code,
    discountPercent: DISCOUNT_PERCENT,
  };
}

export async function listSubscribers(): Promise<LaunchSubscriber[]> {
  if (isAdminStorageConfigured()) {
    const admin = createAdminClient();
    if (!admin) return [];

    const { data, error } = await admin
      .from("launch_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[listSubscribers]", error);
      return [];
    }

    return (data ?? []) as LaunchSubscriber[];
  }

  return readLocalSubscribers();
}
