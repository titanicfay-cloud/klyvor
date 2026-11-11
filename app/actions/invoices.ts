"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/lib/entitlements";
import { getOrCreateWorkspace } from "@/lib/workspace";

export async function saveInvoiceAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // 1. Entitlement Check
  const entitlements = await getUserEntitlements(user.id);
  if (!["business", "all_access", "team", "business_plus"].includes(entitlements.plan_id)) {
    return { error: "Invoice Builder requires the Business plan or higher." };
  }

  // 2. Get or create workspace
  const { workspaceId, error: wsError } = await getOrCreateWorkspace(user.id);
  if (wsError || !workspaceId) return { error: wsError || "Workspace error" };

  // 3. Validate Client & Project Ownership
  if (data.client_id) {
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("id", data.client_id)
      .eq("workspace_id", workspaceId)
      .single();
    if (!client) return { error: "Invalid client selection." };
  }

  if (data.project_id) {
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", data.project_id)
      .eq("workspace_id", workspaceId)
      .single();
    if (!project) return { error: "Invalid project selection." };
  }

  // 4. Server-Side Math Validation
  const items = data.items_json || [];
  const subtotal = items.reduce(
    (acc: number, item: any) => acc + Number(item.quantity) * Number(item.rate),
    0
  );
  const tax_amount = subtotal * (Number(data.tax_rate) / 100);
  const total_amount = subtotal + tax_amount - Number(data.discount_amount || 0);

  // 5. Invoice Number Generation
  let invoiceNumber = data.invoice_number;
  if (!data.id) {
    const { data: generatedNumber, error: rpcError } = await supabase.rpc(
      "generate_invoice_number",
      { ws_id: workspaceId }
    );
    if (rpcError) return { error: "Failed to generate invoice number." };
    invoiceNumber = generatedNumber;
  }

  // 6. Assemble Payload
  const payload = {
    workspace_id: workspaceId,
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

  // 7. Database Operation
  if (data.id) {
    const { error } = await supabase.from("invoices").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
    return { success: true, id: data.id };
  } else {
    const { data: newInv, error } = await supabase
      .from("invoices")
      .insert([payload])
      .select()
      .single();
    if (error) return { error: error.message };
    return { success: true, id: newInv.id };
  }
}
