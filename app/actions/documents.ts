"use server";
import { createClient } from "@/lib/supabase/server";
import { canCreateResource } from "@/lib/entitlements";

export async function createDocumentAction(type: "quick_note" | "rich_document") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const check = await canCreateResource(user.id, 'documents');
  if (!check.allowed) return { error: check.message };

  const { data, error } = await supabase
    .from("documents")
    .insert([{ user_id: user.id, title: type === "quick_note" ? "New Note" : "New Document", document_type: type }])
    .select()
    .single();

  if (error) return { error: error.message };
  return { success: true, data };
}
