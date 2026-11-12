"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, Building2, User, Mail, Phone, Globe, FolderKanban, ArrowRight, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Client {
  id: string;
  client_type: string;
  name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  status: string;
  notes: string | null;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  target_date: string | null;
}

export default function ClientDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const supabase = createClient();

  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientInvoices, setClientInvoices] = useState<any[]>([]);
  const [clientProposals, setClientProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchClientData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: clientData, error } = await supabase.from("clients").select("*").eq("id", id).single();
    if (error || !clientData) {
      toast.error("Client not found.");
      router.push("/dashboard/clients");
      return;
    }
    setClient(clientData);
    setEditName(clientData.name);
    setEditCompany(clientData.company_name || "");
    setEditEmail(clientData.email || "");
    setEditPhone(clientData.phone || "");
    setEditStatus(clientData.status);
    setEditNotes(clientData.notes || "");

    const { data: projectData } = await supabase.from("projects").select("*").eq("client_id", id).order("created_at", { ascending: false });
    setProjects(projectData || []);
    const { data: invoiceData } = await supabase.from("invoices").select("id, invoice_number, status, total_amount, currency, issue_date").eq("client_id", id).order("created_at", { ascending: false });
    setClientInvoices(invoiceData || []);
    const { data: proposalData } = await supabase.from("proposals").select("id, title, status, total_amount, currency").eq("client_id", id).order("created_at", { ascending: false });
    setClientProposals(proposalData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await supabase.from("clients").update({
      name: editName,
      company_name: editCompany || null,
      email: editEmail || null,
      phone: editPhone || null,
      status: editStatus,
      notes: editNotes || null
    }).eq("id", id);

    if (error) toast.error("Failed to update client.");
    else {
      toast.success("Client updated.");
      setIsEditOpen(false);
      fetchClientData();
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this client? Associated projects will not be deleted, but will become unassigned.")) return;
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) toast.error("Failed to delete client.");
    else {
      toast.success("Client deleted.");
      router.push("/dashboard/clients");
    }
  };

  const getStatusColor = (s: string) => {
    if (s === "active") return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30";
    if (s === "prospect") return "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30";
    if (s === "inactive") return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30";
    return "bg-[#27344B] text-[#C7D0E0] border-[#27344B]";
  };

  if (loading) return <div className="p-8 text-white flex items-center gap-2"><Loader2 className="animate-spin" /> Loading client...</div>;
  if (!client) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/dashboard/clients" className="text-sm text-[#64748B] hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} /> Back to Clients
        </Link>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditOpen(true)} variant="outline" className="border-[#27344B] text-white hover:bg-[#111A2E]">
            <Edit size={16} className="mr-2" /> Edit
          </Button>
          <Button onClick={handleDelete} variant="outline" className="border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10">
            <Trash2 size={16} className="mr-2" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Client Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#0B1020] border border-[#27344B] flex items-center justify-center mb-6">
              {client.client_type === "business" ? <Building2 size={32} className="text-secondary" /> : <User size={32} className="text-primary" />}
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-1">{client.name}</h1>
            {client.company_name && <p className="text-[#C7D0E0] mb-4">{client.company_name}</p>}
            
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider mb-6 ${getStatusColor(client.status)}`}>{client.status}</Badge>

            <div className="space-y-4 pt-6 border-t border-[#27344B]">
              {client.email && (
                <div className="flex items-center gap-3 text-sm text-[#C7D0E0]">
                  <Mail size={16} className="text-[#64748B] shrink-0" /> <a href={`mailto:${client.email}`} className="hover:text-primary transition-colors truncate">{client.email}</a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-3 text-sm text-[#C7D0E0]">
                  <Phone size={16} className="text-[#64748B] shrink-0" /> <span>{client.phone}</span>
                </div>
              )}
              {client.website && (
                <div className="flex items-center gap-3 text-sm text-[#C7D0E0]">
                  <Globe size={16} className="text-[#64748B] shrink-0" /> <a href={client.website} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">{client.website}</a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl">
            <h3 className="text-white font-semibold mb-4">Notes</h3>
            <p className="text-sm text-[#C7D0E0] whitespace-pre-wrap">{client.notes || "No notes added yet."}</p>
          </div>
        </div>

        {/* Right Column: Projects */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0B1020] border border-[#27344B] rounded-2xl p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderKanban size={20} className="text-primary" /> Associated Projects
              </h2>
              <Link href="/dashboard/projects" className="text-xs text-primary hover:text-white transition-colors">View All Projects →</Link>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-[#27344B] rounded-xl">
                <FolderKanban className="w-10 h-10 text-[#27344B] mx-auto mb-3" />
                <p className="text-[#64748B] text-sm">No projects linked to this client yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map(project => (
                  <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block bg-[#111A2E] border border-[#27344B] p-4 rounded-xl hover:border-primary/50 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold group-hover:text-primary transition-colors">{project.name}</h3>
                      <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${project.status === 'active' ? 'text-[#00D4FF] border-[#00D4FF]' : 'text-[#64748B] border-[#27344B]'}`}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xs text-[#64748B]">{project.target_date ? `Due ${formatDate(project.target_date, "UTC", "DD/MM/YYYY")}` : "No deadline"}</p>
                      <span className="text-primary text-xs font-semibold flex items-center gap-1">View <ArrowRight size={14} /></span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0B1020] border border-[#27344B] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Invoices</h2>
            {clientInvoices.length === 0 ? <p className="text-sm text-[#64748B]">No invoices for this client yet.</p> : (
              <div className="space-y-3">
                {clientInvoices.map((inv) => (
                  <Link key={inv.id} href="/dashboard/invoices" className="flex items-center justify-between rounded-xl border border-[#27344B] bg-[#111A2E] p-3 hover:border-primary/50">
                    <span className="text-sm font-semibold text-white">{inv.invoice_number}</span>
                    <span className="text-xs text-[#C7D0E0]">{inv.status} · {inv.currency} {Number(inv.total_amount || 0).toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            )}
            <h2 className="text-xl font-bold text-white mb-4 mt-8">Proposals</h2>
            {clientProposals.length === 0 ? <p className="text-sm text-[#64748B]">No proposals for this client yet.</p> : (
              <div className="space-y-3">
                {clientProposals.map((p) => (
                  <Link key={p.id} href="/dashboard/proposals" className="flex items-center justify-between rounded-xl border border-[#27344B] bg-[#111A2E] p-3 hover:border-primary/50">
                    <span className="text-sm font-semibold text-white">{p.title || "Untitled"}</span>
                    <span className="text-xs text-[#C7D0E0]">{p.status || "draft"}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Edit Client</DialogTitle><DialogDescription className="text-[#C7D0E0]">Update this client's information.</DialogDescription></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2"><Label>Client Name</Label><Input value={editName} onChange={e => setEditName(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" /></div>
            <div className="space-y-2"><Label>Company Name</Label><Input value={editCompany} onChange={e => setEditCompany(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" /></div>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={editStatus} onValueChange={(val) => setEditStatus(val as string)}>
                <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{editStatus === "prospect" ? "Prospect" : editStatus === "active" ? "Active" : "Inactive"}</SelectValue></SelectTrigger>
                <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                  <SelectItem value="prospect">Prospect</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary resize-none h-24" /></div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="text-[#C7D0E0] hover:text-white">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-klyvor-gradient text-white">{isSaving ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
