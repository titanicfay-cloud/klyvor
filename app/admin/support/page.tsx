"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { 
  LifeBuoy, Search, Loader2, Mail, User, CheckCircle2, 
  Clock, ArrowRight, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminSupportInbox() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("support_requests").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to load tickets.");
    else setTickets(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTickets(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    const { error } = await supabase.from("support_requests").update({ status: newStatus }).eq("id", id);
    if (error) toast.error("Failed to update ticket status.");
    else {
      toast.success(`Ticket marked as ${newStatus}.`);
      setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
      if (selectedTicket?.id === id) setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
    setIsUpdating(false);
  };

  const getStatusColor = (status: string) => {
    if (status === "new") return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30";
    if (status === "in_progress") return "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30";
    if (status === "resolved") return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30";
    return "bg-[#27344B] text-[#C7D0E0] border-[#27344B]";
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">Support Inbox</h1>
        <p className="text-sm text-[#64748B]">Manage and respond to user inquiries across the platform.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
        <Input placeholder="Search by subject, name, or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-[#111A2E] border-[#27344B] text-white placeholder:text-[#64748B] h-10 focus-visible:ring-1 focus-visible:ring-primary" />
      </div>

      <div className="bg-[#111A2E] border border-[#27344B] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#64748B] flex justify-center items-center gap-2"><Loader2 className="animate-spin" size={18} /> Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-16 text-center">
            <LifeBuoy className="w-10 h-10 text-[#27344B] mx-auto mb-3" />
            <h3 className="text-white font-medium mb-1">No tickets found</h3>
          </div>
        ) : (
          <div className="divide-y divide-[#27344B]">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="p-4 hover:bg-[#0B1020] cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1020] border border-[#27344B] flex items-center justify-center shrink-0 mt-1 sm:mt-0">
                    <MessageSquare size={18} className="text-[#64748B] group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{ticket.subject}</h3>
                      <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getStatusColor(ticket.status)}`}>{ticket.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm text-[#64748B] line-clamp-1">{ticket.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1"><User size={12} /> {ticket.name}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center text-primary text-sm font-semibold shrink-0">View <ArrowRight size={16} className="ml-1" /></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[600px]">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status.replace("_", " ")}</Badge>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-[#27344B] text-[#C7D0E0]">{selectedTicket.topic}</Badge>
                </div>
                <DialogTitle className="text-xl">{selectedTicket.subject}</DialogTitle>
                <DialogDescription className="text-[#C7D0E0] flex items-center gap-2 mt-2">
                  <Mail size={14} /> <a href={`mailto:${selectedTicket.email}`} className="hover:text-primary transition-colors">{selectedTicket.email}</a>
                  <span className="text-[#64748B] mx-2">•</span>
                  <User size={14} /> {selectedTicket.name}
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 border-y border-[#27344B] my-4">
                <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{selectedTicket.message}</p>
              </div>

              {/* FIXED: Flex-wrap to prevent mobile overflow */}
              <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between items-center w-full">
                <span className="text-xs text-[#64748B] w-full sm:w-auto text-left">
                  Submitted {new Date(selectedTicket.created_at).toLocaleString()}
                </span>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <a href={`mailto:${selectedTicket.email}?subject=Re: ${selectedTicket.subject}`} className="w-full sm:w-auto">
                    <Button variant="outline" className="border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10 w-full">
                      <Mail size={16} className="mr-2" /> Reply
                    </Button>
                  </a>
                  {selectedTicket.status !== "resolved" ? (
                    <Button onClick={() => updateStatus(selectedTicket.id, "resolved")} disabled={isUpdating} className="bg-[#22C55E] text-white hover:bg-[#22C55E]/90 w-full">
                      <CheckCircle2 size={16} className="mr-2" /> Resolve
                    </Button>
                  ) : (
                    <Button onClick={() => setSelectedTicket(null)} className="bg-[#27344B] text-white hover:bg-[#334155] w-full">Close</Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
