"use server";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/lib/entitlements";

export async function saveExpenseAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // 1. Entitlement Check
  const entitlements = await getUserEntitlements(user.id);
  if (!['business', 'all_access', 'team', 'business_plus'].includes(entitlements.plan_id)) {
    return { error: "Expense Tracker requires the Business plan or higher." };
  }

  // 2. SELF-HEALING WORKSPACE LOGIC
  let { data: member } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id).maybeSingle();
  
  if (!member) {
    // If no workspace exists, create one instantly
    const { data: newWs, error: wsError } = await supabase.from("workspaces").insert([{ name: "My Workspace", type: "personal" }]).select().single();
    
    if (wsError || !newWs) return { error: "Failed to create workspace." };

    await supabase.from("workspace_members").insert([{ workspace_id: newWs.id, user_id: user.id, role: 'owner' }]);
    member = { workspace_id: newWs.id };
  }

  // 3. Server-Side Math & Validation
  const amount = Number(data.amount);
  const amountPaid = Number(data.amount_paid || 0);
  
  if (amountPaid > amount) return { error: "Amount paid cannot exceed the total expense amount." };

  let paymentStatus = data.payment_status;
  if (amountPaid >= amount && amount > 0) paymentStatus = 'paid';
  else if (amountPaid > 0) paymentStatus = 'partial';
  else paymentStatus = 'unpaid';

  const payload = {
    workspace_id: member.workspace_id,
    vendor: data.vendor,
    description: data.description || null,
    category: data.category,
    expense_date: data.expense_date,
    amount: amount,
    amount_paid: amountPaid,
    currency: data.currency || 'USD',
    payment_status: paymentStatus,
    payment_method: data.payment_method || null,
    created_by: user.id
  };

  if (data.id) {
    const { error } = await supabase.from("expenses").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
    return { success: true, id: data.id };
  } else {
    const { data: newExp, error } = await supabase.from("expenses").insert([payload]).select().single();
    if (error) return { error: error.message };
    return { success: true, id: newExp.id };
  }
}

export async function deleteExpenseAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
