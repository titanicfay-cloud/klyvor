"use client";
import { PageLoading } from "@/components/ui/states";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Plus, Printer, Save, ArrowLeft, Trash2, Loader2, Eye, Edit } from "lucide-react";
import InvoiceForm from "@/components/features/invoices/InvoiceForm";
import InvoicePreview from "@/components/features/invoices/InvoicePreview";
import { saveInvoiceAction } from "@/app/actions/invoices";
import { cn } from "@/lib/utils";

const emptyInvoice = {
  invoice_number: "",
  client_id: "none",
  project_id: "none",
  issue_date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: "draft",
  items: [{ description: "", quantity: 1, rate: 0 }],
  tax_rate: 0,
  discount_amount: 0,
  currency: "USD",
  notes: "Please pay within 14 days."
};

export default function InvoicesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeInvoice, setActiveInvoice] = useState<any>(null);
  
  const [data, setData] = useState<any>(emptyInvoice);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [invRes, clientRes, projRes] = await Promise.all([
        supabase.from("invoices").select("*").eq("created_by", user.id).order("created_at", { ascending: false }),
        supabase.from("clients").select("id, name").eq("user_id", user.id).order("name"),
        supabase.from("projects").select("id, name").eq("user_id", user.id).order("name")
      ]);

      setInvoices(invRes.data || []);
      setClients(clientRes.data || []);
      setProjects(projRes.data || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong loading your data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateNew = () => {
    setActiveInvoice({ isNew: true });
    setData(emptyInvoice);
    setIsMobilePreviewOpen(false);
  };

  const handleOpen = (inv: any) => {
    setActiveInvoice(inv);
    setData({
      ...inv,
      client_id: inv.client_id || "none",
      project_id: inv.project_id || "none",
      items: inv.items_json || []
    });
    setIsMobilePreviewOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      id: activeInvoice?.isNew ? null : activeInvoice?.id,
      ...data,
      client_id: data.client_id === "none" ? null : data.client_id,
      project_id: data.project_id === "none" ? null : data.project_id,
      items_json: data.items
    };
    
    const res = await saveInvoiceAction(payload);
    if (res.error) toast.error(res.error);
    else { 
      toast.success("Invoice saved."); 
      setActiveInvoice(null); 
      fetchData(); 
    }
    setIsSaving(false);
  };


  const handleRepeatNextMonth = async (invoice: any, event: React.MouseEvent) => {
    event.stopPropagation();
    const shift = (value: string) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      date.setMonth(date.getMonth() + 1);
      return date.toISOString().split("T")[0];
    };
    const res = await saveInvoiceAction({
      client_id: invoice.client_id,
      project_id: invoice.project_id,
      issue_date: shift(invoice.issue_date),
      due_date: shift(invoice.due_date || invoice.issue_date),
      status: "draft",
      items_json: invoice.items_json || [],
      tax_rate: invoice.tax_rate || 0,
      discount_amount: invoice.discount_amount || 0,
      currency: invoice.currency || "USD",
      notes: invoice.notes || null,
    });
    if (res.error) toast.error(res.error);
    else { toast.success("Next month's invoice created as a draft."); fetchData(); }
  };

  const handlePrint = () => { window.print(); };

  if (loading) return <PageLoading />;

  if (!activeInvoice) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Business</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Invoices</h1>
            <p className="text-[#C7D0E0]">Manage your billing, track payments, and send professional invoices.</p>
          </div>
          <Button onClick={handleCreateNew} className="bg-klyvor-gradient text-white h-11"><Plus size={18} className="mr-2"/> New Invoice</Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {invoices.length === 0 ? (
            <div className="border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50">
              <FileText className="w-10 h-10 text-[#64748B] mx-auto mb-4" />
              <h3 className="text-white font-medium">No invoices yet.</h3>
            </div>
          ) : invoices.map(inv => (
            <div key={inv.id} onClick={() => handleOpen(inv)} className="bg-[#0B1020] border border-[#27344B] p-4 rounded-xl hover:border-primary/50 cursor-pointer transition-all flex justify-between items-center group">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{inv.invoice_number}</h3>
                <p className="text-sm text-[#64748B]">{clients.find(c => c.id === inv.client_id)?.name || "No Client"}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-lg font-mono text-white">{new Intl.NumberFormat("en-US", { style: "currency", currency: inv.currency }).format(inv.total_amount)}</span>
                <span className={cn("text-xs font-bold uppercase px-2 py-1 rounded-full", inv.status === 'paid' ? 'bg-[#22C55E]/10 text-[#22C55E]' : inv.status === 'overdue' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#F59E0B]/10 text-[#F59E0B]')}>{inv.status}</span>
                <button type="button" onClick={(e) => handleRepeatNextMonth(inv, e)} className="text-xs font-semibold text-primary hover:text-white">Repeat next month</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500 relative">
      <div className="hidden lg:flex h-16 border-b border-[#27344B] items-center justify-between px-6 bg-[#111A2E]/50 shrink-0 no-print">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setActiveInvoice(null)} className="text-[#C7D0E0] hover:text-white"><ArrowLeft size={20} /></Button>
          <h2 className="text-white font-bold text-lg">{activeInvoice.isNew ? "New Invoice" : data.invoice_number}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handlePrint} variant="outline" className="border-[#27344B] text-white h-9"><Printer size={16} className="mr-2"/> Export PDF</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-klyvor-gradient text-white h-9">{isSaving ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16} className="mr-2"/> Save</>}</Button>
        </div>
      </div>

      <div className="lg:hidden flex flex-col bg-[#111A2E]/50 border-b border-[#27344B] shrink-0 no-print">
        <div className="flex items-center gap-2 p-2">
          <Button variant="ghost" onClick={() => setActiveInvoice(null)} className="text-[#C7D0E0] hover:text-white shrink-0 h-8 w-8 p-0"><ArrowLeft size={20} /></Button>
          <h2 className="text-white font-bold text-sm truncate">{activeInvoice.isNew ? "New Invoice" : data.invoice_number}</h2>
        </div>
        <div className="flex items-center gap-2 px-2 pb-2">
          <Button onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)} variant="outline" className="flex-1 border-[#27344B] text-white h-9 px-2 text-xs">
            {isMobilePreviewOpen ? <><Edit size={14} className="mr-1"/> Edit</> : <><Eye size={14} className="mr-1"/> Preview</>}
          </Button>
          <Select value={data.status} onValueChange={(val) => setData({...data, status: val})}>
            <SelectTrigger className="flex-1 bg-[#0B1020] border-[#27344B] text-white h-9 text-xs">
              <SelectValue>{data.status}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#0B1020] pb-16 lg:pb-0">
        <div className={cn("w-full lg:w-1/3 overflow-y-auto p-4 sm:p-6 border-r border-[#27344B] no-print", isMobilePreviewOpen && "hidden lg:block")}>
          <InvoiceForm data={data} setData={setData} clients={clients} projects={projects} />
        </div>

        <div className={cn("flex-1 overflow-y-auto p-2 sm:p-8 bg-[#1e293b] justify-center", isMobilePreviewOpen ? "flex" : "hidden lg:flex")}>
          <div className="resume-print-area w-full flex justify-center">
             <InvoicePreview data={data} clients={clients} />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#111A2E] border-t border-[#27344B] flex gap-2 z-50 no-print">
        <Button onClick={handlePrint} variant="outline" className="flex-1 border-[#27344B] text-white h-11">
          <Printer size={18} className="mr-2"/> Export PDF
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-klyvor-gradient text-white h-11">
          {isSaving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} className="mr-2"/> Save</>}
        </Button>
      </div>

    </div>
  );
}
