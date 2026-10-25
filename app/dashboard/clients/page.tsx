"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Search, Users, Building2, User, Mail, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Client {
  id: string;
  client_type: string;
  name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  updated_at: string;
}

export default function ClientsPage() {
  const supabase = createClient();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form State
  const [clientType, setClientType] = useState("individual");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("prospect");
  const [notes, setNotes] = useState("");

  const fetchClients = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Could not load clients.");
    else setClients(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("clients").insert([{
      user_id: user.id,
      client_type: clientType,
      name,
      company_name: companyName || null,
      email: email || null,
      phone: phone || null,
      status,
      notes: notes || null
    }]);

    if (error) toast.error("Failed to create client.");
    else {
      toast.success("Client added successfully.");
      setIsModalOpen(false);
      setName(""); setCompanyName(""); setEmail(""); setPhone(""); setNotes("");
      fetchClients();
    }
    setIsSubmitting(false);
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.company_name && c.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (s: string) => {
    if (s === "active") return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30";
    if (s === "prospect") return "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30";
    if (s === "inactive") return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30";
    return "bg-[#27344B] text-[#C7D0E0] border-[#27344B]";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Workspace</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Client Manager</h1>
          <p className="text-[#C7D0E0]">Every relationship, organised. Every project, connected.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-klyvor-gradient text-white hover:opacity-90 font-semibold h-11 px-6 shrink-0">
          <Plus size={18} className="mr-2" /> Add Client
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-[#111A2E] p-3 rounded-xl border border-[#27344B]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
          <Input placeholder="Search by name, company, or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-[#0B1020] border-[#27344B] text-white placeholder:text-[#64748B] h-10 focus-visible:ring-1 focus-visible:ring-primary" />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as string)}>
            <SelectTrigger className="w-[140px] bg-[#0B1020] border-[#27344B] text-white h-10">
              <SelectValue placeholder="Status">{statusFilter === "all" ? "All Statuses" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-[#C7D0E0]">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="col-span-full border border-dashed border-[#27344B] rounded-xl p-16 text-center bg-[#111A2E]/50">
            <Users className="w-12 h-12 text-[#C7D0E0] mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No clients found.</h3>
            <p className="text-sm text-[#C7D0E0] mb-6 max-w-md mx-auto">Add your first client to start tracking relationships and connecting them to your projects.</p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-klyvor-gradient text-white hover:opacity-90">Add First Client</Button>
          </div>
        ) : (
          filteredClients.map(client => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`} className="bg-[#0B1020] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#111A2E] border border-[#27344B] flex items-center justify-center shrink-0">
                  {client.client_type === "business" ? <Building2 size={20} className="text-secondary" /> : <User size={20} className="text-primary" />}
                </div>
                <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getStatusColor(client.status)}`}>{client.status}</Badge>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{client.name}</h3>
              {client.company_name && <p className="text-sm text-[#64748B] mb-4">{client.company_name}</p>}
              
              <div className="space-y-2 mt-auto pt-4 border-t border-[#27344B]">
                {client.email && <div className="flex items-center gap-2 text-xs text-[#C7D0E0]"><Mail size={12} className="text-[#64748B]" /> {client.email}</div>}
                {client.phone && <div className="flex items-center gap-2 text-xs text-[#C7D0E0]"><Phone size={12} className="text-[#64748B]" /> {client.phone}</div>}
              </div>
              
              <div className="flex items-center justify-end mt-4">
                <span className="text-primary text-xs font-semibold flex items-center gap-1">View Profile <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Add New Client</DialogTitle><DialogDescription className="text-[#C7D0E0]">Create a new record for an individual or business.</DialogDescription></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-4">
            
            <div className="flex bg-[#111A2E] p-1 rounded-lg border border-[#27344B]">
              <button type="button" onClick={() => setClientType("individual")} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${clientType === "individual" ? "bg-[#0B1020] text-primary shadow-sm" : "text-[#64748B] hover:text-white"}`}>Individual</button>
              <button type="button" onClick={() => setClientType("business")} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${clientType === "business" ? "bg-[#0B1020] text-secondary shadow-sm" : "text-[#64748B] hover:text-white"}`}>Business</button>
            </div>

            <div className="space-y-2"><Label>Client Name <span className="text-[#EF4444]">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Jane Doe" className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" /></div>
            {clientType === "business" && (
              <div className="space-y-2"><Label>Company Name</Label><Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Acme Corp" className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" /></div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" /></div>
            </div>

            <div className="space-y-2"><Label>Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as string)}>
                <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                  <SelectItem value="prospect">Prospect</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional context..." className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary resize-none h-20" /></div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-[#C7D0E0] hover:text-white">Cancel</Button>
              <Button type="submit" disabled={isSubmitting || !name.trim()} className="bg-klyvor-gradient text-white">{isSubmitting ? "Saving..." : "Save Client"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
