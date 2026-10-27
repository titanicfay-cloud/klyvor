"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Save, Loader2, TrendingUp, DollarSign, ArrowRight, Trash2 } from "lucide-react";

export default function CalculatorPage() {
  const supabase = createClient();
  const [currency, setCurrency] = useState("USD");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [hours, setHours] = useState("");
  const [projectHours, setProjectHours] = useState("");
  const [rateType, setRateType] = useState<"calculated" | "custom">("calculated");
  const [customRate, setCustomRate] = useState("");
  const [contingency, setContingency] = useState("10");
  const [savedCalcs, setSavedCalcs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [calcName, setCalcName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(val);

  const numIncome = parseFloat(income) || 0;
  const numExpenses = parseFloat(expenses) || 0;
  const numHours = parseFloat(hours) || 0;
  const calculatedHourlyRate = numIncome > 0 && numHours > 0 ? (numIncome + numExpenses) / numHours : 0;
  const effectiveRate = rateType === "calculated" ? calculatedHourlyRate : (parseFloat(customRate) || 0);
  const basePrice = (parseFloat(projectHours) || 0) * effectiveRate;
  const suggestedPrice = basePrice * (1 + (parseFloat(contingency) || 0) / 100);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("pricing_calculations").select("*").order("created_at", { ascending: false });
      setSavedCalcs(data || []);
      setLoading(false);
    };
    fetch();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("pricing_calculations").insert([{ user_id: user.id, name: calcName, currency, monthly_income_target: numIncome, monthly_expenses: numExpenses, billable_hours_per_month: numHours, project_hours: parseFloat(projectHours) || null, project_hourly_rate: effectiveRate, contingency_percent: parseFloat(contingency) }]);
    toast.success("Saved."); setIsSaveModalOpen(false); setCalcName("");
    const { data } = await supabase.from("pricing_calculations").select("*").order("created_at", { ascending: false });
    setSavedCalcs(data || []);
    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div><span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Business</span><h1 className="text-3xl font-bold text-white mb-2">Pricing Calculator</h1></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">1. Hourly Rate</h2>
            <div className="space-y-2"><Label>Currency</Label><Select value={currency} onValueChange={(val) => setCurrency(val as string)}><SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="NGN">NGN</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Target Income</Label><Input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 4000" className="bg-[#0B1020] border-[#27344B] text-white" /></div>
            <div className="space-y-2"><Label>Expenses</Label><Input type="number" value={expenses} onChange={e => setExpenses(e.target.value)} placeholder="e.g. 600" className="bg-[#0B1020] border-[#27344B] text-white" /></div>
            <div className="space-y-2"><Label>Billable Hours</Label><Input type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 100" className="bg-[#0B1020] border-[#27344B] text-white" /></div>
          </div>
          <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">2. Project Pricing</h2>
            <div className="space-y-2"><Label>Project Hours</Label><Input type="number" value={projectHours} onChange={e => setProjectHours(e.target.value)} placeholder="e.g. 25" className="bg-[#0B1020] border-[#27344B] text-white" /></div>
            <div className="space-y-2"><Label>Rate</Label><div className="flex gap-2"><Button type="button" onClick={() => setRateType("calculated")} variant={rateType === "calculated" ? "default" : "outline"} className="flex-1">Calculated</Button><Button type="button" onClick={() => setRateType("custom")} variant={rateType === "custom" ? "default" : "outline"} className="flex-1">Custom</Button></div>{rateType === "custom" && <Input type="number" value={customRate} onChange={e => setCustomRate(e.target.value)} placeholder="Custom Rate" className="bg-[#0B1020] border-[#27344B] text-white mt-2" />}</div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <div className="bg-[#0B1020] border border-[#00D4FF]/30 p-6 rounded-2xl"><p className="text-primary text-xs font-bold uppercase mb-1">Hourly Rate</p><h2 className="text-4xl font-bold text-white">{formatCurrency(calculatedHourlyRate)}</h2></div>
            <div className="bg-[#111A2E] border border-[#7C5CFC]/30 p-6 rounded-2xl"><p className="text-secondary text-xs font-bold uppercase mb-1">Project Price</p><h2 className="text-3xl font-bold text-white mb-4">{formatCurrency(suggestedPrice)}</h2><Button onClick={() => setIsSaveModalOpen(true)} className="w-full bg-[#27344B] hover:bg-[#334155]"><Save size={16} className="mr-2"/> Save</Button></div>
          </div>
        </div>
      </div>
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}><DialogContent className="bg-[#0B1020] border-[#27344B] text-white"><DialogHeader><DialogTitle>Save Calculation</DialogTitle></DialogHeader><form onSubmit={handleSave} className="space-y-4"><Input value={calcName} onChange={e => setCalcName(e.target.value)} placeholder="Name..." required className="bg-[#111A2E] border-[#27344B] text-white" /><Button type="submit" disabled={isSaving} className="w-full bg-klyvor-gradient text-white">{isSaving ? "Saving..." : "Save"}</Button></form></DialogContent></Dialog>
    </div>
  );
}
