"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function TaskModal({ isModalOpen, setIsModalOpen, editingTask, title, setTitle, description, setDescription, status, setStatus, priority, setPriority, dueDate, setDueDate, projectId, setProjectId, projects, handleSubmit, isSubmitting }: any) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[500px]">
        <DialogHeader><DialogTitle>{editingTask ? "Edit task" : "Create a task"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2"><Label>Task title <span className="text-[#EF4444]">*</span></Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white" /></div>
          <div className="space-y-2"><Label>Project (Optional)</Label>
            <Select value={projectId} onValueChange={(val) => setProjectId(val as string)}>
              <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{projectId === "none" ? "No Project" : projects.find((p: any) => p.id === projectId)?.name || "Select"}</SelectValue></SelectTrigger>
              <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="none">No Project</SelectItem>{projects.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white resize-none h-24" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as any)}><SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{status === "todo" ? "To Do" : status === "in_progress" ? "In Progress" : "Completed"}</SelectValue></SelectTrigger><SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="todo">To Do</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Priority</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as any)}><SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue>{priority === "low" ? "Low" : priority === "medium" ? "Medium" : priority === "high" ? "High" : "Urgent"}</SelectValue></SelectTrigger><SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Due date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white [color-scheme:dark]" /></div>
          <DialogFooter className="pt-4"><Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-[#C7D0E0]">Cancel</Button><Button type="submit" disabled={isSubmitting || !title.trim()} className="bg-klyvor-gradient text-white">{isSubmitting ? "Saving..." : editingTask ? "Save Changes" : "Create Task"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
