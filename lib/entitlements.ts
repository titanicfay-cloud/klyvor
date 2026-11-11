import { createClient } from "@/lib/supabase/server";
import {
  PLAN_CONFIG,
  PlanId,
  Entitlements,
  ToolId,
  canAccessTool,
  getRequiredPlanName,
} from "@/lib/plans";

export async function getUserEntitlements(userId: string): Promise<Entitlements> {
  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("plan_id, status")
    .eq("user_id", userId)
    .single();

  if (!subscription || subscription.status !== "active") {
    return PLAN_CONFIG["free"];
  }

  const planId = subscription.plan_id as PlanId;
  return PLAN_CONFIG[planId] || PLAN_CONFIG["free"];
}

/**
 * Check if user can access a specific tool
 */
export async function checkToolAccess(
  userId: string,
  tool: ToolId
): Promise<{ allowed: boolean; message?: string }> {
  const entitlements = await getUserEntitlements(userId);
  const allowed = canAccessTool(entitlements.plan_id, tool);

  if (!allowed) {
    return {
      allowed: false,
      message: `This tool requires the ${getRequiredPlanName(tool)} plan or higher. Please upgrade.`,
    };
  }
  return { allowed: true };
}

export async function canCreateResource(
  userId: string,
  resource: "projects" | "clients" | "documents"
): Promise<{ allowed: boolean; limit: number; message?: string }> {
  const supabase = await createClient();
  const entitlements = await getUserEntitlements(userId);
  let currentCount = 0;
  let limit = 0;

  if (resource === "projects") {
    const { count } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    currentCount = count || 0;
    limit = entitlements.max_projects;
  } else if (resource === "clients") {
    const { count } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    currentCount = count || 0;
    limit = entitlements.max_clients;
  } else if (resource === "documents") {
    const { count } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    currentCount = count || 0;
    limit = entitlements.max_documents;
  }

  if (currentCount >= limit) {
    return {
      allowed: false,
      limit,
      message: `You have reached the limit of ${limit} ${resource} on your current plan. Please upgrade to create more.`,
    };
  }
  return { allowed: true, limit };
}
