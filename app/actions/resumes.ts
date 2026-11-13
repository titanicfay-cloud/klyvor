"use server";
import { createClient } from "@/lib/supabase/server";
import { checkToolAccess } from "@/lib/entitlements";

export async function saveResumeAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const access = await checkToolAccess(user.id, "resumes");
  if (!access.allowed) return { error: access.message };

  if (data.id) {
    const { error } = await supabase.from("resumes").update({
      title: data.title,
      template: data.template,
      content_json: data.content_json,
      updated_at: new Date().toISOString(),
    }).eq("id", data.id);
    if (error) return { error: error.message };
    return { success: true, id: data.id };
  }

  const { data: newResume, error } = await supabase.from("resumes").insert([{
    user_id: user.id,
    title: data.title || "Untitled Resume",
    template: data.template || "ats",
    content_json: data.content_json,
  }]).select().single();
  if (error) return { error: error.message };
  return { success: true, id: newResume.id };
}

export async function deleteResumeAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const access = await checkToolAccess(user.id, "resumes");
  if (!access.allowed) return { error: access.message };

  const { error } = await supabase.from("resumes").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
