"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Gets the current user's workspace.
 * If the user has no workspace yet, it creates one automatically.
 */
export async function getOrCreateWorkspace(userId: string) {
  const supabase = await createClient();

  // Try to find existing membership
  let { data: member } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (member?.workspace_id) {
    return { workspaceId: member.workspace_id, error: null };
  }

  // No workspace found → create one
  const { data: newWs, error: wsError } = await supabase
    .from("workspaces")
    .insert([{ name: "My Workspace", type: "personal" }])
    .select()
    .single();

  if (wsError || !newWs) {
    return { workspaceId: null, error: "Failed to create workspace." };
  }

  // Link the user as owner
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert([{ workspace_id: newWs.id, user_id: userId, role: "owner" }]);

  if (memberError) {
    return { workspaceId: null, error: "Failed to link workspace." };
  }

  return { workspaceId: newWs.id, error: null };
}
