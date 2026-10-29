"use server";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/lib/entitlements";

export async function startTimerAction(description: string, projectId: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const entitlements = await getUserEntitlements(user.id);
  if (entitlements.plan_id === 'free') {
    return { error: "Time tracking requires a paid plan. Please upgrade." };
  }

  const { error } = await supabase.from("time_entries").insert([{
    user_id: user.id,
    description: description || "Untitled Session",
    project_id: projectId,
    start_time: new Date().toISOString()
  }]);

  if (error) {
    if (error.code === '23505') return { error: "You already have an active timer running." };
    return { error: "Failed to start timer." };
  }
  return { success: true };
}

export async function stopTimerAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Fetch the active timer
  const { data: active } = await supabase.from("time_entries").select("id, start_time").eq("user_id", user.id).is("end_time", null).single();
  if (!active) return { error: "No active timer found." };

  // Calculate duration server-side
  const start = new Date(active.start_time).getTime();
  const end = new Date().getTime();
  const durationSeconds = Math.floor((end - start) / 1000);

  if (durationSeconds < 1) {
    await supabase.from("time_entries").delete().eq("id", active.id);
    return { success: true, discarded: true };
  }

  const { error } = await supabase.from("time_entries").update({
    end_time: new Date().toISOString(),
    duration_seconds: durationSeconds
  }).eq("id", active.id);

  if (error) return { error: "Failed to save time entry." };
  return { success: true };
}
