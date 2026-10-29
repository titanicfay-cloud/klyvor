"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Square, Loader2 } from "lucide-react";
import { startTimerAction, stopTimerAction } from "@/app/actions/time-tracking";
import { toast } from "sonner";

export default function ActiveTimer({ activeEntry, projects, onRefresh }: any) {
  const [elapsed, setElapsed] = useState(0);
  const [description, setDescription] = useState(activeEntry?.description || "");
  const [projectId, setProjectId] = useState(activeEntry?.project_id || "none");
  const [loading, setLoading] = useState(false);

  // TIMESTAMP ENGINE: Calculates based on server time, not browser ticks
  useEffect(() => {
    if (activeEntry) {
      const calculateElapsed = () => {
        const start = new Date(activeEntry.start_time).getTime();
        const now = new Date().getTime();
        setElapsed(Math.max(0, Math.floor((now - start) / 1000)));
      };
      calculateElapsed();
      const interval = setInterval(calculateElapsed, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsed(0);
    }
  }, [activeEntry]);

  const handleStart = async () => {
    setLoading(true);
    const res = await startTimerAction(description, projectId === "none" ? null : projectId);
    if (res.error) toast.error(res.error);
    else { toast.success("Timer started."); onRefresh(); }
    setLoading(false);
  };

  const handleStop = async () => {
    setLoading(true);
    const res = await stopTimerAction();
    if (res.error) toast.error(res.error);
    else { toast.success("Time saved."); setDescription(""); setProjectId("none"); onRefresh(); }
    setLoading(false);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#111A2E] border border-[#27344B] rounded-2xl p-8 text-center shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <h2 className={`text-7xl md:text-8xl font-mono font-bold mb-8 tracking-tighter ${activeEntry ? 'text-primary' : 'text-white'}`}>
          {formatTime(elapsed)}
        </h2>
        
        <div className="max-w-xl mx-auto space-y-4 mb-8">
          <Input placeholder="What are you working on?" value={description} onChange={(e) => setDescription(e.target.value)} disabled={!!activeEntry} className="bg-[#0B1020] border-[#27344B] text-white text-lg h-12 text-center" />
          <Select value={projectId} onValueChange={(val) => setProjectId(val as string)} disabled={!!activeEntry}>
            <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white h-12">
              <SelectValue>{projectId === "none" ? "No Project" : projects.find((p: any) => p.id === projectId)?.name || "Select Project"}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
              <SelectItem value="none">No Project</SelectItem>
              {projects.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={activeEntry ? handleStop : handleStart} 
          disabled={loading}
          className={`h-16 px-12 rounded-full text-lg font-bold transition-all ${activeEntry ? 'bg-[#EF4444] hover:bg-[#EF4444]/90 text-white' : 'bg-klyvor-gradient text-white hover:opacity-90'}`}
        >
          {loading ? <Loader2 className="animate-spin" /> : activeEntry ? <><Square size={20} className="mr-2 fill-current" /> Stop & Save</> : <><Play size={20} className="mr-2 fill-current" /> Start Timer</>}
        </Button>
      </div>
    </div>
  );
}
