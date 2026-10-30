"use client";
import { DollarSign, Clock, FileText, TrendingDown } from "lucide-react";

export default function ExpenseSummary({ expenses }: { expenses: any[] }) {
  // Group by currency to prevent math errors
  const currencies = Array.from(new Set(expenses.map(e => e.currency)));
  
  const getTotals = (currency: string) => {
    const currExp = expenses.filter(e => e.currency === currency);
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let spentMonth = 0;
    let spentYear = 0;
    let outstanding = 0;

    currExp.forEach(e => {
      const d = new Date(e.expense_date);
      const paid = Number(e.amount_paid) || 0;
      const total = Number(e.amount) || 0;
      
      if (d.getFullYear() === thisYear) {
        spentYear += paid;
        if (d.getMonth() === thisMonth) spentMonth += paid;
      }
      outstanding += (total - paid);
    });

    return { spentMonth, spentYear, outstanding, count: currExp.length, currency };
  };

  const totals = currencies.map(getTotals);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {totals.map(t => (
        <div key={t.currency} className="bg-[#111A2E] border border-[#27344B] p-4 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider">Spent This Month</p>
            <TrendingDown size={16} className="text-[#EF4444]" />
          </div>
          <p className="text-2xl font-bold text-white">{new Intl.NumberFormat("en-US", { style: "currency", currency: t.currency }).format(t.spentMonth)}</p>
          <p className="text-xs text-[#64748B] mt-2">{new Intl.NumberFormat("en-US", { style: "currency", currency: t.currency }).format(t.spentYear)} this year</p>
        </div>
      ))}

      {totals.map(t => (
        <div key={`${t.currency}-out`} className="bg-[#111A2E] border border-[#27344B] p-4 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider">Outstanding Bills</p>
            <Clock size={16} className="text-[#F59E0B]" />
          </div>
          <p className="text-2xl font-bold text-[#F59E0B]">{new Intl.NumberFormat("en-US", { style: "currency", currency: t.currency }).format(t.outstanding)}</p>
          <p className="text-xs text-[#64748B] mt-2">Unpaid / Partial</p>
        </div>
      ))}

      <div className="bg-[#111A2E] border border-[#27344B] p-4 rounded-xl">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider">Total Records</p>
          <FileText size={16} className="text-[#00D4FF]" />
        </div>
        <p className="text-2xl font-bold text-white">{expenses.length}</p>
        <p className="text-xs text-[#64748B] mt-2">All time</p>
      </div>
    </div>
  );
}
