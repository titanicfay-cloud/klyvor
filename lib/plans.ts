export type PlanId = 'free' | 'productivity' | 'professional' | 'business' | 'all_access' | 'team' | 'business_plus';

export interface Entitlements {
  plan_id: PlanId;
  max_projects: number;
  max_clients: number;
  max_documents: number;
  can_use_rich_text: boolean;
  can_use_attachments: boolean;
  max_storage_bytes: number;
}

export const PLAN_CONFIG: Record<PlanId, Entitlements> = {
  free: { plan_id: 'free', max_projects: 3, max_clients: 3, max_documents: 10, can_use_rich_text: false, can_use_attachments: false, max_storage_bytes: 0 },
  productivity: { plan_id: 'productivity', max_projects: 999999, max_clients: 3, max_documents: 999999, can_use_rich_text: true, can_use_attachments: true, max_storage_bytes: 500 * 1024 * 1024 },
  professional: { plan_id: 'professional', max_projects: 999999, max_clients: 20, max_documents: 999999, can_use_rich_text: true, can_use_attachments: true, max_storage_bytes: 2 * 1024 * 1024 * 1024 },
  business: { plan_id: 'business', max_projects: 999999, max_clients: 999999, max_documents: 999999, can_use_rich_text: true, can_use_attachments: true, max_storage_bytes: 5 * 1024 * 1024 * 1024 },
  all_access: { plan_id: 'all_access', max_projects: 999999, max_clients: 999999, max_documents: 999999, can_use_rich_text: true, can_use_attachments: true, max_storage_bytes: 10 * 1024 * 1024 * 1024 },
  team: { plan_id: 'team', max_projects: 999999, max_clients: 999999, max_documents: 999999, can_use_rich_text: true, can_use_attachments: true, max_storage_bytes: 50 * 1024 * 1024 * 1024 },
  business_plus: { plan_id: 'business_plus', max_projects: 999999, max_clients: 999999, max_documents: 999999, can_use_rich_text: true, can_use_attachments: true, max_storage_bytes: 100 * 1024 * 1024 * 1024 }
};
