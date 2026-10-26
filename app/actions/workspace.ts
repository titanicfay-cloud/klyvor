"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateResource } from "@/lib/entitlements";

export async function createProjectAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Enforce Limits
  const check = await canCreateResource(user.id, 'projects');
  if (!check.allowed) return { error: check.message };

  const { error } = await supabase.from("projects").insert([{ ...data, user_id: user.id }]);
  if (error) return { error: error.message };
  
  return { success: true };
}

export async function createClientAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Enforce Limits
  const check = await canCreateResource(user.id, 'clients');
  if (!check.allowed) return { error: check.message };

  const { error } = await supabase.from("clients").insert([{ ...data, user_id: user.id }]);
  if (error) return { error: error.message };
  
  return { success: true };
}

export async function createDocumentAction(type: "quick_note" | "rich_document") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Enforce Limits
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

export async function cancelSubscriptionAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("user_subscriptions")
    .update({ 
      plan_id: "free", 
      status: "canceled",
      provider_subscription_id: null
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
