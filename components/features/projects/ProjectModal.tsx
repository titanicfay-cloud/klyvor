"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ProjectModal({ isModalOpen, setIsModalOpen, name, setName, description, setDescription, priority, setPriority, clientId, setClientId, clients, targetDate, setTargetDate, status, setStatus, handleCreate, isSubmitting }: any) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[550px]">
        <DialogHeader><DialogTitle>Create a Project</DialogTitle></DialogHeader>
        <form onSubmit={handleCreate} className="space-y-5 py-4">
          <div className="space-y-2"><Label>Project Name <span className="text-[#EF4444]">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Client</Label>
              <Select value={clientId} onValueChange={(val) => setClientId(val as string)}>
                <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{clientId === "none" ? "No Client" : clients.find((c: any) => c.id === clientId)?.name || "Select"}</SelectValue></SelectTrigger>
                <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="none">No Client</SelectItem>{clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Priority</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as string)}>
                <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{priority === 'low' ? 'Low' : priority === 'medium' ? 'Medium' : priority === 'high' ? 'High' : 'Urgent'}</SelectValue></SelectTrigger>
                <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white resize-none h-24" /></div>
          <div className="space-y-2"><Label>Target Completion</Label><Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white [color-scheme:dark]" /></div>
          <div className="space-y-2"><Label>Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as string)}>
              <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{status === 'planning' ? 'Planning' : status === 'active' ? 'Active' : status === 'on_hold' ? 'On Hold' : 'Completed'}</SelectValue></SelectTrigger>
              <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="planning">Planning</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="on_hold">On Hold</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4 border-t border-[#27344B]"><Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-[#C7D0E0]">Cancel</Button><Button type="submit" disabled={isSubmitting || !name.trim()} className="bg-klyvor-gradient text-white">{isSubmitting ? "Creating..." : "Create Project"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
