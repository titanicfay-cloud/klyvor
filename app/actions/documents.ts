"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateResource, getUserEntitlements } from "@/lib/entitlements";
import { getOrCreateWorkspace } from "@/lib/workspace";

export async function createDocumentAction(type: "quick_note" | "rich_document") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const entitlements = await getUserEntitlements(user.id);
  if (type === "rich_document" && !entitlements.can_use_rich_text) {
    return { error: "Rich documents require the Productivity plan or higher. Please upgrade." };
  }

  const check = await canCreateResource(user.id, "documents");
  if (!check.allowed) return { error: check.message };

  const { workspaceId, error: wsError } = await getOrCreateWorkspace(user.id);
  if (wsError || !workspaceId) return { error: wsError || "Workspace error" };

  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        user_id: user.id,
        workspace_id: workspaceId,
        title: type === "quick_note" ? "New Note" : "New Document",
        document_type: type,
      },
    ])
    .select()
    .single();

  if (error) return { error: error.message };
  return { success: true, data };
}
