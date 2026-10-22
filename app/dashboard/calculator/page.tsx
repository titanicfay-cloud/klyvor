"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calculator, Save, Trash2, ArrowRight, Loader2 } from "lucide-react";

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

  // Inputs
  const [currency, setCurrency] = useState("USD");
  const [income, setIncome] = useState("4000");
  const [expenses, setExpenses] = useState("600");
  const [hours, setHours] = useState("100");
  
  const [projectHours, setProjectHours] = useState("25");
  const [rateType, setRateType] = useState<"calculated" | "custom">("calculated");
  const [customRate, setCustomRate] = useState("");
  const [contingency, setContingency] = useState("10");

  // UI State
  const [savedCalcs, setSavedCalcs] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [calcName, setCalcName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Formatting Helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // 1. Calculate Hourly Rate
  const numIncome = parseFloat(income) || 0;
  const numExpenses = parseFloat(expenses) || 0;
  const numHours = parseFloat(hours) || 0;

  const isValidHourly = numIncome > 0 && numExpenses >= 0 && numHours > 0;
  const calculatedHourlyRate = isValidHourly ? (numIncome + numExpenses) / numHours : 0;

  // 2. Calculate Project Price
  const numProjectHours = parseFloat(projectHours) || 0;
  const numCustomRate = parseFloat(customRate) || 0;
  const numContingency = parseFloat(contingency) || 0;

  const effectiveRate = rateType === "calculated" ? calculatedHourlyRate : numCustomRate;
  const isValidProject = numProjectHours > 0 && effectiveRate > 0;

  const basePrice = isValidProject ? numProjectHours * effectiveRate : 0;
  const contingencyAmount = basePrice * (numContingency / 100);
  const suggestedPrice = basePrice + contingencyAmount;

  // Fetch Saved Calculations
  const fetchSaved = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("pricing_calculations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("We couldn't load your saved calculations.");
    } else {
      setSavedCalcs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  // Save Logic
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcName.trim()) return;

    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("pricing_calculations").insert([{
      user_id: user.id,
      name: calcName.trim(),
      currency,
      monthly_income_target: numIncome,
      monthly_expenses: numExpenses,
      billable_hours_per_month: numHours,
      project_hours: numProjectHours || null,
      project_hourly_rate: effectiveRate || null,
      contingency_percent: numContingency,
    }]);

    if (error) {
      toast.error("We couldn't save this calculation. Please try again.");
    } else {
      toast.success("Calculation saved successfully.");
      setIsSaveModalOpen(false);
      setCalcName("");
      fetchSaved();
    }
    setIsSaving(false);
  };

  // Load Logic
  const handleLoad = (calc: SavedCalculation) => {
    setCurrency(calc.currency);
    setIncome(calc.monthly_income_target.toString());
    setExpenses(calc.monthly_expenses.toString());
    setHours(calc.billable_hours_per_month.toString());
    setProjectHours(calc.project_hours ? calc.project_hours.toString() : "");
    setContingency(calc.contingency_percent.toString());
    
    // Check if the saved rate matches the calculated rate
    const calcRate = (calc.monthly_income_target + calc.monthly_expenses) / calc.billable_hours_per_month;
    if (calc.project_hourly_rate && Math.abs(calc.project_hourly_rate - calcRate) > 0.01) {
      setRateType("custom");
      setCustomRate(calc.project_hourly_rate.toString());
    } else {
      setRateType("calculated");
      setCustomRate("");
    }
    toast.success(`Loaded "${calc.name}"`);
  };

  // Delete Logic
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this saved calculation?")) return;
    const { error } = await supabase.from("pricing_calculations").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete calculation.");
    } else {
      toast.success("Calculation deleted.");
      setSavedCalcs(savedCalcs.filter(c => c.id !== id));
    }
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
        <div className="lg:col-span-7 space-y-8">
          
          {/* Hourly Rate Inputs */}
          <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Calculate Your Hourly Rate</h2>
            <p className="text-sm text-[#C7D0E0] mb-6">Start with what you need to earn, account for your expenses, and estimate how many hours you can realistically bill.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[180px] bg-[#0B1020] border-[#27344B] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="NGN">NGN (₦)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target monthly income</Label>
                <Input type="number" min="0" value={income} onChange={e => setIncome(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary" />
                <p className="text-xs text-[#64748B]">The monthly income you want to earn before personal income taxes.</p>
              </div>

              <div className="space-y-2">
                <Label>Monthly business expenses</Label>
                <Input type="number" min="0" value={expenses} onChange={e => setExpenses(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary" />
                <p className="text-xs text-[#64748B]">Include costs such as software, internet, equipment, workspace, etc.</p>
              </div>

              <div className="space-y-2">
                <Label>Billable hours per month</Label>
                <Input type="number" min="1" value={hours} onChange={e => setHours(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary" />
                <p className="text-xs text-[#64748B]">Estimate the hours you can actually charge clients for.</p>
              </div>
            </div>
          </div>

          {/* Project Pricing Inputs */}
          <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Price Your Next Project</h2>
            <p className="text-sm text-[#C7D0E0] mb-6">Estimate a project price from your target hourly rate and the time you expect the work to take.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Estimated hours</Label>
                <Input type="number" min="1" value={projectHours} onChange={e => setProjectHours(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary" />
              </div>

              <div className="space-y-2">
                <Label>Your hourly rate</Label>
                <div className="flex gap-2 mb-2">
                  <Button type="button" variant={rateType === "calculated" ? "default" : "outline"} onClick={() => setRateType("calculated")} className={rateType === "calculated" ? "bg-primary text-[#0B1020]" : "border-[#27344B] text-white hover:bg-[#0B1020]"}>
                    Use Calculated ({formatCurrency(calculatedHourlyRate)})
                  </Button>
                  <Button type="button" variant={rateType === "custom" ? "default" : "outline"} onClick={() => setRateType("custom")} className={rateType === "custom" ? "bg-primary text-[#0B1020]" : "border-[#27344B] text-white hover:bg-[#0B1020]"}>
                    Enter Custom Rate
                  </Button>
                </div>
                {rateType === "custom" && (
                  <Input type="number" min="1" placeholder="e.g. 50" value={customRate} onChange={e => setCustomRate(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary mt-2" />
                )}
              </div>

              <div className="space-y-2">
                <Label>Contingency buffer</Label>
                <Select value={contingency} onValueChange={setContingency}>
                  <SelectTrigger className="w-[180px] bg-[#0B1020] border-[#27344B] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
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
              <p className="text-sm text-[#C7D0E0] mb-6">Your estimated minimum hourly rate based on the figures you entered.</p>
              
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

              <Button onClick={() => setIsSaveModalOpen(true)} className="w-full bg-[#27344B] hover:bg-[#334155] text-white">
                <Save size={16} className="mr-2" /> Save Calculation
              </Button>
            </div>

            <p className="text-xs text-[#64748B] text-center leading-relaxed">
              These figures are planning estimates, not guaranteed earnings or market-rate recommendations. They exclude taxes and other costs unless you include them in your inputs.
            </p>

          </div>
        </div>
      </div>

      {/* SAVED CALCULATIONS */}
      <div className="pt-12">
        <h2 className="text-xl font-bold text-white mb-2">Saved Calculations</h2>
        <p className="text-sm text-[#C7D0E0] mb-6">Revisit your previous pricing estimates whenever you need them.</p>
        
        {loading ? (
          <div className="text-[#64748B]">Loading...</div>
        ) : savedCalcs.length === 0 ? (
          <div className="border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50">
            <h3 className="text-white font-medium mb-2">Your pricing history starts here.</h3>
            <p className="text-sm text-[#64748B]">Save a calculation to keep your pricing estimates organised and easy to revisit.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCalcs.map(calc => (
              <div key={calc.id} className="bg-[#0B1020] border border-[#27344B] p-5 rounded-xl flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold truncate pr-4">{calc.name}</h3>
                  <button onClick={() => handleDelete(calc.id)} className="text-[#64748B] hover:text-[#EF4444] transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-[#64748B] mb-4">Saved {new Date(calc.created_at).toLocaleDateString()}</p>
                
                <div className="space-y-1 text-sm text-[#C7D0E0] mb-6 flex-grow">
                  <div className="flex justify-between"><span>Hourly Rate:</span> <span className="text-primary font-medium">{new Intl.NumberFormat("en-US", { style: "currency", currency: calc.currency }).format((calc.monthly_income_target + calc.monthly_expenses) / calc.billable_hours_per_month)}</span></div>
                  {calc.project_hours && <div className="flex justify-between"><span>Project Price:</span> <span className="text-secondary font-medium">{new Intl.NumberFormat("en-US", { style: "currency", currency: calc.currency }).format(calc.project_hours * calc.project_hourly_rate! * (1 + calc.contingency_percent / 100))}</span></div>}
                </div>
                
                <Button variant="outline" onClick={() => handleLoad(calc)} className="w-full border-[#27344B] text-white hover:bg-[#111A2E] mt-auto">
                  Load Calculation <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Modal */}
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Save Your Calculation</DialogTitle>
            <DialogDescription className="text-[#C7D0E0]">
              Give this calculation a name so you can find it again later.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="calcName">Calculation name</Label>
              <Input 
                id="calcName" 
                placeholder="e.g. Website Design Project" 
                value={calcName}
                onChange={(e) => setCalcName(e.target.value)}
                required
                className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsSaveModalOpen(false)} className="text-[#C7D0E0] hover:text-white">Cancel</Button>
              <Button type="submit" disabled={isSaving || !calcName.trim()} className="bg-klyvor-gradient text-white">
                {isSaving ? "Saving..." : "Save Calculation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
