"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateResource } from "@/lib/entitlements";
import { getOrCreateWorkspace } from "@/lib/workspace";

export async function createClientAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const check = await canCreateResource(user.id, "clients");
  if (!check.allowed) return { error: check.message };

  const { workspaceId, error: wsError } = await getOrCreateWorkspace(user.id);
  if (wsError || !workspaceId) return { error: wsError || "Workspace error" };

  const { error } = await supabase.from("clients").insert([
    {
      ...data,
      user_id: user.id,
      workspace_id: workspaceId,
    },
  ]);

  if (error) return { error: error.message };
  return { success: true };
}
