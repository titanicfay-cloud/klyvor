"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CreditCard,
  Gauge,
  HardDrive,
  Layers3,
  LockKeyhole,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  PLAN_CONFIG,
  PlanId,
  TOOL_REQUIRED_PLAN,
  ToolId,
  canAccessTool,
} from "@/lib/plans";
import { initializePaystackCheckout } from "@/app/actions/paystack";
import { cancelSubscriptionAction } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/states";
import { toast } from "sonner";

const ORDER: PlanId[] = [
  "free",
  "productivity",
  "professional",
  "business",
  "all_access",
  "team",
  "business_plus",
];

const PRICES: Record<PlanId, { month: number; year: number }> = {
  free: { month: 0, year: 0 },
  productivity: { month: 19, year: 190 },
  professional: { month: 39, year: 390 },
  business: { month: 69, year: 690 },
  all_access: { month: 99, year: 990 },
  team: { month: 149, year: 1490 },
  business_plus: { month: 299, year: 2990 },
};

const NAMES: Record<PlanId, string> = {
  free: "Free",
  productivity: "Productivity",
  professional: "Professional",
  business: "Business",
  all_access: "All-Access",
  team: "Team",
  business_plus: "Business Plus",
};

const DETAIL: Record<
  PlanId,
  { meant: string; opens: string[]; limits: string[]; closed: string[] }
> = {
  free: {
    meant:
      "Tasks, documents, and fee calculations. Client records and billing remain closed.",
    opens: ["Tasks", "Documents", "Pricing calculator"],
    limits: ["10 documents", "Plain notes", "No file uploads"],
    closed: [
      "Time tracker",
      "Projects",
      "Clients",
      "Proposals",
      "CV",
      "Invoices",
      "Expenses",
    ],
  },
  productivity: {
    meant:
      "Time records, formatted documents, and file uploads. Client work remains closed.",
    opens: ["Time tracker", "Rich text", "File uploads"],
    limits: ["Unlimited documents", "500 MB storage"],
    closed: [
      "Projects",
      "Clients",
      "Proposals",
      "CV",
      "Invoices",
      "Expenses",
    ],
  },
  professional: {
    meant:
      "Projects, client records, proposals, and a CV. Invoices remain closed.",
    opens: ["Projects", "Clients", "Proposals", "CV builder"],
    limits: [
      "Unlimited projects and documents",
      "20 clients",
      "2 GB storage",
    ],
    closed: ["Invoices", "Expenses"],
  },
  business: {
    meant: "Invoices and expense records, with no client cap.",
    opens: ["Invoices", "Expenses"],
    limits: [
      "Unlimited clients",
      "5 GB storage",
      "Every live solo tool",
    ],
    closed: ["Shared workspaces", "Role permissions", "SSO"],
  },
  all_access: {
    meant: "The same live tools as Business, with 10 GB of storage.",
    opens: ["No additional tool beyond Business"],
    limits: ["10 GB storage"],
    closed: [
      "Shared workspaces",
      "Model-assisted drafting",
      "A separate support queue",
    ],
  },
  team: {
    meant:
      "The same live tools as All-Access, with 50 GB. Shared work is not available.",
    opens: ["No additional tool"],
    limits: ["50 GB storage"],
    closed: ["Shared workspaces", "Role permissions"],
  },
  business_plus: {
    meant:
      "The same live tools, with 100 GB. Organisation controls are not available.",
    opens: ["No additional tool"],
    limits: ["100 GB storage"],
    closed: ["SSO", "Organisation controls"],
  },
};

const TOOLS: { id: ToolId; label: string }[] = [
  { id: "tasks", label: "Tasks" },
  { id: "documents", label: "Documents" },
  { id: "calculator", label: "Pricing calculator" },
  { id: "time-tracker", label: "Time tracker" },
  { id: "projects", label: "Projects" },
  { id: "clients", label: "Clients" },
  { id: "proposals", label: "Proposals" },
  { id: "resumes", label: "CV builder" },
  { id: "invoices", label: "Invoices" },
  { id: "expenses", label: "Expenses" },
];

function cap(n: number) {
  return n >= 999999 ? "Unlimited" : String(n);
}

function storage(bytes: number) {
  if (bytes <= 0) return "None";

  const gb = bytes / (1024 * 1024 * 1024);

  if (gb >= 1) return gb + " GB";

  return Math.round(bytes / (1024 * 1024)) + " MB";
}

function PanelHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#00D4FF]/15 bg-[#00D4FF]/[0.07]">
        <Icon size={19} className="text-[#00D4FF]" />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function FeatureGroup({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: "open" | "limit" | "closed";
}) {
  return (
    <div>
      <p
        className={`mb-3 text-[9px] font-bold uppercase tracking-[0.18em] ${
          type === "open"
            ? "text-[#00D4FF]"
            : type === "limit"
              ? "text-[#A78BFA]"
              : "text-slate-500"
        }`}
      >
        {title}
      </p>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className={`flex items-start gap-2.5 text-xs leading-5 ${
              type === "closed" ? "text-slate-500" : "text-slate-300"
            }`}
          >
            {type === "closed" ? (
              <X size={14} className="mt-0.5 shrink-0 text-slate-600" />
            ) : (
              <Check
                size={14}
                className={`mt-0.5 shrink-0 ${
                  type === "open" ? "text-[#00D4FF]" : "text-[#A78BFA]"
                }`}
              />
            )}

            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UsageMeter({
  name,
  used,
  max,
  note,
}: {
  name: string;
  used: number;
  max: number;
  note: string;
}) {
  const unlimited = max >= 999999;
  const full = !unlimited && used >= max;
  const width = unlimited
    ? 8
    : Math.min(100, (used / Math.max(max, 1)) * 100);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0B1222]/75 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-white">{name}</span>

        <span
          className={`text-xs font-semibold tabular-nums ${
            full ? "text-red-400" : "text-slate-300"
          }`}
        >
          {used} / {cap(max)}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            full
              ? "bg-red-400"
              : "bg-gradient-to-r from-[#00BBD8] to-[#7256E8]"
          }`}
          style={{ width: width + "%" }}
        />
      </div>

      <p className="mt-2 text-[10px] leading-5 text-slate-500">{note}</p>
    </div>
  );
}

export default function BillingPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [annual, setAnnual] = useState(false);
  const [plan, setPlan] = useState<PlanId>("free");

  const [usage, setUsage] = useState({
    projects: 0,
    clients: 0,
    documents: 0,
  });

  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("plan_id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    const current = (
      sub?.status === "active" ? sub.plan_id : "free"
    ) as PlanId;

    setPlan(PLAN_CONFIG[current] ? current : "free");

    const [projects, clients, documents] = await Promise.all([
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),

      supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),

      supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

    setUsage({
      projects: projects.count || 0,
      clients: clients.count || 0,
      documents: documents.count || 0,
    });

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const limits = PLAN_CONFIG[plan];

  const checkout = async (id: PlanId) => {
    if (id === "free" || id === plan) return;

    const price = annual ? PRICES[id].year : PRICES[id].month;

    setBusy(id);

    const result = await initializePaystackCheckout(id, price);

    if (result.error) {
      toast.error(result.error);
      setBusy(null);
    } else if (result.url) {
      window.location.href = result.url;
    }
  };

  const cancel = async () => {
    if (
      !window.confirm(
        "End this plan now? Paid tools close and the account returns to Free limits."
      )
    ) {
      return;
    }

    setBusy("cancel");

    const result = await cancelSubscriptionAction();

    setBusy(null);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Plan returned to Free.");
      load();
    }
  };

  if (loading) return <PageLoading label="Loading billing..." />;

  const rows = [
    {
      name: "Projects",
      used: usage.projects,
      max: limits.max_projects,
      note: canAccessTool(plan, "projects")
        ? "Available on your current plan"
        : "Requires Professional or above",
    },
    {
      name: "Clients",
      used: usage.clients,
      max: limits.max_clients,
      note: canAccessTool(plan, "clients")
        ? "Available on your current plan"
        : "Requires Professional or above",
    },
    {
      name: "Documents",
      used: usage.documents,
      max: limits.max_documents,
      note: limits.can_use_rich_text
        ? "Rich text editing is available"
        : "Plain notes only on your current plan",
    },
  ];

  const detail = DETAIL[plan];

  return (
    <div className="relative mx-auto max-w-6xl space-y-10 pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#7C5CFC]/[0.07] blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[650px] h-96 w-96 rounded-full bg-[#00D4FF]/[0.045] blur-[130px]"
      />

      <div className="relative">
        <Link
          href="/dashboard/settings"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-[#00D4FF]"
        >
          <ArrowLeft size={14} />
          Account settings
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
                Account management
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Billing & access
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Understand your current access, monitor usage and choose how
              your KLYVOR workspace grows.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 sm:self-auto">
            <LockKeyhole size={13} className="text-[#00D4FF]" />

            <span className="text-[10px] font-medium text-slate-400">
              Secure account billing
            </span>
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[26px] border border-[#00D4FF]/25 bg-gradient-to-br from-[#142B42] via-[#111D33] to-[#17152F] p-6 shadow-[0_20px_65px_rgba(0,212,255,0.07)] sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#00D4FF]/[0.10] blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-[#7C5CFC]/[0.10] blur-[100px]"
        />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/25 bg-[#00D4FF]/[0.09] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#00D4FF]">
                <Sparkles size={12} />
                Your current plan
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Active access
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {NAMES[plan]}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              {detail.meant}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-[#080E1C]/40 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  File storage
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {limits.can_use_attachments
                    ? storage(limits.max_storage_bytes)
                    : "Not available"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#080E1C]/40 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Document editing
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {limits.can_use_rich_text
                    ? "Rich text enabled"
                    : "Plain notes"}
                </p>
              </div>
            </div>

            {plan !== "free" && (
              <Button
                onClick={cancel}
                disabled={busy === "cancel"}
                variant="outline"
                className="mt-6 border-red-400/30 bg-red-500/[0.04] text-red-300 hover:bg-red-500/10 hover:text-red-200"
              >
                {busy === "cancel"
                  ? "Ending plan..."
                  : "End plan and return to Free"}
              </Button>
            )}
          </div>

          <div className="relative rounded-2xl border border-white/[0.09] bg-[#080E1C]/45 p-5 backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00D4FF]/15 bg-[#00D4FF]/[0.07]">
                <Layers3 size={18} className="text-[#00D4FF]" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Plan capabilities
                </p>

                <p className="text-[10px] text-slate-500">
                  What your current plan includes
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <FeatureGroup
                title="Available"
                items={detail.opens}
                type="open"
              />

              <FeatureGroup
                title="Plan limits"
                items={detail.limits}
                type="limit"
              />

              <FeatureGroup
                title="Not included"
                items={detail.closed}
                type="closed"
              />
            </div>
          </div>
        </div>
      </section>
            <section className="relative rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-[#111B30] to-[#0D1527] p-5 sm:p-7">
        <PanelHeading
          eyebrow="Workspace activity"
          title="Recorded use"
          description="See how your current workspace usage compares with your plan limits."
          icon={Gauge}
        />

        <div className="grid gap-3 md:grid-cols-3">
          {rows.map((row) => (
            <UsageMeter
              key={row.name}
              name={row.name}
              used={row.used}
              max={row.max}
              note={row.note}
            />
          ))}
        </div>

        <div className="mt-8 border-t border-white/[0.07] pt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Tool access</h3>

              <p className="mt-1 text-[10px] text-slate-500">
                Availability based on your active plan
              </p>
            </div>

            <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[9px] font-semibold text-slate-400">
              {TOOLS.filter((tool) => canAccessTool(plan, tool.id)).length} of{" "}
              {TOOLS.length} available
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => {
              const open = canAccessTool(plan, tool.id);

              return (
                <div
                  key={tool.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 ${
                    open
                      ? "border-[#00D4FF]/15 bg-[#00D4FF]/[0.035]"
                      : "border-white/[0.06] bg-[#080E1C]/35"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {open ? (
                      <Check
                        size={14}
                        className="shrink-0 text-[#00D4FF]"
                      />
                    ) : (
                      <LockKeyhole
                        size={13}
                        className="shrink-0 text-slate-600"
                      />
                    )}

                    <span
                      className={`truncate text-xs font-medium ${
                        open ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {tool.label}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 text-[9px] font-bold uppercase tracking-wider ${
                      open ? "text-[#00D4FF]" : "text-slate-600"
                    }`}
                  >
                    {open
                      ? "Open"
                      : NAMES[TOOL_REQUIRED_PLAN[tool.id]] + "+"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative space-y-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
              Choose your access
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Explore plans
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Select the level that matches the tools and capacity you need.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-[#111B30] p-1.5">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
                !annual
                  ? "bg-gradient-to-r from-[#00BBD8] to-[#7256E8] text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
                annual
                  ? "bg-gradient-to-r from-[#00BBD8] to-[#7256E8] text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly

              <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[8px] font-bold">
                SAVE 2 MONTHS
              </span>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-500">
          Yearly billing costs the equivalent of ten monthly payments.
        </p>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ORDER.map((id) => {
            const cfg = PLAN_CONFIG[id];
            const price = annual ? PRICES[id].year : PRICES[id].month;
            const current = id === plan;
            const featured = id === "business";
            const copy = DETAIL[id];

            return (
              <article
                key={id}
                className={`group relative flex flex-col overflow-hidden rounded-[22px] border p-5 transition-all duration-300 hover:-translate-y-1 ${
                  current
                    ? "border-[#00D4FF]/45 bg-gradient-to-br from-[#142B42] to-[#141A34] shadow-[0_15px_45px_rgba(0,212,255,0.09)]"
                    : featured
                      ? "border-[#7C5CFC]/35 bg-gradient-to-br from-[#1A1B3A] to-[#111A30] hover:border-[#7C5CFC]/60"
                      : "border-white/[0.08] bg-gradient-to-br from-[#111B30] to-[#0D1527] hover:border-white/20"
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full blur-[85px] ${
                    current
                      ? "bg-[#00D4FF]/[0.12]"
                      : featured
                        ? "bg-[#7C5CFC]/[0.12]"
                        : "bg-[#00D4FF]/[0.045]"
                  }`}
                />

                <div className="relative flex flex-grow flex-col">
                  <div className="mb-5 flex min-h-6 flex-wrap items-center justify-between gap-2">
                    {current ? (
                      <span className="rounded-full border border-[#00D4FF]/25 bg-[#00D4FF]/[0.08] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#00D4FF]">
                        Your current plan
                      </span>
                    ) : featured ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A78BFA]/25 bg-[#7C5CFC]/[0.09] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#B9ABFF]">
                        <Zap size={11} />
                        Featured plan
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                        KLYVOR access
                      </span>
                    )}

                    {current && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00D4FF]/10">
                        <Check size={14} className="text-[#00D4FF]" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {NAMES[id]}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-xs leading-6 text-slate-400">
                    {copy.meant}
                  </p>

                  <div className="mt-5 border-y border-white/[0.07] py-5">
                    <div className="flex items-end gap-1.5">
                      <span className="text-3xl font-bold tracking-tight text-white">
                        ${price}
                      </span>

                      {price > 0 && (
                        <span className="pb-1 text-[10px] text-slate-500">
                          / {annual ? "year" : "month"}
                        </span>
                      )}
                    </div>

                    {annual && price > 0 && (
                      <p className="mt-2 text-[10px] text-[#00D4FF]">
                        2 months free with annual billing
                      </p>
                    )}
                  </div>

                  <div className="mt-5 space-y-5">
                    <FeatureGroup
                      title="Included access"
                      items={copy.opens}
                      type="open"
                    />

                    <FeatureGroup
                      title="Plan limits"
                      items={copy.limits}
                      type="limit"
                    />

                    <FeatureGroup
                      title="Not included"
                      items={copy.closed}
                      type="closed"
                    />
                  </div>

                  <div className="mt-auto pt-7">
                    <div className="mb-4 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/[0.07] pt-4 text-[9px] text-slate-500">
                      <span>Projects: {cap(cfg.max_projects)}</span>
                      <span>Clients: {cap(cfg.max_clients)}</span>
                      <span>Docs: {cap(cfg.max_documents)}</span>

                      <span>
                        Storage:{" "}
                        {cfg.can_use_attachments
                          ? storage(cfg.max_storage_bytes)
                          : "Off"}
                      </span>
                    </div>

                    <Button
                      onClick={() => checkout(id)}
                      disabled={current || id === "free" || busy === id}
                      className={`h-11 w-full rounded-xl text-xs font-bold transition-all ${
                        current
                          ? "border border-[#00D4FF]/20 bg-[#00D4FF]/[0.07] text-[#00D4FF] hover:bg-[#00D4FF]/[0.07]"
                          : featured
                            ? "bg-gradient-to-r from-[#00BBD8] to-[#7256E8] text-white shadow-[0_8px_25px_rgba(0,212,255,0.16)] hover:opacity-90"
                            : "border border-white/10 bg-white/[0.05] text-slate-200 hover:border-[#00D4FF]/35 hover:bg-[#00D4FF]/[0.07] hover:text-white"
                      }`}
                    >
                      {current
                        ? "Current plan"
                        : id === "free"
                          ? "Included with account"
                          : busy === id
                            ? "Opening checkout..."
                            : "Choose " + NAMES[id]}

                      {!current && id !== "free" && (
                        <ArrowUpRight size={15} className="ml-2" />
                      )}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#111B30]/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#00D4FF]/15 bg-[#00D4FF]/[0.06]">
            <CreditCard size={18} className="text-[#00D4FF]" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">
              Manage your workspace with clarity
            </h3>

            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
              Your plan determines the tools and limits available to your
              account. Changes take effect according to your subscription
              status.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-[10px] font-semibold text-slate-500">
          <HardDrive size={14} />
          Plan-based storage and access
        </div>
      </section>
    </div>
  );
                        }
