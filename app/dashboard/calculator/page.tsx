"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calculator, Save, Trash2, ArrowRight, Loader2, TrendingUp, DollarSign } from "lucide-react";

interface SavedCalculation {
  id: string;
  name: string;
  currency: string;
  monthly_income_target: number;
  monthly_expenses: number;
  billable_hours_per_month: number;
  project_hours: number | null;
  project_hourly_rate: number | null;
  contingency_percent: number;
  created_at: string;
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  const numIncome = parseFloat(income) || 0;
  const numExpenses = parseFloat(expenses) || 0;
  const numHours = parseFloat(hours) || 0;
  const isValidHourly = numIncome > 0 && numExpenses >= 0 && numHours > 0;
  const calculatedHourlyRate = isValidHourly ? (numIncome + numExpenses) / numHours : 0;

  const numProjectHours = parseFloat(projectHours) || 0;
  const numCustomRate = parseFloat(customRate) || 0;
  const numContingency = parseFloat(contingency) || 0;
  const effectiveRate = rateType === "calculated" ? calculatedHourlyRate : numCustomRate;
  const isValidProject = numProjectHours > 0 && effectiveRate > 0;
  const basePrice = isValidProject ? numProjectHours * effectiveRate : 0;
  const contingencyAmount = basePrice * (numContingency / 100);
  const suggestedPrice = basePrice + contingencyAmount;

  const fetchSaved = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from("pricing_calculations").select("*").order("created_at", { ascending: false });
    if (!error) setSavedCalcs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSaved(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcName.trim()) return;
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("pricing_calculations").insert([{
      user_id: user.id, name: calcName.trim(), currency,
      monthly_income_target: numIncome, monthly_expenses: numExpenses, billable_hours_per_month: numHours,
      project_hours: numProjectHours || null, project_hourly_rate: effectiveRate || null, contingency_percent: numContingency,
    }]);

