"use client";
import { useEffect, useState } from "react";

function inLast7Days(value: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  return new Date(value) >= start;
}

export default function WeekSummary({ entries, activeEntry }: { entries: any[]; activeEntry?: any }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const saved = (entries || []).filter((entry) => entry?.start_time && inLast7Days(entry.start_time) && entry.id !== activeEntry?.id);
  let seconds = saved.reduce((sum, entry) => sum + Number(entry.duration_seconds || 0), 0);

  if (activeEntry?.start_time && inLast7Days(activeEntry.start_time)) {
    seconds += Math.max(0, Math.floor((now - new Date(activeEntry.start_time).getTime()) / 1000));
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sessionCount = saved.length + (activeEntry?.start_time && inLast7Days(activeEntry.start_time) ? 1 : 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-[#27344B] bg-[#111A2E] p-4">
        <p className="mb-1 text-xs text-[#C7D0E0]">Last 7 days</p>
        <p className="text-2xl font-bold text-white">{hours}h {minutes}m</p>
      </div>
      <div className="rounded-xl border border-[#27344B] bg-[#111A2E] p-4">
        <p className="mb-1 text-xs text-[#C7D0E0]">Sessions</p>
        <p className="text-2xl font-bold text-white">{sessionCount}</p>
      </div>
    </div>
  );
}
