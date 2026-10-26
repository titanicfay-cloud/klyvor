import { createClient } from "@/lib/supabase/server";

export type PlanId = 'free' | 'productivity' | 'professional' | 'business' | 'all_access' | 'team' | 'business_plus';

export interface Entitlements {
  plan_id: PlanId;
  max_projects: number;
  max_clients: number;
  max_documents: number;
  can_use_rich_text: boolean;
  can_use_attachments: boolean;
  max_storage_bytes: number; // In bytes
}

// Define the limits for each plan based on the KLYVOR Master Matrix
const PLAN_CONFIG: Record<PlanId, Entitlements> = {
  free: {
    plan_id: 'free',
    max_projects: 3,
    max_clients: 3,
    max_documents: 10,
    can_use_rich_text: false,
    can_use_attachments: false,
    max_storage_bytes: 0,
  },
  productivity: {
    plan_id: 'productivity',
    max_projects: 999999,
    max_clients: 3,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 500 * 1024 * 1024, // 500 MB
  },
  professional: {
    plan_id: 'professional',
    max_projects: 999999,
    max_clients: 20,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 2 * 1024 * 1024 * 1024, // 2 GB
  },
  business: {
    plan_id: 'business',
    max_projects: 999999,
    max_clients: 999999,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 5 * 1024 * 1024 * 1024, // 5 GB
  },
  all_access: {
    plan_id: 'all_access',
    max_projects: 999999,
    max_clients: 999999,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 10 * 1024 * 1024 * 1024, // 10 GB
  },
  team: {
    plan_id: 'team',
    max_projects: 999999,
    max_clients: 999999,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 50 * 1024 * 1024 * 1024, // 50 GB
  },
  business_plus: {
    plan_id: 'business_plus',
    max_projects: 999999,
    max_clients: 999999,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 100 * 1024 * 1024 * 1024, // 100 GB
  }
};

/**
 * Fetches the user's current subscription and returns their entitlements.
 * If the user has no subscription record, they default to the 'free' plan.
 */
export async function getUserEntitlements(userId: string): Promise<Entitlements> {
  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("plan_id, status")
    .eq("user_id", userId)
    .single();

  // If no record or subscription is canceled/incomplete, default to Free
  if (!subscription || subscription.status !== 'active') {
    return PLAN_CONFIG['free'];
  }

  const planId = subscription.plan_id as PlanId;
  return PLAN_CONFIG[planId] || PLAN_CONFIG['free'];
}

/**
 * Utility to check if a user can create a new resource based on their limit.
 */
export async function canCreateResource(userId: string, resource: 'projects' | 'clients' | 'documents'): Promise<{ allowed: boolean; limit: number; message?: string }> {
  const supabase = await createClient();
  const entitlements = await getUserEntitlements(userId);

  let currentCount = 0;
  let limit = 0;

  if (resource === 'projects') {
    const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    currentCount = count || 0;
    limit = entitlements.max_projects;
  } else if (resource === 'clients') {
    const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    currentCount = count || 0;
    limit = entitlements.max_clients;
  } else if (resource === 'documents') {
    const { count } = await supabase.from('documents').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    currentCount = count || 0;
    limit = entitlements.max_documents;
  }

  if (currentCount >= limit) {
    return { 
      allowed: false, 
      limit, 
      message: `You have reached the limit of ${limit} ${resource} on your current plan. Please upgrade to create more.` 
    };
  }

  return { allowed: true, limit };
}
