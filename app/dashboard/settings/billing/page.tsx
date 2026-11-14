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
  free: "Free", productivity: "Productivity", professional: "Professional", business: "Business",
  all_access: "All-Access", team: "Team", business_plus: "Business Plus",
};
const MEANT: Record<PlanId, string> = {
  free: "Try the daily basics: tasks, notes, and price quotes.",
  productivity: "For heavier writing and time tracking. Client and money tools stay locked.",
  professional: "For client work: projects, clients, proposals, and a CV. No invoices yet.",
  business: "For getting paid: invoices and expenses, plus unlimited clients.",
  all_access: "The full solo plan. Same live tools as Business, with 10 GB for files.",
  team: "Same live tools as All-Access, with 50 GB. Shared workspaces are not switched on yet.",
  business_plus: "Same live tools, with 100 GB. Organisation controls are not switched on yet.",
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

function cap(n: number) { return n >= 999999 ? "Unlimited" : String(n); }
function storage(bytes: number) {
  if (bytes <= 0) return "None";
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb} GB`;
  return `${Math.round(bytes / (1024 * 1024))} MB`;
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
    return { label: `${used} / ${cap(max)}`, full, width };
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
    if (!confirm("Cancel now? Paid tools lock and you return to Free limits.")) return;
    setBusy("cancel");
    const result = await cancelSubscriptionAction();
    setBusy(null);
    if (result.error) toast.error(result.error);
    else { toast.success("Plan set back to Free."); load(); }
  };

  if (loading) return <PageLoading label="Loading billing..." />;

  const rows = [
    { name: "Projects", ...meter(usage.projects, limits.max_projects), note: canAccessTool(plan, "projects") ? "Tool is open" : "Tool locked until Professional" },
    { name: "Clients", ...meter(usage.clients, limits.max_clients), note: canAccessTool(plan, "clients") ? "Tool is open" : "Tool locked until Professional" },
    { name: "Documents", ...meter(usage.documents, limits.max_documents), note: limits.can_use_rich_text ? "Rich documents on" : "Quick notes only" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <Link href="/dashboard/settings" className="text-sm text-[#64748B]">Back to Settings</Link>
      <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Your plan</p>
        <h2 className="mt-1 text-2xl font-bold text-white">{NAMES[plan]}</h2>
        <p className="mt-1 text-sm text-[#C7D0E0]">{MEANT[plan]}</p>
        <p className="mt-3 text-sm text-white">Files: {limits.can_use_attachments ? storage(limits.max_storage_bytes) : "attachments off"} · Rich text: {limits.can_use_rich_text ? "on" : "off"}</p>
        {plan !== "free" && <Button onClick={cancel} disabled={busy === "cancel"} variant="outline" className="mt-4 border-[#EF4444] text-[#EF4444]">{busy === "cancel" ? "Canceling..." : "Cancel and return to Free"}</Button>}
      </div>

      <div className="space-y-3 rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Your limits right now</p>
        {rows.map((row) => (
          <div key={row.name}>
            <div className="mb-1 flex justify-between text-sm"><span className="text-white">{row.name}</span><span className={row.full ? "text-[#EF4444]" : "text-[#C7D0E0]"}>{row.label}{row.full ? " · full" : ""}</span></div>
            <div className="h-2 rounded-full bg-[#0B1020]"><div className={`h-2 rounded-full \( {row.full ? "bg-[#EF4444]" : "bg-[#00D4FF]"}`} style={{ width: ` \){row.width}%` }} /></div>
            <p className="mt-1 text-xs text-[#64748B]">{row.note}</p>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {TOOLS.map((tool) => {
            const open = canAccessTool(plan, tool.id);
            return <p key={tool.id} className={`rounded-lg border px-3 py-2 text-xs ${open ? "border-[#22C55E]/30 text-[#22C55E]" : "border-[#27344B] text-[#64748B]"}`}>{tool.label}: {open ? "open" : `needs ${NAMES[TOOL_REQUIRED_PLAN[tool.id]]}`}</p>;
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setAnnual(false)} className={`rounded-full px-4 py-2 text-xs font-semibold ${!annual ? "bg-[#00D4FF] text-[#0B1020]" : "bg-[#111A2E] text-[#64748B]"}`}>Monthly</button>
        <button onClick={() => setAnnual(true)} className={`rounded-full px-4 py-2 text-xs font-semibold ${annual ? "bg-[#00D4FF] text-[#0B1020]" : "bg-[#111A2E] text-[#64748B]"}`}>Yearly</button>
      </div>

      {ORDER.map((id) => {
        const cfg = PLAN_CONFIG[id];
        const price = annual ? PRICES[id].year : PRICES[id].month;
        const current = id === plan;
        return (
          <article key={id} className={`rounded-2xl border p-5 ${current ? "border-[#00D4FF] bg-[#111A2E]" : "border-[#27344B] bg-[#0B1020]"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">{NAMES[id]}{current ? " · current" : ""}</h3>
                <p className="mt-1 text-sm text-[#C7D0E0]">{MEANT[id]}</p>
              </div>
              <p className="text-xl font-bold text-white">{price === 0 ? "$0" : `$${price}`}<span className="text-xs font-normal text-[#64748B]">{price === 0 ? "" : annual ? "/yr" : "/mo"}</span></p>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-[#C7D0E0]">
              <li>Projects {cap(cfg.max_projects)} · Clients {cap(cfg.max_clients)} · Documents {cap(cfg.max_documents)}</li>
              <li>Rich text {cfg.can_use_rich_text ? "on" : "off"} · Attachments {cfg.can_use_attachments ? storage(cfg.max_storage_bytes) : "off"}</li>
              <li>Opens: {TOOLS.filter((tool) => canAccessTool(id, tool.id)).map((tool) => tool.label).join(", ")}</li>
            </ul>
            <Button onClick={() => checkout(id)} disabled={current || id === "free" || busy === id} className="mt-4 w-full bg-white text-[#0B1020] disabled:bg-[#27344B] disabled:text-[#64748B]">
              {current ? "Current plan" : id === "free" ? "Included" : busy === id ? "Opening checkout..." : `Pay for ${NAMES[id]}`}
            </Button>
          </article>
        );
      })}
    </div>
  );
}
