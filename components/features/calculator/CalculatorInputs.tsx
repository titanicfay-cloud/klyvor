"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp } from "lucide-react";

interface CalculatorInputsProps {
  currency: string; setCurrency: (v: string) => void;
  income: string; setIncome: (v: string) => void;
  expenses: string; setExpenses: (v: string) => void;
  hours: string; setHours: (v: string) => void;
  projectHours: string; setProjectHours: (v: string) => void;
  rateType: "calculated" | "custom"; setRateType: (v: "calculated" | "custom") => void;
  customRate: string; setCustomRate: (v: string) => void;
  contingency: string; setContingency: (v: string) => void;
  calculatedHourlyRate: number;
  formatCurrency: (val: number) => string;
}

export default function CalculatorInputs({
  currency, setCurrency, income, setIncome, expenses, setExpenses,
  hours, setHours, projectHours, setProjectHours, rateType, setRateType,
  customRate, setCustomRate, contingency, setContingency, calculatedHourlyRate, formatCurrency
}: CalculatorInputsProps) {
  return (
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
            {rateType === "custom" && <Input type="number" min="1" placeholder="e.g. 50" value={customRate} onChange={e => setCustomRate(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary mt-2 h-11" />}
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
  );
}
