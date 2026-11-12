"use client";

export default function WeekSummary({ entries }: { entries: any[] }) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  const week = (entries || []).filter((entry) => new Date(entry.start_time) >= start);
  const seconds = week.reduce((sum, entry) => sum + Number(entry.duration_seconds || 0), 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-[#27344B] bg-[#111A2E] p-4">
        <p className="mb-1 text-xs text-[#C7D0E0]">Last 7 days</p>
        <p className="text-2xl font-bold text-white">{hours}h {minutes}m</p>
      </div>
      <div className="rounded-xl border border-[#27344B] bg-[#111A2E] p-4">
        <p className="mb-1 text-xs text-[#C7D0E0]">Sessions</p>
        <p className="text-2xl font-bold text-white">{week.length}</p>
      </div>
    </div>
  );
}
