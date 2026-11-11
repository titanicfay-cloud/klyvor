export type PlanId =
  | "free"
  | "productivity"
  | "professional"
  | "business"
  | "all_access"
  | "team"
  | "business_plus";

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
  free: {
    plan_id: "free",
    max_projects: 3,
    max_clients: 3,
    max_documents: 10,
    can_use_rich_text: false,
    can_use_attachments: false,
    max_storage_bytes: 0,
  },
  productivity: {
    plan_id: "productivity",
    max_projects: 999999,
    max_clients: 3,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 500 * 1024 * 1024,
  },
  professional: {
    plan_id: "professional",
    max_projects: 999999,
    max_clients: 20,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 2 * 1024 * 1024 * 1024,
  },
  business: {
    plan_id: "business",
    max_projects: 999999,
    max_clients: 999999,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 5 * 1024 * 1024 * 1024,
  },
  all_access: {
    plan_id: "all_access",
    max_projects: 999999,
    max_clients: 999999,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 10 * 1024 * 1024 * 1024,
  },
  team: {
    plan_id: "team",
    max_projects: 999999,
    max_clients: 999999,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 50 * 1024 * 1024 * 1024,
  },
  business_plus: {
    plan_id: "business_plus",
    max_projects: 999999,
    max_clients: 999999,
    max_documents: 999999,
    can_use_rich_text: true,
    can_use_attachments: true,
    max_storage_bytes: 100 * 1024 * 1024 * 1024,
  },
};

// ============================================
// SINGLE SOURCE OF TRUTH FOR TOOL ACCESS
// ============================================
export type ToolId =
  | "tasks"
  | "documents"
  | "calculator"
  | "time-tracker"
  | "projects"
  | "clients"
  | "proposals"
  | "resumes"
  | "invoices"
  | "expenses";

// Minimum plan required for each tool
export const TOOL_REQUIRED_PLAN: Record<ToolId, PlanId> = {
  tasks: "free",
  documents: "free",
  calculator: "free",
  "time-tracker": "productivity",
  projects: "professional",
  clients: "professional",
  proposals: "professional",
  resumes: "professional",
  invoices: "business",
  expenses: "business",
};

// Helper: ordered list of plans from lowest to highest
const PLAN_ORDER: PlanId[] = [
  "free",
  "productivity",
  "professional",
  "business",
  "all_access",
  "team",
  "business_plus",
];

/**
 * Returns true if the user's plan is high enough for the tool
 */
export function canAccessTool(userPlan: PlanId, tool: ToolId): boolean {
  const required = TOOL_REQUIRED_PLAN[tool];
  const userIndex = PLAN_ORDER.indexOf(userPlan);
  const requiredIndex = PLAN_ORDER.indexOf(required);
  return userIndex >= requiredIndex;
}

/**
 * Returns the minimum plan name needed for a tool (for upgrade messages)
 */
export function getRequiredPlanName(tool: ToolId): string {
  const plan = TOOL_REQUIRED_PLAN[tool];
  const names: Record<PlanId, string> = {
    free: "Free",
    productivity: "Productivity",
    professional: "Professional",
    business: "Business",
    all_access: "All-Access",
    team: "Team",
    business_plus: "Business Plus",
  };
  return names[plan];
}
