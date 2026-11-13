"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Optional workspace lookup for Team / Business Plus later.
 * Does NOT create a workspace for single-user accounts.
 */
export async function getWorkspaceIdIfAny(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: member } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  return member?.workspace_id ?? null;
}
