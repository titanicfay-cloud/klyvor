"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, CheckSquare, FileText, Calendar, Clock, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProjectDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const supabase = createClient();

  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Preferences
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchProjectData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Preferences
    const { data: prefs } = await supabase.from("user_preferences").select("timezone, date_format").single();
    if (prefs) {
      setTimezone(prefs.timezone || "UTC");
      setDateFormat(prefs.date_format || "DD/MM/YYYY");
    }

    // Fetch Project
    const { data: proj, error } = await supabase.from("projects").select("*").eq("id", id).single();
    if (error || !proj) {
      toast.error("Project not found or access denied.");
      router.push("/dashboard/projects");
      return;
    }
    setProject(proj);
    setEditName(proj.name);
    setEditDesc(proj.description || "");
    setEditStatus(proj.status);
    setEditPriority(proj.priority);

    // Fetch Associated Tasks
    const { data: taskData } = await supabase.from("tasks").select("*").eq("project_id", id).order("created_at", { ascending: false });
    setTasks(taskData || []);

    // Fetch Associated Documents
    const { data: docData } = await supabase.from("documents").select("*").eq("project_id", id).order("updated_at", { ascending: false });
    setDocuments(docData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await supabase.from("projects").update({
      name: editName,
      description: editDesc,
      status: editStatus,
      priority: editPriority
    }).eq("id", id);

    if (error) toast.error("Failed to update project.");
    else {
      toast.success("Project updated successfully.");
      setIsEditOpen(false);
      fetchProjectData();
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? Associated tasks and documents will be unlinked, but not deleted.")) return;
    
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error("Failed to delete project.");
    else {
      toast.success("Project deleted.");
      router.push("/dashboard/projects");
    }
  };

  const getStatusColor = (s: string) => {
    if (s === "active") return "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30";
    if (s === "planning") return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30";
    if (s === "completed") return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30";
    return "bg-[#27344B] text-[#C7D0E0] border-[#27344B]";
  };

  if (loading) return <div className="p-8 text-white flex items-center gap-2"><Loader2 className="animate-spin" /> Loading project...</div>;
  if (!project) return null;

  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/dashboard/projects" className="text-sm text-[#64748B] hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} /> Back to Projects
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

      {/* Project Header */}
      <div className="bg-[#111A2E] border border-[#27344B] p-6 sm:p-10 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getStatusColor(project.status)}`}>
              {project.status === 'on_hold' ? 'On Hold' : project.status}
            </Badge>
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${project.priority === 'urgent' ? 'text-[#EF4444] border-[#EF4444]' : project.priority === 'high' ? 'text-[#F59E0B] border-[#F59E0B]' : 'text-[#00D4FF] border-[#00D4FF]'}`}>
              {project.priority}
            </Badge>
            {project.category && <span className="text-xs text-[#64748B] bg-[#0B1020] px-2 py-1 rounded-md border border-[#27344B]">{project.category}</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{project.name}</h1>
          <p className="text-[#C7D0E0] max-w-3xl leading-relaxed whitespace-pre-wrap">{project.description || "No description provided."}</p>
          
          <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-[#27344B]">
            {project.start_date && (
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <Calendar size={16} /> Start: {formatDate(project.start_date, timezone, dateFormat)}
              </div>
            )}
            {project.target_date && (
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <Clock size={16} /> Target: {formatDate(project.target_date, timezone, dateFormat)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-[#0B1020] border border-[#27344B] p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Project Progress</h3>
        {totalTasks === 0 ? (
          <p className="text-sm text-[#64748B]">No tasks assigned to this project yet. Add tasks in the Task Manager to track progress.</p>
        ) : (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#C7D0E0]">{completedTasks} of {totalTasks} tasks completed</span>
              <span className="text-white font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#111A2E] rounded-full h-3">
              <div className="bg-klyvor-gradient h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Tasks & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Associated Tasks */}
        <div className="bg-[#111A2E] border border-[#27344B] rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><CheckSquare size={18} className="text-primary" /> Tasks</h3>
            <Link href="/dashboard/tasks" className="text-xs text-primary hover:text-white transition-colors">Manage Tasks →</Link>
          </div>
          <div className="space-y-3 flex-grow">
            {tasks.length === 0 ? (
              <p className="text-sm text-[#64748B] text-center py-8">No tasks linked to this project.</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="bg-[#0B1020] border border-[#27344B] p-3 rounded-lg flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-success' : task.status === 'in_progress' ? 'bg-primary' : 'bg-[#64748B]'}`} />
                  <span className={`text-sm flex-grow ${task.status === 'completed' ? 'line-through text-[#64748B]' : 'text-white'}`}>{task.title}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Associated Documents */}
        <div className="bg-[#111A2E] border border-[#27344B] rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><FileText size={18} className="text-secondary" /> Documents</h3>
            <Link href="/dashboard/documents" className="text-xs text-secondary hover:text-white transition-colors">Manage Documents →</Link>
          </div>
          <div className="space-y-3 flex-grow">
            {documents.length === 0 ? (
              <p className="text-sm text-[#64748B] text-center py-8">No documents linked to this project.</p>
            ) : (
              documents.map(doc => (
                <div key={doc.id} className="bg-[#0B1020] border border-[#27344B] p-3 rounded-lg flex items-center gap-3">
                  <FileText size={16} className="text-[#64748B]" />
                  <span className="text-sm text-white truncate">{doc.title || "Untitled Document"}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Edit Project</DialogTitle><DialogDescription className="text-[#C7D0E0]">Update the details for this project.</DialogDescription></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2"><Label>Project Name</Label><Input value={editName} onChange={e => setEditName(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-[#00D4FF]" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-[#00D4FF] resize-none h-24" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Status</Label>
                <Select value={editStatus} onValueChange={(val) => setEditStatus(val as string)}>
                  <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectValue>{editStatus === 'planning' ? 'Planning' : editStatus === 'active' ? 'Active' : editStatus === 'on_hold' ? 'On Hold' : 'Completed'}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="planning">Planning</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="on_hold">On Hold</SelectItem><SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Priority</Label>
                <Select value={editPriority} onValueChange={(val) => setEditPriority(val as string)}>
                  <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectValue>{editPriority === 'low' ? 'Low' : editPriority === 'medium' ? 'Medium' : editPriority === 'high' ? 'High' : 'Urgent'}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
