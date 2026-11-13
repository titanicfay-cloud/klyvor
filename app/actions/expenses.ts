"use server";
import { createClient } from "@/lib/supabase/server";
import { checkToolAccess } from "@/lib/entitlements";
import { getOrCreateWorkspace } from "@/lib/workspace";

export async function saveExpenseAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const access = await checkToolAccess(user.id, "expenses");
  if (!access.allowed) return { error: access.message };

  const { workspaceId, error: wsError } = await getOrCreateWorkspace(user.id);
  if (wsError || !workspaceId) return { error: wsError || "Workspace error" };

  const amount = Number(data.amount);
  const amountPaid = Number(data.amount_paid || 0);
  if (amountPaid > amount) return { error: "Amount paid cannot exceed the total expense amount." };

  let paymentStatus = data.payment_status;
  if (amountPaid >= amount && amount > 0) paymentStatus = "paid";
  else if (amountPaid > 0) paymentStatus = "partial";
  else paymentStatus = "unpaid";

  const payload = {
    workspace_id: workspaceId,
    vendor: data.vendor,
    description: data.description || null,
    category: data.category,
    expense_date: data.expense_date,
    amount,
    amount_paid: amountPaid,
    currency: data.currency || "USD",
    payment_status: paymentStatus,
    payment_method: data.payment_method || null,
    created_by: user.id,
  };

  if (data.id) {
    const { error } = await supabase.from("expenses").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
    return { success: true, id: data.id };
  }

  const { data: newExp, error } = await supabase.from("expenses").insert([payload]).select().single();
  if (error) return { error: error.message };
  return { success: true, id: newExp.id };
}

export async function deleteExpenseAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const access = await checkToolAccess(user.id, "expenses");
  if (!access.allowed) return { error: access.message };

  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
