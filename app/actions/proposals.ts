"use server";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/lib/entitlements";

export async function createProposalAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const entitlements = await getUserEntitlements(user.id);
  // Only Professional, Business, All-Access, etc., can create proposals
  if (entitlements.plan_id === 'free' || entitlements.plan_id === 'productivity') {
    return { error: "Proposal Studio requires the Professional plan or higher. Please upgrade." };
  }

  const { error } = await supabase.from("proposals").insert([{ ...data, user_id: user.id }]);
  if (error) return { error: error.message };
  return { success: true };
}
