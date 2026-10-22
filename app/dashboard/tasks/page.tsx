"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Plus, Search, MoreHorizontal, Edit, Trash2, 
  CheckCircle2, Circle, Clock
} from "lucide-react";

type TaskStatus = "todo" | "in_progress" | "completed";
type TaskPriority = "low" | "medium" | "high" | "urgent";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
}

export default function TasksPage() {
  const supabase = createClient();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to view tasks.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("LOAD ERROR: " + error.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenCreate = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("medium");
    setDueDate("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.due_date || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication error.");
      setIsSubmitting(false);
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate || null,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    };

    if (editingTask) {
      const { error } = await supabase.from("tasks").update(taskData).eq("id", editingTask.id);
      if (error) toast.error("SAVE ERROR: " + error.message);
      else toast.success("Changes saved successfully.");
    } else {
      const { error } = await supabase.from("tasks").insert([{ ...taskData, user_id: user.id }]);
      if (error) toast.error("SAVE ERROR: " + error.message);
      else toast.success("Task created successfully.");
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    fetchTasks();
  };

  const handleToggleComplete = async (task: Task) => {
    const isCompleted = task.status === "completed";
    const newStatus = isCompleted ? "todo" : "completed";
    
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    const { error } = await supabase
      .from("tasks")
      .update({ 
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null
      })
      .eq("id", task.id);

    if (error) {
      toast.error("UPDATE ERROR: " + error.message);
      fetchTasks();
    } else {
      toast.success(isCompleted ? "Task reopened." : "Task marked as completed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      toast.error("DELETE ERROR: " + error.message);
    } else {
      toast.success("Task deleted.");
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === "urgent") return "bg-[#0B1020] text-[#EF4444] border-[#EF4444]";
    if (p === "high") return "bg-[#0B1020] text-[#F59E0B] border-[#F59E0B]";
    if (p === "medium") return "bg-[#0B1020] text-[#00D4FF] border-[#00D4FF]";
    return "bg-[#0B1020] text-[#C7D0E0] border-[#27344B]";
  };

  const getStatusLabel = (val: string) => {
    if (val === "all") return "All Statuses";
    if (val === "todo") return "To Do";
    if (val === "in_progress") return "In Progress";
    if (val === "completed") return "Completed";
    return "All Statuses";
  };

  const getPriorityLabel = (val: string) => {
    if (val === "all") return "All Priorities";
    if (val === "urgent") return "Urgent";
    if (val === "high") return "High";
    if (val === "medium") return "Medium";
    if (val === "low") return "Low";
    return "All Priorities";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Productivity</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Tasks</h1>
          <p className="text-[#C7D0E0]">Bring clarity to your workload. Organise priorities, manage deadlines, and keep your next steps within reach.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-klyvor-gradient text-white hover:opacity-90 font-semibold h-11 px-6 shrink-0">
          <Plus size={18} className="mr-2" /> New Task
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "All Tasks", value: tasks.length, icon: Circle, color: "text-white" },
          { label: "To Do", value: tasks.filter(t => t.status === "todo").length, icon: Circle, color: "text-[#C7D0E0]" },
          { label: "In Progress", value: tasks.filter(t => t.status === "in_progress").length, icon: Clock, color: "text-primary" },
          { label: "Completed", value: tasks.filter(t => t.status === "completed").length, icon: CheckCircle2, color: "text-success" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111A2E] border border-[#27344B] p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-[#C7D0E0] font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <stat.icon className={stat.color} size={24} />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-[#111A2E] p-3 rounded-xl border border-[#27344B]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
          <Input 
            placeholder="Search your tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#0B1020] border-[#27344B] text-white placeholder:text-[#64748B] h-10 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div className="flex gap-3">
          
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as string)}>
            <SelectTrigger className="w-[140px] bg-[#0B1020] border-[#27344B] text-white h-10">
              <SelectValue placeholder="Status">
                {getStatusLabel(statusFilter)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(val) => setPriorityFilter(val as string)}>
            <SelectTrigger className="w-[140px] bg-[#0B1020] border-[#27344B] text-white h-10">
              <SelectValue placeholder="Priority">
                {getPriorityLabel(priorityFilter)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-20 text-[#C7D0E0]">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="border border-dashed border-[#27344B] rounded-xl p-16 text-center bg-[#111A2E]/50">
            <CheckCircle2 className="w-12 h-12 text-[#C7D0E0] mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">A clearer workload starts here.</h3>
            <p className="text-sm text-[#C7D0E0] mb-6 max-w-md mx-auto">Create your first task to organise what needs to get done, set priorities, and keep track of deadlines.</p>
            <Button onClick={handleOpenCreate} className="bg-klyvor-gradient text-white hover:opacity-90">
              Create Your First Task
            </Button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="flex items-start sm:items-center gap-4 bg-[#0B1020] border border-[#27344B] p-4 rounded-xl hover:border-primary/30 transition-colors group">
              
              <Checkbox 
                checked={task.status === "completed"}
                onCheckedChange={() => handleToggleComplete(task)}
                className="mt-1 sm:mt-0 border-[#27344B] data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h3 className={`text-white font-medium truncate ${task.status === "completed" ? "line-through opacity-50" : ""}`}>
                    {task.title}
                  </h3>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                    {task.status === "in_progress" && (
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-[#0B1020] text-[#00D4FF] border-[#00D4FF]">
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>

                {task.description && (
                  <p className={`text-sm text-[#C7D0E0] truncate ${task.status === "completed" ? "opacity-50" : ""}`}>
                    {task.description}
                  </p>
                )}

                {task.due_date && (
                  <div className="flex items-center gap-1 text-xs text-[#F59E0B] mt-2">
                    <Clock size={12} />
                    <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="text-[#C7D0E0] hover:text-white outline-none h-8 w-8 flex items-center justify-center shrink-0">
                  <MoreHorizontal size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#111A2E] border-[#27344B] text-white">
                  <DropdownMenuItem onClick={() => handleOpenEdit(task)} className="cursor-pointer hover:bg-[#0B1020]">
                    <Edit size={14} className="mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(task.id)} className="cursor-pointer text-[#EF4444] hover:bg-[#EF4444]/10">
                    <Trash2 size={14} className="mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit task" : "Create a task"}</DialogTitle>
            <DialogDescription className="text-[#C7D0E0]">
              {editingTask ? "Update the details for this task." : "Capture what needs to be done and decide what matters most."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task title <span className="text-[#EF4444]">*</span></Label>
              <Input 
                id="title" 
                placeholder="What needs to get done?" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-[#00D4FF]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Add details, notes, or useful context..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-[#00D4FF] resize-none h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
                  <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
                  <SelectTrigger className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date (Optional)</Label>
              <Input 
                id="dueDate" 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-[#00D4FF] [color-scheme:dark]"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-[#C7D0E0] hover:text-white">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !title.trim()} className="bg-klyvor-gradient text-white">
                {isSubmitting ? "Saving..." : editingTask ? "Save Changes" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
