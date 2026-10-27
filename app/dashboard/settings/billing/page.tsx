"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLAN_CONFIG, PlanId } from "@/lib/plans";
import { initializePaystackCheckout } from "@/app/actions/paystack";
import { cancelSubscriptionAction } from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Loader2, ShieldCheck, Zap, Building2, Briefcase, GraduationCap, Crown, Users } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const PLANS = [
  { id: "free", name: "Free", price: 0, icon: GraduationCap, color: "text-[#64748B]", features: ["3 Projects", "3 Clients", "10 Documents", "Basic Notes"] },
  { id: "productivity", name: "Productivity", price: 19, icon: Zap, color: "text-[#F59E0B]", features: ["Unlimited Projects & Docs", "Rich Text Editor", "500MB Storage", "No Client CRM"] },
  { id: "professional", name: "Professional", price: 39, icon: Briefcase, color: "text-[#00D4FF]", features: ["Everything in Productivity", "20 Clients (CRM)", "2GB Storage"] },
  { id: "business", name: "Business", price: 69, icon: Building2, color: "text-[#7C5CFC]", features: ["Everything in Professional", "Unlimited Clients", "5GB Storage"] },
  { id: "all_access", name: "All-Access", price: 99, icon: ShieldCheck, color: "text-[#22C55E]", features: ["Everything in Business", "10GB Storage", "Priority Support"] },
  { id: "team", name: "Team", price: 149, icon: Users, color: "text-[#F97316]", features: ["Everything in All-Access", "Shared Workspaces", "50GB Storage"] },
  { id: "business_plus", name: "Business Plus", price: 299, icon: Crown, color: "text-[#EAB308]", features: ["Everything in Team", "Advanced Org Controls", "100GB Storage"] },
];

export default function BillingPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [usage, setUsage] = useState({ projects: 0, clients: 0, documents: 0 });

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: sub } = await supabase.from("user_subscriptions").select("plan_id, status").eq("user_id", user.id).single();
    setCurrentPlan((sub?.status === "active" ? sub?.plan_id : "free") || "free");
    const [projRes, clientRes, docRes] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("clients").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("user_id", user.id)
    ]);
    setUsage({ projects: projRes.count || 0, clients: clientRes.count || 0, documents: docRes.count || 0 });
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [supabase]);

  const handleUpgrade = async (planId: string, price: number) => {
    setCheckoutLoading(planId);
    const result = await initializePaystackCheckout(planId, price);
    if (result.error) { toast.error(result.error); setCheckoutLoading(null); }
    else if (result.url) { window.location.href = result.url; }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    const result = await cancelSubscriptionAction();
    if (result.error) { toast.error(result.error); }
    else { toast.success("Subscription canceled."); setIsCancelModalOpen(false); fetchData(); }
    setCancelLoading(false);
  };

  if (loading) return <div className="p-8 text-white flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>;

  const activePlanData = PLANS.find(p => p.id === currentPlan) || PLANS[0];
  const limits = PLAN_CONFIG[currentPlan as PlanId] || PLAN_CONFIG['free'];
  const currentPrice = activePlanData.price;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <div>
        <Link href="/dashboard/settings" className="text-sm text-[#64748B] hover:text-white flex items-center gap-2 mb-4">← Back to Settings</Link>
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Plans</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Current Plan</p>
            <div className="flex items-center gap-3 mb-4"><activePlanData.icon className={`w-8 h-8 ${activePlanData.color}`} /><h2 className="text-2xl font-bold text-white">{activePlanData.name}</h2></div>
          </div>
          {currentPlan !== "free" ? <Button onClick={() => setIsCancelModalOpen(true)} variant="outline" className="w-full mt-6 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10">Cancel Subscription</Button> : <Button disabled className="w-full mt-6 bg-[#0B1020] border border-[#27344B] text-[#64748B]">Current Active Plan</Button>}
        </div>
        <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl md:col-span-2">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-4">Workspace Usage</p>
          <div className="space-y-4">
            <div><div className="flex justify-between text-sm mb-1"><span className="text-white">Projects</span><span className="text-[#C7D0E0]">{usage.projects} / {limits.max_projects === 999999 ? 'Unlimited' : limits.max_projects}</span></div><div className="w-full bg-[#0B1020] rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min((usage.projects / (limits.max_projects || 1)) * 100, 100)}%` }}></div></div></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="text-white">Clients</span><span className="text-[#C7D0E0]">{usage.clients} / {limits.max_clients === 999999 ? 'Unlimited' : limits.max_clients}</span></div><div className="w-full bg-[#0B1020] rounded-full h-2"><div className="bg-secondary h-2 rounded-full" style={{ width: `${Math.min((usage.clients / (limits.max_clients || 1)) * 100, 100)}%` }}></div></div></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="text-white">Documents</span><span className="text-[#C7D0E0]">{usage.documents} / {limits.max_documents === 999999 ? 'Unlimited' : limits.max_documents}</span></div><div className="w-full bg-[#0B1020] rounded-full h-2"><div className="bg-success h-2 rounded-full" style={{ width: `${Math.min((usage.documents / (limits.max_documents || 1)) * 100, 100)}%` }}></div></div></div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Manage Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.filter(p => p.id !== currentPlan).map((plan) => {
            const isDowngrade = plan.price < currentPrice;
            return (
              <div key={plan.id} className="bg-[#0B1020] border border-[#27344B] p-6 rounded-2xl flex flex-col hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4"><plan.icon className={`w-8 h-8 ${plan.color}`} /><span className="text-2xl font-bold text-white">${plan.price}<span className="text-sm text-[#64748B] font-normal">/mo</span></span></div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <ul className="space-y-3 mb-8 flex-grow">{plan.features.map((feature, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#C7D0E0]"><CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" /> <span>{feature}</span></li>)}</ul>
                <Button onClick={() => handleUpgrade(plan.id, plan.price)} disabled={checkoutLoading === plan.id} className={`w-full font-semibold ${isDowngrade ? 'bg-[#27344B] text-white hover:bg-[#334155]' : 'bg-white text-[#0B1020] hover:bg-gray-200'}`}>
                  {checkoutLoading === plan.id ? <Loader2 size={16} className="animate-spin" /> : isDowngrade ? `Downgrade to ${plan.name}` : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Cancel Subscription?</DialogTitle><DialogDescription className="text-[#C7D0E0]">You will immediately lose access to premium features and revert to the Free plan limits.</DialogDescription></DialogHeader>
          <DialogFooter className="pt-4"><Button variant="ghost" onClick={() => setIsCancelModalOpen(false)} className="text-[#C7D0E0]">Keep Plan</Button><Button onClick={handleCancel} disabled={cancelLoading} className="bg-[#EF4444] text-white hover:bg-[#EF4444]/90">{cancelLoading ? "Canceling..." : "Yes, Cancel"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
