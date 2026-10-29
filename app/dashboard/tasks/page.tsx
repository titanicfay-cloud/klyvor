"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, Circle, Clock, CheckCircle2 } from "lucide-react";
import TaskList from "@/components/features/tasks/TaskList";
import TaskModal from "@/components/features/tasks/TaskModal";

export default function TasksPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<any>("todo");
  const [priority, setPriority] = useState<any>("medium");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("none");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: prefs } = await supabase.from("user_preferences").select("timezone, date_format").single();
    if (prefs) { setTimezone(prefs.timezone || "UTC"); setDateFormat(prefs.date_format || "DD/MM/YYYY"); }
    const { data: projData } = await supabase.from("projects").select("id, name").order("name");
    setProjects(projData || []);
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch && (statusFilter === "all" || task.status === statusFilter) && (priorityFilter === "all" || task.priority === priorityFilter);
  });

  const handleOpenCreate = () => { setEditingTask(null); setTitle(""); setDescription(""); setStatus("todo"); setPriority("medium"); setDueDate(""); setProjectId("none"); setIsModalOpen(true); };
  const handleOpenEdit = (task: any) => { setEditingTask(task); setTitle(task.title); setDescription(task.description || ""); setStatus(task.status); setPriority(task.priority); setDueDate(task.due_date || ""); setProjectId(task.project_id || "none"); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const taskData = { title: title.trim(), description: description.trim() || null, status, priority, due_date: dueDate || null, project_id: projectId === "none" ? null : projectId, completed_at: status === "completed" ? new Date().toISOString() : null };
    if (editingTask) { const { error } = await supabase.from("tasks").update(taskData).eq("id", editingTask.id); if (error) toast.error("Error."); else toast.success("Updated."); }
    else { const { error } = await supabase.from("tasks").insert([{ ...taskData, user_id: user.id }]); if (error) toast.error("Error."); else toast.success("Created."); }
    setIsSubmitting(false); setIsModalOpen(false); fetchData();
  };

  const handleToggleComplete = async (task: any) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    await supabase.from("tasks").update({ status: newStatus, completed_at: newStatus === "completed" ? new Date().toISOString() : null }).eq("id", task.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: string) => { if (p === "urgent") return "bg-[#0B1020] text-[#EF4444] border-[#EF4444]"; if (p === "high") return "bg-[#0B1020] text-[#F59E0B] border-[#F59E0B]"; if (p === "medium") return "bg-[#0B1020] text-[#00D4FF] border-[#00D4FF]"; return "bg-[#0B1020] text-[#C7D0E0] border-[#27344B]"; };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div><span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Productivity</span><h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Tasks</h1></div>
        <Button onClick={handleOpenCreate} className="bg-klyvor-gradient text-white font-semibold h-11 px-6"><Plus size={18} className="mr-2" /> New Task</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: "All Tasks", value: tasks.length, icon: Circle, color: "text-white" },{ label: "To Do", value: tasks.filter(t => t.status === "todo").length, icon: Circle, color: "text-[#C7D0E0]" },{ label: "In Progress", value: tasks.filter(t => t.status === "in_progress").length, icon: Clock, color: "text-primary" },{ label: "Completed", value: tasks.filter(t => t.status === "completed").length, icon: CheckCircle2, color: "text-success" }].map((stat, i) => (
          <div key={i} className="bg-[#111A2E] border border-[#27344B] p-4 rounded-xl flex items-center justify-between"><div><p className="text-xs text-[#C7D0E0] font-medium mb-1">{stat.label}</p><p className="text-2xl font-bold text-white">{stat.value}</p></div><stat.icon className={stat.color} size={24} /></div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-3 bg-[#111A2E] p-3 rounded-xl border border-[#27344B]">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} /><Input placeholder="Search your tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-[#0B1020] border-[#27344B] text-white h-10" /></div>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as string)}><SelectTrigger className="w-[140px] bg-[#0B1020] border-[#27344B] text-white h-10"><SelectValue>{statusFilter === "all" ? "All Statuses" : statusFilter === "todo" ? "To Do" : statusFilter === "in_progress" ? "In Progress" : "Completed"}</SelectValue></SelectTrigger><SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="all">All Statuses</SelectItem><SelectItem value="todo">To Do</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
      </div>
      {loading ? <div className="text-center py-20 text-[#C7D0E0]">Loading...</div> : <TaskList tasks={filteredTasks} handleToggleComplete={handleToggleComplete} handleOpenEdit={handleOpenEdit} handleDelete={handleDelete} timezone={timezone} dateFormat={dateFormat} projects={projects} getPriorityColor={getPriorityColor} />}
      <TaskModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editingTask={editingTask} title={title} setTitle={setTitle} description={description} setDescription={setDescription} status={status} setStatus={setStatus} priority={priority} setPriority={setPriority} dueDate={dueDate} setDueDate={setDueDate} projectId={projectId} setProjectId={setProjectId} projects={projects} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
