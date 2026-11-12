"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowRight, Trash2, Loader2 } from "lucide-react";
import CalculatorInputs from "@/components/features/calculator/CalculatorInputs";
import CalculatorResults from "@/components/features/calculator/CalculatorResults";

interface SavedCalculation {
  id: string; name: string; currency: string; monthly_income_target: number; monthly_expenses: number; billable_hours_per_month: number; project_hours: number | null; project_hourly_rate: number | null; contingency_percent: number; created_at: string;
}

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
  const [savedCalcs, setSavedCalcs] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [calcName, setCalcName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(val);
  const numIncome = parseFloat(income) || 0;
  const numExpenses = parseFloat(expenses) || 0;
  const numHours = parseFloat(hours) || 0;
  const calculatedHourlyRate = numHours > 0 ? (numIncome + numExpenses) / numHours : 0;
  const effectiveRate = rateType === "calculated" ? calculatedHourlyRate : (parseFloat(customRate) || 0);
  const basePrice = (parseFloat(projectHours) || 0) * effectiveRate;
  const suggestedPrice = basePrice * (1 + (parseFloat(contingency) || 0) / 100);

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("pricing_calculations").select("*").order("created_at", { ascending: false });
      setSavedCalcs(data || []);
      setLoading(false);
    };
    fetchSaved();
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

  const handleLoad = (calc: SavedCalculation) => {
    setCurrency(calc.currency); setIncome(calc.monthly_income_target.toString()); setExpenses(calc.monthly_expenses.toString()); setHours(calc.billable_hours_per_month.toString()); setProjectHours(calc.project_hours ? calc.project_hours.toString() : ""); setContingency(calc.contingency_percent.toString());
    const calcRate = (calc.monthly_income_target + calc.monthly_expenses) / calc.billable_hours_per_month;
    if (calc.project_hourly_rate && Math.abs(calc.project_hourly_rate - calcRate) > 0.01) { setRateType("custom"); setCustomRate(calc.project_hourly_rate.toString()); } else { setRateType("calculated"); setCustomRate(""); }
    toast.success(`Loaded "${calc.name}"`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this saved calculation?")) return;
    const { error } = await supabase.from("pricing_calculations").delete().eq("id", id);
    if (!error) { setSavedCalcs(savedCalcs.filter(c => c.id !== id)); toast.success("Deleted."); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Business & Finance</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Know Your Worth. Price With Confidence.</h1>
        <p className="text-[#C7D0E0] max-w-3xl">Turn your income goals, business expenses, and available working hours into pricing targets that help you plan your next move.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <CalculatorInputs 
          currency={currency} setCurrency={setCurrency} income={income} setIncome={setIncome} expenses={expenses} setExpenses={setExpenses} hours={hours} setHours={setHours} projectHours={projectHours} setProjectHours={setProjectHours} rateType={rateType} setRateType={setRateType} customRate={customRate} setCustomRate={setCustomRate} contingency={contingency} setContingency={setContingency} calculatedHourlyRate={calculatedHourlyRate} formatCurrency={formatCurrency}
        />
        <CalculatorResults 
          calculatedHourlyRate={calculatedHourlyRate} suggestedPrice={suggestedPrice} numIncome={numIncome} numExpenses={numExpenses} numHours={numHours} numProjectHours={parseFloat(projectHours) || 0} basePrice={basePrice} contingencyAmount={basePrice * ((parseFloat(contingency) || 0) / 100)} numContingency={parseFloat(contingency) || 0} formatCurrency={formatCurrency} setIsSaveModalOpen={setIsSaveModalOpen}
        />
      </div>

      <div className="pt-10 border-t border-[#27344B]">
        <h2 className="text-xl font-bold text-white mb-2">Saved Calculations</h2>
        {loading ? ( <div className="flex min-h-[20vh] flex-col items-center justify-center text-sm text-[#C7D0E0]"><div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#27344B] border-t-[#00D4FF]" />Loading...</div> ) : savedCalcs.length === 0 ? (
          <div className="border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50"><h3 className="text-white font-medium mb-2">No saved calculations yet.</h3></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {savedCalcs.map(calc => (
              <div key={calc.id} className="bg-[#0B1020] border border-[#27344B] p-5 rounded-xl flex flex-col">
                <div className="flex justify-between items-start mb-2"><h3 className="text-white font-semibold truncate pr-4">{calc.name}</h3><button onClick={() => handleDelete(calc.id)} className="text-[#64748B] hover:text-[#EF4444] transition-colors"><Trash2 size={16} /></button></div>
                <p className="text-xs text-[#64748B] mb-4">Saved {new Date(calc.created_at).toLocaleDateString()}</p>
                <div className="space-y-1 text-sm text-[#C7D0E0] mb-6 flex-grow"><div className="flex justify-between"><span>Hourly:</span> <span className="text-primary font-medium">{calc.billable_hours_per_month > 0 ? formatCurrency((calc.monthly_income_target + calc.monthly_expenses) / calc.billable_hours_per_month) : "—"}</span></div></div>
                <Button variant="outline" onClick={() => handleLoad(calc)} className="w-full border-[#27344B] text-white hover:bg-[#111A2E] mt-auto">Load <ArrowRight size={14} className="ml-2" /></Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Save Your Calculation</DialogTitle><DialogDescription className="text-[#C7D0E0]">Give this calculation a name to find it later.</DialogDescription></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="space-y-2"><Input placeholder="e.g. Website Design Project" value={calcName} onChange={(e) => setCalcName(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" /></div>
            <DialogFooter><Button type="button" variant="ghost" onClick={() => setIsSaveModalOpen(false)} className="text-[#C7D0E0]">Cancel</Button><Button type="submit" disabled={isSaving || !calcName.trim()} className="bg-klyvor-gradient text-white">{isSaving ? "Saving..." : "Save"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
