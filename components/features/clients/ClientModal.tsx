"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ClientModal({ isModalOpen, setIsModalOpen, clientType, setClientType, name, setName, companyName, setCompanyName, email, setEmail, phone, setPhone, status, setStatus, notes, setNotes, handleCreate, isSubmitting }: any) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4 py-4">
          <div className="flex bg-[#111A2E] p-1 rounded-lg border border-[#27344B]">
            <button type="button" onClick={() => setClientType("individual")} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${clientType === "individual" ? "bg-[#0B1020] text-primary shadow-sm" : "text-[#64748B] hover:text-white"}`}>Individual</button>
            <button type="button" onClick={() => setClientType("business")} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${clientType === "business" ? "bg-[#0B1020] text-secondary shadow-sm" : "text-[#64748B] hover:text-white"}`}>Business</button>
          </div>
          <div className="space-y-2"><Label>Client Name <span className="text-[#EF4444]">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white" /></div>
          {clientType === "business" && <div className="space-y-2"><Label>Company Name</Label><Input value={companyName} onChange={e => setCompanyName(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" /></div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white" /></div>
          </div>
          <div className="space-y-2"><Label>Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as string)}>
              <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{status === "prospect" ? "Prospect" : status === "active" ? "Active" : "Inactive"}</SelectValue></SelectTrigger>
              <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="prospect">Prospect</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white resize-none h-20" /></div>
          <DialogFooter className="pt-4"><Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-[#C7D0E0]">Cancel</Button><Button type="submit" disabled={isSubmitting || !name.trim()} className="bg-klyvor-gradient text-white">{isSubmitting ? "Saving..." : "Save Client"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
