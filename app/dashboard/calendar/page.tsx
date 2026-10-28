"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  CheckSquare, FolderKanban, Loader2 
} from "lucide-react";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isToday, parseISO 
} from "date-fns";

interface Task {
  id: string;
  title: string;
  due_date: string;
  status: string;
}

interface Project {
  id: string;
  name: string;
  target_date: string;
  status: string;
}

export default function CalendarPage() {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [taskRes, projRes] = await Promise.all([
        supabase.from("tasks").select("id, title, due_date, status").not("due_date", "is", null),
        supabase.from("projects").select("id, name, target_date, status").not("target_date", "is", null)
      ]);

      if (taskRes.data) setTasks(taskRes.data);
      if (projRes.data) setProjects(projRes.data);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayTasks = tasks.filter(t => t.due_date === dayStr);
    const dayProjects = projects.filter(p => p.target_date === dayStr);
    return { tasks: dayTasks, projects: dayProjects };
  };

  // Mobile upcoming agenda
  const upcomingEvents = [
    ...tasks.map(t => ({ ...t, type: 'task', date: t.due_date, title: t.title })),
    ...projects.map(p => ({ ...p, type: 'project', date: p.target_date, title: p.name }))
  ]
    .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  if (loading) return <div className="p-8 text-white flex items-center gap-2"><Loader2 className="animate-spin" /> Loading calendar...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Productivity</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Calendar & Deadlines</h1>
          <p className="text-[#C7D0E0]">Keep all your task deadlines and project milestones in one view.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#111A2E] p-1 rounded-lg border border-[#27344B]">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 text-white hover:bg-[#0B1020]"><ChevronLeft size={18} /></Button>
          <span className="text-white font-semibold px-4 w-[140px] text-center">{format(currentDate, "MMMM yyyy")}</span>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-white hover:bg-[#0B1020]"><ChevronRight size={18} /></Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
         <Button onClick={goToToday} variant="outline" className="border-[#27344B] text-white hover:bg-[#111A2E]">Today</Button>
      </div>

      {/* DESKTOP CALENDAR */}
      <div className="hidden md:block bg-[#111A2E] border border-[#27344B] rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-[#27344B] bg-[#0B1020]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-start-${i}`} className="border-b border-r border-[#27344B] bg-[#0B1020]/50 p-2"></div>
          ))}
          
          {daysInMonth.map((day) => {
            const events = getEventsForDay(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div key={day.toString()} className={`border-b border-r border-[#27344B] p-2 transition-colors hover:bg-[#0B1020] ${isCurrentDay ? 'bg-primary/5' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isCurrentDay ? 'bg-primary text-[#0B1020]' : 'text-[#C7D0E0]'}`}>
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[80px] hide-scrollbar">
                  {events.projects.map(p => (
                    <div key={p.id} className="text-[10px] bg-[#111A2E] text-[#7C5CFC] border border-[#7C5CFC] px-1.5 py-0.5 rounded truncate flex items-center gap-1">
                      <FolderKanban size={10} /> {p.name}
                    </div>
                  ))}
                  {events.tasks.map(t => (
                    <div key={t.id} className={`text-[10px] border px-1.5 py-0.5 rounded truncate flex items-center gap-1 ${t.status === 'completed' ? 'bg-[#0B1020] text-[#22C55E] border-[#22C55E] line-through' : 'bg-[#0B1020] text-[#00D4FF] border-[#00D4FF]'}`}>
                      <CheckSquare size={10} /> {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {Array.from({ length: 6 - monthEnd.getDay() }).map((_, i) => (
            <div key={`empty-end-${i}`} className="border-b border-r border-[#27344B] bg-[#0B1020]/50 p-2"></div>
          ))}
        </div>
      </div>

      {/* MOBILE AGENDA */}
      <div className="md:hidden space-y-4">
        <div className="bg-[#111A2E] border border-[#27344B] rounded-xl p-4">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2"><CalendarIcon size={18} className="text-primary"/> Upcoming Agenda</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-[#64748B] text-center py-4">No upcoming deadlines.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#0B1020] border border-[#27344B] rounded-lg">
                  <div className="w-10 text-center shrink-0">
                    <p className="text-xs text-[#64748B] uppercase">{format(parseISO(event.date), "MMM")}</p>
                    <p className="text-lg font-bold text-white leading-tight">{format(parseISO(event.date), "dd")}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {event.type === 'project' ? <FolderKanban size={12} className="text-[#7C5CFC]" /> : <CheckSquare size={12} className="text-[#00D4FF]" />}
                      <span className="text-xs font-semibold text-[#64748B] uppercase">{event.type}</span>
                    </div>
                    <p className="text-sm text-white font-medium truncate">{event.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
