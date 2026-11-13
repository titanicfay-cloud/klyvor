"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateResource, checkToolAccess } from "@/lib/entitlements";

export async function createClientAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const access = await checkToolAccess(user.id, "clients");
  if (!access.allowed) return { error: access.message };

  const check = await canCreateResource(user.id, "clients");
  if (!check.allowed) return { error: check.message };

  const { error } = await supabase.from("clients").insert([
    {
      ...data,
      user_id: user.id,
    },
  ]);

  if (error) return { error: error.message };
  return { success: true };
}
