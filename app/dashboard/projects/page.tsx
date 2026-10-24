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
import { Plus, Search, FolderKanban, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  target_date: string | null;
}

export default function ProjectsPage() {
  const supabase = createClient();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // User Prefs
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");
  const [priority, setPriority] = useState("medium");
  const [targetDate, setTargetDate] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: prefs } = await supabase.from("user_preferences").select("timezone, date_format").single();
    if (prefs) {
      setTimezone(prefs.timezone || "UTC");
      setDateFormat(prefs.date_format || "DD/MM/YYYY");
    }

    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Could not load projects.");
    else setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("projects").insert([{
      user_id: user.id,
      name,
      description,
      status,
      priority,
      target_date: targetDate || null
    }]);

    if (error) toast.error("Failed to create project.");
    else {
      toast.success("Project created successfully.");
      setIsModalOpen(false);
      setName(""); setDescription(""); setTargetDate("");
      fetchData();
    }
    setIsSubmitting(false);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (s: string) => {
    if (s === "active") return "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30";
    if (s === "planning") return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30";
    if (s === "completed") return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30";
    return "bg-[#27344B] text-[#C7D0E0] border-[#27344B]";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Workspace</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Project Planner</h1>
          <p className="text-[#C7D0E0]">Structure your work, manage milestones, and keep complex projects moving forward.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-klyvor-gradient text-white hover:opacity-90 font-semibold h-11 px-6 shrink-0">
          <Plus size={18} className="mr-2" /> New Project
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-[#111A2E] p-3 rounded-xl border border-[#27344B]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
          <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-[#0B1020] border-[#27344B] text-white placeholder:text-[#64748B] h-10 focus-visible:ring-1 focus-visible:ring-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-[#C7D0E0]">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full border border-dashed border-[#27344B] rounded-xl p-16 text-center bg-[#111A2E]/50">
            <FolderKanban className="w-12 h-12 text-[#C7D0E0] mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No projects found.</h3>
            <p className="text-sm text-[#C7D0E0] mb-6 max-w-md mx-auto">Create your first project to start organising tasks and documents into a structured workflow.</p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-klyvor-gradient text-white hover:opacity-90">Create First Project</Button>
          </div>
        ) : (
          filteredProjects.map(project => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="bg-[#0B1020] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getStatusColor(project.status)}`}>{project.status.replace("_", " ")}</Badge>
                <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${project.priority === 'urgent' ? 'text-[#EF4444] border-[#EF4444]' : project.priority === 'high' ? 'text-[#F59E0B] border-[#F59E0B]' : 'text-[#00D4FF] border-[#00D4FF]'}`}>{project.priority}</Badge>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
              <p className="text-sm text-[#C7D0E0] line-clamp-3 mb-6 flex-grow">{project.description || "No description provided."}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#27344B]">
                <span className="text-xs text-[#64748B]">{project.target_date ? `Due ${formatDate(project.target_date, timezone, dateFormat)}` : "No deadline"}</span>
                <span className="text-primary text-xs font-semibold flex items-center gap-1">View <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Create a Project</DialogTitle><DialogDescription className="text-[#C7D0E0]">Start organising your work into a structured project.</DialogDescription></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-4">
            <div className="space-y-2"><Label>Project Name <span className="text-[#EF4444]">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-[#00D4FF]" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-[#00D4FF] resize-none h-24" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as string)}>
                  <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="planning">Planning</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="on_hold">On Hold</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Priority</Label>
                <Select value={priority} onValueChange={(val) => setPriority(val as string)}>
                  <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Target Completion Date</Label><Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-[#00D4FF] [color-scheme:dark]" /></div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-[#C7D0E0] hover:text-white">Cancel</Button>
              <Button type="submit" disabled={isSubmitting || !name.trim()} className="bg-klyvor-gradient text-white">{isSubmitting ? "Creating..." : "Create Project"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
