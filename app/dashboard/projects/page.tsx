"use client";
import { PageLoading, PageEmpty } from "@/components/ui/states";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import ProjectModal from "@/components/features/projects/ProjectModal";

export default function ProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [name, setName] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [status, setStatus] = useState("planning"); 
  const [priority, setPriority] = useState("medium"); 
  const [targetDate, setTargetDate] = useState(""); 
  const [clientId, setClientId] = useState("none");

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prefs } = await supabase.from("user_preferences").select("timezone, date_format").single();
    if (prefs) { setTimezone(prefs.timezone || "UTC"); setDateFormat(prefs.date_format || "DD/MM/YYYY"); }
    const { data: clientData } = await supabase.from("clients").select("id, name").order("name"); setClients(clientData || []);
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false }); setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const { error } = await supabase.from("projects").insert([{ user_id: user.id, name, description, status, priority, target_date: targetDate || null, client_id: clientId === "none" ? null : clientId }]);
    if (error) toast.error("Failed."); else { toast.success("Created."); setIsModalOpen(false); setName(""); setDescription(""); fetchData(); }
    setIsSubmitting(false);
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const getStatusColor = (s: string) => { if (s === "active") return "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30"; if (s === "planning") return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"; if (s === "completed") return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30"; return "bg-[#27344B] text-[#C7D0E0] border-[#27344B]"; };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div><span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Workspace</span><h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Project Planner</h1></div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-klyvor-gradient text-white font-semibold h-11 px-6"><Plus size={18} className="mr-2" /> New Project</Button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 bg-[#111A2E] p-3 rounded-xl border border-[#27344B]"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} /><Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-[#0B1020] border-[#27344B] text-white h-10" /></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <PageLoading /> : filteredProjects.length === 0 ? <div className="col-span-full text-center py-20 text-[#C7D0E0]">No projects found.</div> : filteredProjects.map(project => (
          <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="bg-[#0B1020] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4"><Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getStatusColor(project.status)}`}>{project.status}</Badge><Badge variant="outline" className="text-[10px] uppercase tracking-wider text-[#00D4FF] border-[#00D4FF]">{project.priority}</Badge></div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
            <p className="text-sm text-[#C7D0E0] line-clamp-3 mb-6 flex-grow">{project.description || "No description."}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#27344B]"><span className="text-xs text-[#64748B]">{project.target_date ? `Due ${formatDate(project.target_date, timezone, dateFormat)}` : "No deadline"}</span><span className="text-primary text-xs font-semibold flex items-center gap-1">View <ArrowRight size={14} /></span></div>
          </Link>
        ))}
      </div>
      <ProjectModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} name={name} setName={setName} description={description} setDescription={setDescription} priority={priority} setPriority={setPriority} clientId={clientId} setClientId={setClientId} clients={clients} targetDate={targetDate} setTargetDate={setTargetDate} status={status} setStatus={setStatus} handleCreate={handleCreate} isSubmitting={isSubmitting} />
    </div>
  );
}
