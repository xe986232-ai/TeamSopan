import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolveDashboardRole } from "@/lib/dashboard-role";

// Dipakai di Server Component / Server Action buat tahu role dashboard
// user yang lagi login sekarang ("master" | "division" | null).
export async function getCurrentDashboardRole() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return resolveDashboardRole(user?.email);
}
