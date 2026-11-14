"use server";
import { createClient } from "@/lib/supabase/server";

async function requireStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, error: "Unauthorized" as string | null };
  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  const role = roleRow?.role;
  if (!role || !["owner", "admin", "support"].includes(role)) {
    return { supabase, user, error: "Staff only." };
  }
  return { supabase, user, error: null };
}

export async function markNotificationReadAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const { error } = await supabase.from("notification_reads").insert([{
    notification_id: id,
    user_id: user.id,
  }]);
  if (error && error.code !== "23505") return { error: error.message };
  return { success: true };
}

export async function markAllNotificationsReadAction(ids: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  if (!ids.length) return { success: true };
  const rows = ids.map((id) => ({ notification_id: id, user_id: user.id }));
  const { error } = await supabase.from("notification_reads").upsert(rows, {
    onConflict: "notification_id,user_id",
    ignoreDuplicates: true,
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function sendStaffNotificationAction(input: {
  audience: "all" | "user";
  userId?: string;
  title: string;
  body?: string;
  link?: string;
}) {
  const { supabase, user, error } = await requireStaff();
  if (error || !user) return { error: error || "Unauthorized" };
  const title = (input.title || "").trim();
  if (!title) return { error: "Title is required." };

  if (input.audience === "user") {
    const target = (input.userId || "").trim();
    if (!/^[0-9a-f-]{36}$/i.test(target)) return { error: "Paste a valid user id." };
    const { error: insertError } = await supabase.from("notifications").insert([{
      user_id: target,
      audience: "user",
      title,
      body: input.body?.trim() || null,
      link: input.link?.trim() || null,
      created_by: user.id,
    }]);
    if (insertError) return { error: insertError.message };
    return { success: true };
  }

  const { error: insertError } = await supabase.from("notifications").insert([{
    user_id: null,
    audience: "all",
    title,
    body: input.body?.trim() || null,
    link: input.link?.trim() || null,
    created_by: user.id,
  }]);
  if (insertError) return { error: insertError.message };
  return { success: true };
}
