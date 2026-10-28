"use server";
import { createClient } from "@/lib/supabase/server";

export async function cancelSubscriptionAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("user_subscriptions")
    .update({ plan_id: "free", status: "canceled", provider_subscription_id: null })
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
