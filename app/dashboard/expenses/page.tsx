"use client";
import { PageLoading } from "@/components/ui/states";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search, Trash2, Loader2, MoreHorizontal, Edit } from "lucide-react";
import ExpenseModal from "@/components/features/expenses/ExpenseModal";
import ExpenseSummary from "@/components/features/expenses/ExpenseSummary";
import { saveExpenseAction, deleteExpenseAction } from "@/app/actions/expenses";
import { formatDate } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ExpensesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let { data: member } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.id).maybeSingle();
      if (!member) {
        // Self-healing workspace
        const { data: newWs } = await supabase.from("workspaces").insert([{ name: "My Workspace", type: "personal" }]).select().single();
        if (newWs) {
          await supabase.from("workspace_members").insert([{ workspace_id: newWs.id, user_id: user.id, role: 'owner' }]);
          member = { workspace_id: newWs.id };
        }
      }

      const { data } = await supabase.from("expenses").select("*").eq("workspace_id", member?.workspace_id).order("expense_date", { ascending: false });
      setExpenses(data || []);
    } catch (err) {
      toast.error("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSave = async (payload: any) => {
    const res = await saveExpenseAction(payload);
    if (res.error) toast.error(res.error);
    else { toast.success("Expense saved."); setIsModalOpen(false); fetchExpenses(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    const res = await deleteExpenseAction(id);
    if (res.error) toast.error(res.error);
    else { toast.success("Expense deleted."); setExpenses(expenses.filter(e => e.id !== id)); }
  };

  const filtered = expenses.filter(e => {
    const matchesSearch = e.vendor.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (categoryFilter === "all" || e.category === categoryFilter);
  });
  const categories = Array.from(new Set(expenses.map((e) => e.category))).sort();
  const exportTaxCsv = () => {
    const header = ["Date", "Vendor", "Category", "Description", "Amount", "Currency", "Status", "Amount Paid"];
    const lines = [header, ...filtered.map((e) => [e.expense_date, e.vendor, e.category, e.description || "", e.amount, e.currency, e.payment_status, e.amount_paid])];
    const csv = lines.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const file = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "klyvor-expenses.csv";
    link.click();
  };

  const getStatusColor = (status: string) => {
    if (status === 'paid') return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30";
    if (status === 'partial') return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30";
    return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30";
  };

  if (loading) return <PageLoading />;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Business</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Expense Tracker</h1>
          <p className="text-[#C7D0E0]">Track business spending and stay in control of your costs.</p>
        </div>
        <Button onClick={() => { setEditingExpense(null); setIsModalOpen(true); }} className="bg-klyvor-gradient text-white h-11"><Plus size={18} className="mr-2"/> Add Expense</Button>
      </div>

      <ExpenseSummary expenses={expenses} />

      <div className="flex flex-col gap-3 bg-[#111A2E] p-3 rounded-xl border border-[#27344B] sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
          <Input placeholder="Search by vendor or category..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-[#0B1020] border-[#27344B] text-white h-10" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 rounded-md border border-[#27344B] bg-[#0B1020] px-3 text-sm text-white">
          <option value="all">All categories</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <Button type="button" onClick={exportTaxCsv} variant="outline" className="border-[#27344B] text-white">Export CSV</Button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-[#27344B] rounded-xl p-16 text-center bg-[#111A2E]/50">
            <p className="text-[#64748B]">No expenses recorded yet. Click "Add Expense" to start tracking.</p>
          </div>
        ) : filtered.map(exp => (
          <div key={exp.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#0B1020] border border-[#27344B] p-4 rounded-xl gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white font-bold">{exp.vendor}</h3>
                <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border", getStatusColor(exp.payment_status))}>{exp.payment_status}</span>
              </div>
              <p className="text-sm text-[#64748B]">{exp.category} • {formatDate(exp.expense_date, "UTC", "DD/MM/YYYY")}</p>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <p className="text-lg font-bold text-white">{new Intl.NumberFormat("en-US", { style: "currency", currency: exp.currency }).format(exp.amount)}</p>
                {exp.payment_status === 'partial' && <p className="text-xs text-[#22C55E]">{new Intl.NumberFormat("en-US", { style: "currency", currency: exp.currency }).format(exp.amount_paid)} paid</p>}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-[#C7D0E0] hover:text-white"><MoreHorizontal size={18} /></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#111A2E] border-[#27344B] text-white">
                  <DropdownMenuItem onClick={() => { setEditingExpense(exp); setIsModalOpen(true); }} className="cursor-pointer"><Edit size={14} className="mr-2" /> Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(exp.id)} className="cursor-pointer text-[#EF4444]"><Trash2 size={14} className="mr-2" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <ExpenseModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} editingExpense={editingExpense} onSave={handleSave} />
    </div>
  );
}
