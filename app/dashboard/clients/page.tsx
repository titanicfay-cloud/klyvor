"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Search, Building2, User, Mail, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import ClientModal from "@/components/features/clients/ClientModal";

export default function ClientsPage() {
  const supabase = createClient();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientType, setClientType] = useState("individual"); 
  const [name, setName] = useState(""); 
  const [companyName, setCompanyName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [status, setStatus] = useState("prospect"); 
  const [notes, setNotes] = useState("");

  const fetchClients = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false }); setClients(data || []); setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const { error } = await supabase.from("clients").insert([{ user_id: user.id, client_type: clientType, name, company_name: companyName || null, email: email || null, phone: phone || null, status, notes: notes || null }]);
    if (error) toast.error("Failed."); else { toast.success("Created."); setIsModalOpen(false); setName(""); fetchClients(); }
    setIsSubmitting(false);
  };

  const filteredClients = clients.filter(c => { const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.company_name && c.company_name.toLowerCase().includes(searchQuery.toLowerCase())); return matchesSearch && (statusFilter === "all" || c.status === statusFilter); });
  const getStatusColor = (s: string) => { if (s === "active") return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30"; if (s === "prospect") return "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30"; return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"; };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div><span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Workspace</span><h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Client Manager</h1></div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-klyvor-gradient text-white font-semibold h-11 px-6"><Plus size={18} className="mr-2" /> Add Client</Button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 bg-[#111A2E] p-3 rounded-xl border border-[#27344B]"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-[#0B1020] border-[#27344B] text-white h-10" /></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <div className="col-span-full text-center py-20 text-[#C7D0E0]">Loading...</div> : filteredClients.length === 0 ? <div className="col-span-full text-center py-20 text-[#C7D0E0]">No clients found.</div> : filteredClients.map(client => (
          <Link key={client.id} href={`/dashboard/clients/${client.id}`} className="bg-[#0B1020] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4"><div className="w-10 h-10 rounded-lg bg-[#111A2E] border border-[#27344B] flex items-center justify-center shrink-0">{client.client_type === "business" ? <Building2 size={20} className="text-secondary" /> : <User size={20} className="text-primary" />}</div><Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getStatusColor(client.status)}`}>{client.status}</Badge></div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{client.name}</h3>
            <div className="space-y-2 mt-auto pt-4 border-t border-[#27344B]">{client.email && <div className="flex items-center gap-2 text-xs text-[#C7D0E0]"><Mail size={12} className="text-[#64748B]" /> {client.email}</div>}{client.phone && <div className="flex items-center gap-2 text-xs text-[#C7D0E0]"><Phone size={12} className="text-[#64748B]" /> {client.phone}</div>}</div>
            <div className="flex items-center justify-end mt-4"><span className="text-primary text-xs font-semibold flex items-center gap-1">View Profile <ArrowRight size={14} /></span></div>
          </Link>
        ))}
      </div>
      <ClientModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} clientType={clientType} setClientType={setClientType} name={name} setName={setName} companyName={companyName} setCompanyName={setCompanyName} email={email} setEmail={setEmail} phone={phone} setPhone={setPhone} status={status} setStatus={setStatus} notes={notes} setNotes={setNotes} handleCreate={handleCreate} isSubmitting={isSubmitting} />
    </div>
  );
}
