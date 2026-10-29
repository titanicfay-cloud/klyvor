"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Clock, FolderKanban } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TaskList({ tasks, handleToggleComplete, handleOpenEdit, handleDelete, timezone, dateFormat, projects, getPriorityColor }: any) {
  const getProjectName = (id: string) => projects.find((p: any) => p.id === id)?.name;
  return (
    <div className="space-y-3">
      {tasks.map((task: any) => (
        <div key={task.id} className="flex items-start sm:items-center gap-4 bg-[#0B1020] border border-[#27344B] p-4 rounded-xl hover:border-primary/30 transition-colors group">
          <Checkbox checked={task.status === "completed"} onCheckedChange={() => handleToggleComplete(task)} className="mt-1 sm:mt-0 border-[#27344B] data-[state=checked]:bg-success data-[state=checked]:border-success" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h3 className={`text-white font-medium whitespace-pre-wrap break-words ${task.status === "completed" ? "line-through opacity-50" : ""}`}>{task.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                {task.status === "in_progress" && <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-[#0B1020] text-[#00D4FF] border-[#00D4FF]">In Progress</Badge>}
                {task.project_id && <Badge variant="outline" className="text-[10px] tracking-wider bg-[#7C5CFC]/10 text-[#7C5CFC] border-[#7C5CFC]/30 flex items-center gap-1"><FolderKanban size={10} /> {getProjectName(task.project_id)}</Badge>}
              </div>
            </div>
            {task.description && <p className="text-sm text-[#C7D0E0] whitespace-pre-wrap break-words">{task.description}</p>}
            {task.due_date && <div className="flex items-center gap-1 text-xs text-[#F59E0B] mt-2"><Clock size={12} /><span>Due {formatDate(task.due_date, timezone, dateFormat)}</span></div>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-[#C7D0E0] hover:text-white outline-none h-8 w-8 flex items-center justify-center shrink-0"><MoreHorizontal size={18} /></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#111A2E] border-[#27344B] text-white">
              <DropdownMenuItem onClick={() => handleOpenEdit(task)} className="cursor-pointer hover:bg-[#0B1020]"><Edit size={14} className="mr-2" /> Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(task.id)} className="cursor-pointer text-[#EF4444] hover:bg-[#EF4444]/10"><Trash2 size={14} className="mr-2" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
