"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PLAN_CONFIG, PlanId, TOOL_REQUIRED_PLAN, ToolId, canAccessTool } from "@/lib/plans";
import { initializePaystackCheckout } from "@/app/actions/paystack";
import { cancelSubscriptionAction } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/states";
import { toast } from "sonner";

const ORDER: PlanId[] = ["free", "productivity", "professional", "business", "all_access", "team", "business_plus"];
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
const DETAIL: Record<PlanId, { meant: string; opens: string[]; limits: string[]; closed: string[] }> = {
  free: {
    meant: "Tasks, documents, and fee calculations. Client records and billing remain closed.",
    opens: ["Tasks", "Documents", "Pricing calculator"],
    limits: ["10 documents", "Plain notes", "No file uploads"],
    closed: ["Time tracker", "Projects", "Clients", "Proposals", "CV", "Invoices", "Expenses"],
  },
  productivity: {
    meant: "Time records, formatted documents, and file uploads. Client work remains closed.",
    opens: ["Time tracker", "Rich text", "File uploads"],
    limits: ["Unlimited documents", "500 MB storage"],
    closed: ["Projects", "Clients", "Proposals", "CV", "Invoices", "Expenses"],
  },
  professional: {
    meant: "Projects, client records, proposals, and a CV. Invoices remain closed.",
    opens: ["Projects", "Clients", "Proposals", "CV builder"],
    limits: ["Unlimited projects and documents", "20 clients", "2 GB storage"],
    closed: ["Invoices", "Expenses"],
  },
  business: {
    meant: "Invoices and expense records, with no client cap.",
    opens: ["Invoices", "Expenses"],
    limits: ["Unlimited clients", "5 GB storage", "Every live solo tool"],
    closed: ["Shared workspaces", "Role permissions", "SSO"],
  },
  all_access: {
    meant: "The same live tools as Business, with 10 GB of storage.",
    opens: ["No additional tool beyond Business"],
    limits: ["10 GB storage"],
    closed: ["Shared workspaces", "Model-assisted drafting", "A separate support queue"],
  },
  team: {
    meant: "The same live tools as All-Access, with 50 GB. Shared work is not available.",
    opens: ["No additional tool"],
    limits: ["50 GB storage"],
    closed: ["Shared workspaces", "Role permissions"],
  },
  business_plus: {
    meant: "The same live tools, with 100 GB. Organisation controls are not available.",
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
function Group({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-5 text-[#C7D0E0]">
            <span className="text-[#00D4FF]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BillingPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [annual, setAnnual] = useState(false);
  const [plan, setPlan] = useState<PlanId>("free");
  const [usage, setUsage] = useState({ projects: 0, clients: 0, documents: 0 });
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: sub } = await supabase.from("user_subscriptions").select("plan_id, status").eq("user_id", user.id).maybeSingle();
    const current = (sub?.status === "active" ? sub.plan_id : "free") as PlanId;
    setPlan(PLAN_CONFIG[current] ? current : "free");
    const [projects, clients, documents] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("clients").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    ]);
    setUsage({ projects: projects.count || 0, clients: clients.count || 0, documents: documents.count || 0 });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const limits = PLAN_CONFIG[plan];
  const meter = (used: number, max: number) => {
    const unlimited = max >= 999999;
    const full = !unlimited && used >= max;
    const width = unlimited ? 8 : Math.min(100, (used / Math.max(max, 1)) * 100);
    return { label: used + " / " + cap(max), full, width };
  };

  const checkout = async (id: PlanId) => {
    if (id === "free" || id === plan) return;
    const price = annual ? PRICES[id].year : PRICES[id].month;
    setBusy(id);
    const result = await initializePaystackCheckout(id, price);
    if (result.error) { toast.error(result.error); setBusy(null); }
    else if (result.url) window.location.href = result.url;
  };

  const cancel = async () => {
    if (!window.confirm("End this plan now? Paid tools close and the account returns to Free limits.")) return;
    setBusy("cancel");
    const result = await cancelSubscriptionAction();
    setBusy(null);
    if (result.error) toast.error(result.error);
    else { toast.success("Plan returned to Free."); load(); }
  };

  if (loading) return <PageLoading label="Loading billing..." />;

  const rows = [
    { name: "Projects", ...meter(usage.projects, limits.max_projects), note: canAccessTool(plan, "projects") ? "Open on this plan" : "Closed until Professional" },
    { name: "Clients", ...meter(usage.clients, limits.max_clients), note: canAccessTool(plan, "clients") ? "Open on this plan" : "Closed until Professional" },
    { name: "Documents", ...meter(usage.documents, limits.max_documents), note: limits.can_use_rich_text ? "Rich text is available" : "Plain notes only" },
  ];
  const detail = DETAIL[plan];

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-24" style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}>
      <div>
        <Link href="/dashboard/settings" className="text-sm text-[#64748B]">Settings</Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00D4FF]">Account</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">Billing</h1>
      </div>

      <section className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">Current plan</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{NAMES[plan]}</h2>
        <p className="mt-2 text-sm leading-6 text-[#C7D0E0]">{detail.meant}</p>
        <p className="mt-3 text-sm text-white">Storage {limits.can_use_attachments ? storage(limits.max_storage_bytes) : "off"} · Rich text {limits.can_use_rich_text ? "on" : "off"}</p>
        <div className="mt-5 space-y-4">
          <Group title="Opens" items={detail.opens} />
          <Group title="Limits" items={detail.limits} />
          <Group title="Not included" items={detail.closed} />
        </div>
        {plan !== "free" && (
          <Button onClick={cancel} disabled={busy === "cancel"} variant="outline" className="mt-5 border-[#EF4444] text-[#EF4444]">
            {busy === "cancel" ? "Ending plan..." : "End plan and return to Free"}
          </Button>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
        <h2 className="text-lg font-semibold text-white">Recorded use</h2>
        {rows.map((row) => (
          <div key={row.name}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-white">{row.name}</span>
              <span className={row.full ? "text-[#EF4444]" : "text-[#C7D0E0]"}>{row.label}{row.full ? " · at limit" : ""}</span>
            </div>
            <div className="h-2 rounded-full bg-[#0B1020]">
              <div className={row.full ? "h-2 rounded-full bg-[#EF4444]" : "h-2 rounded-full bg-[#00D4FF]"} style={{ width: row.width + "%" }} />
            </div>
            <p className="mt-1 text-xs text-[#64748B]">{row.note}</p>
          </div>
        ))}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">Tool access</h3>
          <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TOOLS.map((tool) => {
              const open = canAccessTool(plan, tool.id);
              return (
                <li key={tool.id} className={open ? "rounded-lg border border-[#22C55E]/30 px-3 py-2 text-sm text-[#22C55E]" : "rounded-lg border border-[#27344B] px-3 py-2 text-sm text-[#64748B]"}>
                  {tool.label}: {open ? "open" : "requires " + NAMES[TOOL_REQUIRED_PLAN[tool.id]]}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Change plan</h2>
          <div className="flex gap-2">
            <button onClick={() => setAnnual(false)} className={!annual ? "rounded-full bg-[#00D4FF] px-3 py-1.5 text-xs font-semibold text-[#0B1020]" : "rounded-full bg-[#111A2E] px-3 py-1.5 text-xs font-medium text-[#64748B]"}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={annual ? "rounded-full bg-[#00D4FF] px-3 py-1.5 text-xs font-semibold text-[#0B1020]" : "rounded-full bg-[#111A2E] px-3 py-1.5 text-xs font-medium text-[#64748B]"}>Yearly</button>
          </div>
        </div>
        {ORDER.map((id) => {
          const cfg = PLAN_CONFIG[id];
          const price = annual ? PRICES[id].year : PRICES[id].month;
          const current = id === plan;
          const copy = DETAIL[id];
          return (
            <article key={id} className={current ? "rounded-2xl border border-[#00D4FF] bg-[#111A2E] p-5" : "rounded-2xl border border-[#27344B] bg-[#0B1020] p-5"}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-white">{NAMES[id]}{current ? " · current" : ""}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#C7D0E0]">{copy.meant}</p>
                </div>
                <p className="text-xl font-semibold text-white">{price === 0 ? "$0" : "$" + price}<span className="text-xs font-normal text-[#64748B]">{price === 0 ? "" : annual ? "/yr" : "/mo"}</span></p>
              </div>
              <p className="mt-3 text-sm text-[#C7D0E0]">Projects {cap(cfg.max_projects)} · Clients {cap(cfg.max_clients)} · Documents {cap(cfg.max_documents)} · Storage {cfg.can_use_attachments ? storage(cfg.max_storage_bytes) : "off"}</p>
              <Button onClick={() => checkout(id)} disabled={current || id === "free" || busy === id} className="mt-4 w-full bg-white text-[#0B1020] disabled:bg-[#27344B] disabled:text-[#64748B]">
                {current ? "Current plan" : id === "free" ? "Included with the account" : busy === id ? "Opening checkout..." : "Subscribe to " + NAMES[id]}
              </Button>
            </article>
          );
        })}
      </section>
    </div>
  );
             }
