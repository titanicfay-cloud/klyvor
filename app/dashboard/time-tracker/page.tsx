"use client";
import { PageLoading } from "@/components/ui/states";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import WeekSummary from "@/components/features/timetracker/WeekSummary";
import { Loader2 } from "lucide-react";
import ActiveTimer from "@/components/features/timetracker/ActiveTimer";
import TimeEntryList from "@/components/features/timetracker/TimeEntryList";

export default function TimeTrackerPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [activeEntry, setActiveEntry] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: prefs } = await supabase.from("user_preferences").select("timezone, date_format").single();
    if (prefs) { setTimezone(prefs.timezone || "UTC"); setDateFormat(prefs.date_format || "DD/MM/YYYY"); }

    const { data: projData } = await supabase.from("projects").select("id, name").order("name");
    setProjects(projData || []);

    const { data: activeData } = await supabase.from("time_entries").select("*").eq("user_id", user.id).is("end_time", null).single();
    setActiveEntry(activeData || null);

    const { data: entryData } = await supabase.from("time_entries").select("*").eq("user_id", user.id).not("end_time", "is", null).order("start_time", { ascending: false }).limit(20);
    setEntries(entryData || []);

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this time entry?")) return;
    const { error } = await supabase.from("time_entries").delete().eq("id", id);
    if (!error) setEntries(entries.filter(e => e.id !== id));
    else toast.error("Failed to delete.");
  };

  if (loading) return <PageLoading />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Productivity</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Time Tracker</h1>
        <p className="text-[#C7D0E0]">Track your billable hours and see exactly where your time goes.</p>
      </div>

      <ActiveTimer activeEntry={activeEntry} projects={projects} onRefresh={fetchData} />

      <WeekSummary entries={entries} />

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Entries</h2>
        <TimeEntryList entries={entries} projects={projects} handleDelete={handleDelete} timezone={timezone} dateFormat={dateFormat} />
      </div>
    </div>
  );
}
