"use server";

import { createClient } from "@/lib/supabase/server";
import { checkToolAccess } from "@/lib/entitlements";
import { getOrCreateWorkspace } from "@/lib/workspace";

export async function saveProposalAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const access = await checkToolAccess(user.id, "proposals");
  if (!access.allowed) return { error: access.message };

  const { workspaceId, error: wsError } = await getOrCreateWorkspace(user.id);
  if (wsError || !workspaceId) return { error: wsError || "Workspace error" };

  const payload = {
    user_id: user.id,
    workspace_id: workspaceId,
    title: data.title,
    client_id: data.client_id || null,
    project_id: data.project_id || null,
    total_amount: data.total_amount || 0,
    currency: data.currency || "USD",
    content_json: data.content_json || "",
    status: data.status || "draft",
  };

  if (data.id) {
    const { error } = await supabase
      .from("proposals")
      .update(payload)
      .eq("id", data.id)
      .eq("user_id", user.id);
    if (error) return { error: error.message };
    return { success: true, id: data.id };
  }

  const { data: newProp, error } = await supabase
    .from("proposals")
    .insert([payload])
    .select()
    .single();
  if (error) return { error: error.message };
  return { success: true, id: newProp.id };
}
