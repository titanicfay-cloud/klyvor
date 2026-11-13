"use server";

import { createClient } from "@/lib/supabase/server";
import { checkToolAccess } from "@/lib/entitlements";

export async function saveInvoiceAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const access = await checkToolAccess(user.id, "invoices");
  if (!access.allowed) return { error: access.message };

  if (data.client_id) {
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("id", data.client_id)
      .eq("user_id", user.id)
      .single();
    if (!client) return { error: "Invalid client selection." };
  }

  if (data.project_id) {
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", data.project_id)
      .eq("user_id", user.id)
      .single();
    if (!project) return { error: "Invalid project selection." };
  }

  const items = data.items_json || [];
  const subtotal = items.reduce(
    (acc: number, item: any) => acc + Number(item.quantity) * Number(item.rate),
    0
  );
  const tax_amount = subtotal * (Number(data.tax_rate) / 100);
  const total_amount = subtotal + tax_amount - Number(data.discount_amount || 0);

  let invoiceNumber = data.invoice_number;
  if (!data.id) {
    invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
  }

  const payload: Record<string, any> = {
    user_id: user.id,
    client_id: data.client_id || null,
    project_id: data.project_id || null,
    invoice_number: invoiceNumber,
    issue_date: data.issue_date,
    due_date: data.due_date,
    status: data.status || "draft",
    items_json: items,
    subtotal,
    tax_rate: data.tax_rate || 0,
    tax_amount,
    discount_amount: data.discount_amount || 0,
    total_amount,
    currency: data.currency || "USD",
    notes: data.notes || null,
  };

  if (data.id) {
    const { error } = await supabase.from("invoices").update(payload).eq("id", data.id).eq("user_id", user.id);
    if (error) return { error: error.message };
    return { success: true, id: data.id };
  }

  const { data: newInv, error } = await supabase
    .from("invoices")
    .insert([payload])
    .select()
    .single();
  if (error) return { error: error.message };
  return { success: true, id: newInv.id };
}
