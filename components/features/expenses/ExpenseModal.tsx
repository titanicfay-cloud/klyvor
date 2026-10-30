"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const CATEGORIES = ["Software & Subscriptions", "Equipment & Hardware", "Marketing & Advertising", "Travel & Transportation", "Office Supplies", "Internet & Communications", "Professional Services", "Rent & Utilities", "Education & Training", "Banking & Transaction Fees", "Taxes & Government Charges", "Other"];
const METHODS = ["Bank Transfer", "Card", "Cash", "Other"];

export default function ExpenseModal({ isOpen, setIsOpen, editingExpense, onSave }: any) {
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Software & Subscriptions");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentMethod, setPaymentMethod] = useState("Card");

  useEffect(() => {
    if (editingExpense) {
      setVendor(editingExpense.vendor);
      setDescription(editingExpense.description || "");
      setCategory(editingExpense.category);
      setExpenseDate(editingExpense.expense_date);
      setAmount(editingExpense.amount.toString());
      setAmountPaid(editingExpense.amount_paid.toString());
      setCurrency(editingExpense.currency);
      setPaymentMethod(editingExpense.payment_method || "Card");
    } else {
      setVendor(""); setDescription(""); setCategory("Software & Subscriptions"); setExpenseDate(new Date().toISOString().split('T')[0]); setAmount(""); setAmountPaid("0"); setCurrency("USD"); setPaymentMethod("Card");
    }
  }, [editingExpense, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      id: editingExpense?.id, 
      vendor, description, category, expense_date: expenseDate, 
      amount: parseFloat(amount) || 0, 
      amount_paid: parseFloat(amountPaid) || 0, 
      currency, payment_method: paymentMethod 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[500px]">
        <DialogHeader><DialogTitle>{editingExpense ? "Edit Expense" : "Add Expense"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Vendor / Payee <span className="text-[#EF4444]">*</span></Label><Input value={vendor} onChange={e => setVendor(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white" placeholder="e.g. Adobe" /></div>
            <div className="space-y-2"><Label>Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as string)}>
                <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white resize-none h-16" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Amount <span className="text-[#EF4444]">*</span></Label>
              <div className="flex gap-2">
                <Select value={currency} onValueChange={(val) => setCurrency(val as string)}>
                  <SelectTrigger className="w-[90px] bg-[#111A2E] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem><SelectItem value="NGN">NGN</SelectItem></SelectContent>
                </Select>
                <Input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required className="flex-1 bg-[#111A2E] border-[#27344B] text-white" />
              </div>
            </div>
            <div className="space-y-2"><Label>Date <span className="text-[#EF4444]">*</span></Label><Input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white [color-scheme:dark]" /></div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-[#111A2E]/50 border border-[#27344B] rounded-xl">
            <div className="space-y-2"><Label>Amount Paid</Label><Input type="number" step="0.01" min="0" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
            <div className="space-y-2"><Label>Method</Label>
              <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as string)}>
                <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">{METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <p className="col-span-2 text-xs text-[#64748B]">Leave Amount Paid at 0 to mark this as Unpaid.</p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-[#C7D0E0]">Cancel</Button>
            <Button type="submit" className="bg-klyvor-gradient text-white">Save Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
