"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/lib/entitlements";
import { getOrCreateWorkspace } from "@/lib/workspace";

export async function saveProposalAction(data: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const entitlements = await getUserEntitlements(user.id);
  if (entitlements.plan_id === "free" || entitlements.plan_id === "productivity") {
    return {
      error: "Proposal Studio requires the Professional plan or higher. Please upgrade.",
    };
  }

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
    // Update existing proposal
    const { error } = await supabase
      .from("proposals")
      .update(payload)
      .eq("id", data.id)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
    return { success: true, id: data.id };
  } else {
    // Create new proposal
    const { data: newProp, error } = await supabase
      .from("proposals")
      .insert([payload])
      .select()
      .single();

    if (error) return { error: error.message };
    return { success: true, id: newProp.id };
  }
}
