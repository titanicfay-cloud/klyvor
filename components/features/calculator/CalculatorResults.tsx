"use client";
import { Button } from "@/components/ui/button";
import { Save, Copy } from "lucide-react";
import { toast } from "sonner";

interface CalculatorResultsProps {
  calculatedHourlyRate: number;
  suggestedPrice: number;
  numIncome: number;
  numExpenses: number;
  numHours: number;
  numProjectHours: number;
  basePrice: number;
  contingencyAmount: number;
  numContingency: number;
  formatCurrency: (val: number) => string;
  setIsSaveModalOpen: (v: boolean) => void;
}

export default function CalculatorResults({
  calculatedHourlyRate, suggestedPrice, numIncome, numExpenses, numHours,
  numProjectHours, basePrice, contingencyAmount, numContingency, formatCurrency, setIsSaveModalOpen
}: CalculatorResultsProps) {
  return (
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
          <div className="flex gap-2">
            <Button onClick={() => { navigator.clipboard.writeText(formatCurrency(suggestedPrice)); toast.success("Price copied."); }} variant="outline" className="flex-1 border-[#27344B] text-white h-11">
              <Copy size={16} className="mr-2" /> Copy price
            </Button>
            <Button onClick={() => setIsSaveModalOpen(true)} className="flex-1 bg-[#27344B] hover:bg-[#334155] text-white h-11">
              <Save size={16} className="mr-2" /> Save
            </Button>
          </div>
        </div>

        <p className="text-xs text-[#64748B] text-center leading-relaxed px-4">
          These figures are planning estimates, not guaranteed earnings. They exclude personal taxes.
        </p>
      </div>
    </div>
  );
}
