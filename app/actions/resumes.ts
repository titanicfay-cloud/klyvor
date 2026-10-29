"use server";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/lib/entitlements";

export async function saveResumeAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const entitlements = await getUserEntitlements(user.id);
  if (entitlements.plan_id === 'free' || entitlements.plan_id === 'productivity') {
    return { error: "CV Builder requires the Professional plan or higher." };
  }

  if (data.id) {
    // Update existing
    const { error } = await supabase.from("resumes").update({
      title: data.title,
      template: data.template,
      content_json: data.content_json,
      updated_at: new Date().toISOString()
    }).eq("id", data.id);
    if (error) return { error: error.message };
    return { success: true, id: data.id };
  } else {
    // Create new
    const { data: newResume, error } = await supabase.from("resumes").insert([{
      user_id: user.id,
      title: data.title || "Untitled Resume",
      template: data.template || "ats",
      content_json: data.content_json
    }]).select().single();
    if (error) return { error: error.message };
    return { success: true, id: newResume.id };
  }
}

export async function deleteResumeAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("resumes").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
