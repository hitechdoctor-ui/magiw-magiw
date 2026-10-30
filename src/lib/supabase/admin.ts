import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isAdminStorageConfigured,
} from "@/lib/supabase/config";

export { isAdminStorageConfigured };

export function createAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceRoleKey();

  if (!url || !serviceKey) {
    return null;
  }

  try {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch (error) {
    console.warn(
      "[createAdminClient] skipped invalid Supabase config:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