    if (error) toast.error("We couldn't save this calculation.");
    else { toast.success("Calculation saved."); setIsSaveModalOpen(false); setCalcName(""); fetchSaved(); }
    setIsSaving(false);
  };

  const handleLoad = (calc: SavedCalculation) => {
    setCurrency(calc.currency);
    setIncome(calc.monthly_income_target.toString());
    setExpenses(calc.monthly_expenses.toString());
    setHours(calc.billable_hours_per_month.toString());
    setProjectHours(calc.project_hours ? calc.project_hours.toString() : "");
    setContingency(calc.contingency_percent.toString());
    const calcRate = (calc.monthly_income_target + calc.monthly_expenses) / calc.billable_hours_per_month;
    if (calc.project_hourly_rate && Math.abs(calc.project_hourly_rate - calcRate) > 0.01) {
      setRateType("custom"); setCustomRate(calc.project_hourly_rate.toString());
    } else { setRateType("calculated"); setCustomRate(""); }
    toast.success(`Loaded "${calc.name}"`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this saved calculation?")) return;
    const { error } = await supabase.from("pricing_calculations").delete().eq("id", id);
    if (!error) { setSavedCalcs(savedCalcs.filter(c => c.id !== id)); toast.success("Deleted."); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Business & Finance</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Know Your Worth. Price With Confidence.</h1>
        <p className="text-[#C7D0E0] max-w-3xl">Turn your income goals, business expenses, and available working hours into pricing targets that help you plan your next move.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><DollarSign size={20} className="text-primary"/> Calculate Your Hourly Rate</h2>
            <p className="text-sm text-[#64748B] mb-6">Start with what you need to earn, account for your expenses, and estimate how many hours you can realistically bill.</p>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[#C7D0E0]">Currency</Label>
                <Select value={currency} onValueChange={(val) => setCurrency(val as string)}>
                  <SelectTrigger className="w-full bg-[#0B1020] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="USD">USD ($)</SelectItem><SelectItem value="EUR">EUR (€)</SelectItem><SelectItem value="GBP">GBP (£)</SelectItem><SelectItem value="NGN">NGN (₦)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#64748B]">The currency you want your final rate to display in.</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#C7D0E0]">Target Monthly Income</Label>
                <Input type="number" min="0" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 4000" className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary h-11" />
                <p className="text-xs text-[#64748B]">The monthly income you want to earn before personal income taxes.</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#C7D0E0]">Monthly Business Expenses</Label>
                <Input type="number" min="0" value={expenses} onChange={e => setExpenses(e.target.value)} placeholder="e.g. 600" className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary h-11" />
                <p className="text-xs text-[#64748B]">Include costs such as software, internet, equipment, workspace, etc.</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#C7D0E0]">Billable Hours per Month</Label>
                <Input type="number" min="1" value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 100" className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary h-11" />
                <p className="text-xs text-[#64748B]">Estimate the hours you can actually charge clients for (not all working hours).</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><TrendingUp size={20} className="text-secondary"/> Price Your Next Project</h2>
            <p className="text-sm text-[#64748B] mb-6">Estimate a project price from your target hourly rate and the time you expect the work to take.</p>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[#C7D0E0]">Estimated Project Hours</Label>
                <Input type="number" min="1" value={projectHours} onChange={e => setProjectHours(e.target.value)} placeholder="e.g. 25" className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary h-11" />
                <p className="text-xs text-[#64748B]">How many hours do you expect this specific project to take?</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#C7D0E0]">Hourly Rate</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant={rateType === "calculated" ? "default" : "outline"} onClick={() => setRateType("calculated")} className={`flex-1 h-11 ${rateType === "calculated" ? "bg-primary text-[#0B1020] hover:bg-primary/90" : "border-[#27344B] text-[#C7D0E0] hover:bg-[#0B1020]"}`}>
                    Use Calculated ({formatCurrency(calculatedHourlyRate)})
                  </Button>
                  <Button type="button" variant={rateType === "custom" ? "default" : "outline"} onClick={() => setRateType("custom")} className={`flex-1 h-11 ${rateType === "custom" ? "bg-primary text-[#0B1020] hover:bg-primary/90" : "border-[#27344B] text-[#C7D0E0] hover:bg-[#0B1020]"}`}>
                    Enter Custom Rate
                  </Button>
                </div>
                {rateType === "custom" && (
                  <Input type="number" min="1" placeholder="e.g. 50" value={customRate} onChange={e => setCustomRate(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary mt-2 h-11" />
                )}
                <p className="text-xs text-[#64748B]">Choose to use the rate calculated above, or type a specific rate for this project.</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#C7D0E0]">Contingency Buffer</Label>
                <Select value={contingency} onValueChange={(val) => setContingency(val as string)}>
                  <SelectTrigger className="w-full bg-[#0B1020] border-[#27344B] text-white h-11"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="0">0% (No buffer)</SelectItem><SelectItem value="5">5%</SelectItem><SelectItem value="10">10%</SelectItem><SelectItem value="15">15%</SelectItem><SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#64748B]">Allow extra room for uncertainty, revisions, or unexpected work.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 space-y-6">
            
            <div className="bg-[#0B1020] border border-[#00D4FF]/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(0,212,255,0.05)]">
              <p className="text-primary font-bold text-xs tracking-widest uppercase mb-2">Your Target Hourly Rate</p>
              <div className="flex items-baseline gap-2 mb-4">
                <h2 className="text-5xl font-bold text-white">{formatCurrency(calculatedHourlyRate)}</h2>
                <span className="text-[#64748B]">/ hour</span>
              </div>
              <p className="text-sm text-[#64748B] mb-6">Your estimated minimum hourly rate based on the figures you entered.</p>
              
              <div className="space-y-2 text-sm border-t border-[#27344B] pt-4">
                <div className="flex justify-between text-[#C7D0E0]"><span>Income Target:</span> <span className="text-white">{formatCurrency(numIncome)}</span></div>
                <div className="flex justify-between text-[#C7D0E0]"><span>Expenses:</span> <span className="text-white">{formatCurrency(numExpenses)}</span></div>
                <div className="flex justify-between text-[#C7D0E0]"><span>Billable Hours:</span> <span className="text-white">{numHours}</span></div>
              </div>
            </div>

            <div className="bg-[#111A2E] border border-[#7C5CFC]/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(124,92,252,0.05)]">
              <p className="text-secondary font-bold text-xs tracking-widest uppercase mb-2">Suggested Project Price</p>
              <h2 className="text-4xl font-bold text-white mb-6">{formatCurrency(suggestedPrice)}</h2>
              
              <div className="space-y-2 text-sm border-t border-[#27344B] pt-4 mb-6">
                <div className="flex justify-between text-[#C7D0E0]"><span>Base Price ({numProjectHours} hrs):</span> <span className="text-white">{formatCurrency(basePrice)}</span></div>
                <div className="flex justify-between text-[#C7D0E0]"><span>Contingency ({numContingency}%):</span> <span className="text-white">+{formatCurrency(contingencyAmount)}</span></div>
              </div>

              <Button onClick={() => setIsSaveModalOpen(true)} className="w-full bg-[#27344B] hover:bg-[#334155] text-white h-11">
                <Save size={16} className="mr-2" /> Save Calculation
              </Button>
            </div>

            <p className="text-xs text-[#64748B] text-center leading-relaxed px-4">
              These figures are planning estimates, not guaranteed earnings. They exclude personal taxes.
            </p>

          </div>
        </div>
      </div>

      {/* SAVED CALCULATIONS */}
      <div className="pt-10 border-t border-[#27344B]">
        <h2 className="text-xl font-bold text-white mb-2">Saved Calculations</h2>
        <p className="text-sm text-[#64748B] mb-6">Revisit your previous pricing estimates.</p>
        
        {loading ? ( <div className="text-[#64748B]">Loading...</div> ) : savedCalcs.length === 0 ? (
          <div className="border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50">
            <h3 className="text-white font-medium mb-2">No saved calculations yet.</h3>
            <p className="text-sm text-[#64748B]">Save a calculation to keep your pricing estimates organised.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCalcs.map(calc => (
              <div key={calc.id} className="bg-[#0B1020] border border-[#27344B] p-5 rounded-xl flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold truncate pr-4">{calc.name}</h3>
                  <button onClick={() => handleDelete(calc.id)} className="text-[#64748B] hover:text-[#EF4444] transition-colors"><Trash2 size={16} /></button>
                </div>
                <p className="text-xs text-[#64748B] mb-4">Saved {new Date(calc.created_at).toLocaleDateString()}</p>
                <div className="space-y-1 text-sm text-[#C7D0E0] mb-6 flex-grow">
                  <div className="flex justify-between"><span>Hourly:</span> <span className="text-primary font-medium">{formatCurrency((calc.monthly_income_target + calc.monthly_expenses) / calc.billable_hours_per_month)}</span></div>
                  {calc.project_hours && <div className="flex justify-between"><span>Project:</span> <span className="text-secondary font-medium">{formatCurrency(calc.project_hours * calc.project_hourly_rate! * (1 + calc.contingency_percent / 100))}</span></div>}
                </div>
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
            <div className="space-y-2">
              <Label>Calculation Name</Label>
              <Input placeholder="e.g. Website Design Project" value={calcName} onChange={(e) => setCalcName(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsSaveModalOpen(false)} className="text-[#C7D0E0] hover:text-white">Cancel</Button>
              <Button type="submit" disabled={isSaving || !calcName.trim()} className="bg-klyvor-gradient text-white">{isSaving ? "Saving..." : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
