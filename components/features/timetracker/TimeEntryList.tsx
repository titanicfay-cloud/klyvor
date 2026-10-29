"use client";
import { Clock, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TimeEntryList({ entries, projects, handleDelete, timezone, dateFormat }: any) {
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (entries.length === 0) {
    return (
      <div className="border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50 text-[#64748B]">
        No time entries yet. Start the timer above to log your first session.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry: any) => (
        <div key={entry.id} className="flex items-center justify-between bg-[#0B1020] border border-[#27344B] p-4 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#111A2E] border border-[#27344B] flex items-center justify-center text-primary">
              <Clock size={18} />
            </div>
            <div>
              <h3 className="text-white font-medium">{entry.description}</h3>
              <p className="text-xs text-[#64748B]">{formatDate(entry.start_time, timezone, dateFormat)} · {projects.find((p: any) => p.id === entry.project_id)?.name || "No Project"}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xl font-mono font-bold text-primary">{formatTime(entry.duration_seconds)}</span>
            <button onClick={() => handleDelete(entry.id)} className="text-[#64748B] hover:text-[#EF4444] transition-colors"><Trash2 size={18} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
