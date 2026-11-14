"use server";
import { createClient } from "@/lib/supabase/server";

export async function notifyUser(
  userId: string,
  input: { title: string; body?: string; link?: string }
) {
  const supabase = await createClient();
  await supabase.from("notifications").insert([{
    user_id: userId,
    audience: "user",
    title: input.title,
    body: input.body || null,
    link: input.link || null,
    created_by: userId,
  }]);
}
