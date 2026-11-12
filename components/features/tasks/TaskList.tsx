"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Clock, FolderKanban } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TaskList({ tasks, handleToggleComplete, handleOpenEdit, handleDelete, timezone, dateFormat, projects, getPriorityColor, onBulkComplete, onBulkDelete, onBulkStatus }: any) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const clear = () => setSelected([]);
  const getProjectName = (id: string) => projects.find((p: any) => p.id === id)?.name;

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#27344B] bg-[#111A2E] p-3">
          <span className="mr-2 text-sm text-white">{selected.length} selected</span>
          <button type="button" onClick={() => { onBulkComplete?.(selected); clear(); }} className="rounded-lg border border-[#22C55E]/40 px-3 py-1.5 text-xs font-semibold text-[#22C55E]">Complete</button>
          <button type="button" onClick={() => { onBulkStatus?.(selected, "in_progress"); clear(); }} className="rounded-lg border border-[#00D4FF]/40 px-3 py-1.5 text-xs font-semibold text-[#00D4FF]">In progress</button>
          <button type="button" onClick={() => { onBulkStatus?.(selected, "todo"); clear(); }} className="rounded-lg border border-[#27344B] px-3 py-1.5 text-xs font-semibold text-[#C7D0E0]">To do</button>
          <button type="button" onClick={() => { onBulkDelete?.(selected); clear(); }} className="rounded-lg border border-[#EF4444]/40 px-3 py-1.5 text-xs font-semibold text-[#EF4444]">Delete</button>
        </div>
      )}
      {tasks.length === 0 && <div className="rounded-xl border border-dashed border-[#27344B] bg-[#111A2E]/50 p-10 text-center text-sm text-[#64748B]">No tasks match this view.</div>}
      {tasks.map((task: any) => (
        <div key={task.id} className="group flex items-start gap-4 rounded-xl border border-[#27344B] bg-[#0B1020] p-4 transition-colors hover:border-primary/30 sm:items-center">
          <Checkbox checked={selected.includes(task.id)} onCheckedChange={() => toggle(task.id)} className="mt-1 border-[#27344B] sm:mt-0" />
          <Checkbox checked={task.status === "completed"} onCheckedChange={() => handleToggleComplete(task)} className="mt-1 border-[#27344B] data-[state=checked]:border-success data-[state=checked]:bg-success sm:mt-0" />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center">
              <h3 className={`whitespace-pre-wrap break-words font-medium text-white ${task.status === "completed" ? "line-through opacity-50" : ""}`}>{task.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                {task.status === "in_progress" && <Badge variant="outline" className="border-[#00D4FF] bg-[#0B1020] text-[10px] uppercase tracking-wider text-[#00D4FF]">In Progress</Badge>}
                {task.project_id && <Badge variant="outline" className="flex items-center gap-1 border-[#7C5CFC]/30 bg-[#7C5CFC]/10 text-[10px] tracking-wider text-[#7C5CFC]"><FolderKanban size={10} /> {getProjectName(task.project_id)}</Badge>}
              </div>
            </div>
            {task.description && <p className="whitespace-pre-wrap break-words text-sm text-[#C7D0E0]">{task.description}</p>}
            {task.due_date && <div className="mt-2 flex items-center gap-1 text-xs text-[#F59E0B]"><Clock size={12} /><span>Due {formatDate(task.due_date, timezone, dateFormat)}</span></div>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 shrink-0 items-center justify-center text-[#C7D0E0] outline-none hover:text-white"><MoreHorizontal size={18} /></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-[#27344B] bg-[#111A2E] text-white">
              <DropdownMenuItem onClick={() => handleOpenEdit(task)} className="cursor-pointer hover:bg-[#0B1020]"><Edit size={14} className="mr-2" /> Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(task.id)} className="cursor-pointer text-[#EF4444] hover:bg-[#EF4444]/10"><Trash2 size={14} className="mr-2" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
