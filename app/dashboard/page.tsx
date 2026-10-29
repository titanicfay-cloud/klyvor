import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckSquare, FileText, Calculator, Plus, Calendar, Users, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const fullName = user?.user_metadata?.full_name || "";
  const firstName = fullName.split(" ")[0] || "there";

  const { data: sub } = await supabase.from("user_subscriptions").select("plan_id, status").eq("user_id", user.id).single();
  const isFree = !sub || sub.plan_id === 'free' || sub.status !== 'active';

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Your Workspace</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {firstName}.</h1>
        <p className="text-[#C7D0E0]">Your workspace is ready. What would you like to work on today?</p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/tasks" className="flex items-center gap-4 bg-[#111A2E] border border-[#27344B] p-4 rounded-xl hover:border-primary/50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#0B1020] transition-colors shrink-0"><Plus size={20} /></div>
            <div><h3 className="text-white font-medium text-sm">Create a task</h3><p className="text-xs text-[#64748B]">Capture something you need to get done.</p></div>
          </Link>
          <Link href="/dashboard/documents" className="flex items-center gap-4 bg-[#111A2E] border border-[#27344B] p-4 rounded-xl hover:border-secondary/50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shrink-0"><FileText size={20} /></div>
            <div><h3 className="text-white font-medium text-sm">Write a document</h3><p className="text-xs text-[#64748B]">Start a note, idea, or working draft.</p></div>
          </Link>
          <Link href="/dashboard/calculator" className="flex items-center gap-4 bg-[#111A2E] border border-[#27344B] p-4 rounded-xl hover:border-success/50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center text-success group-hover:bg-success group-hover:text-white transition-colors shrink-0"><Calculator size={20} /></div>
            <div><h3 className="text-white font-medium text-sm">Calculate your rate</h3><p className="text-xs text-[#64748B]">Estimate what you should charge.</p></div>
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-4"><h2 className="text-xl font-bold text-white">Recent Activity</h2><p className="text-sm text-[#64748B]">Pick up where you left off.</p></div>
        <div className="border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50">
          <Clock className="w-8 h-8 text-[#64748B] mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">Your workspace is just getting started.</h3>
          <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto">Tasks, documents, and saved calculations will appear here.</p>
          <Link href="/dashboard/directory"><Button variant="outline" className="border-[#27344B] text-white hover:bg-[#111A2E]">Explore your tools</Button></Link>
        </div>
      </div>

      <div>
        <div className="mb-4"><h2 className="text-xl font-bold text-white">Explore More</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FIXED: Added Lock UI for Free users */}
          <Link href={isFree ? "/dashboard/settings/billing" : "/dashboard/projects"} className="bg-[#111A2E] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-all flex items-start gap-4 relative">
            <Calendar className="text-secondary shrink-0" size={24} />
            <div>
              <div className="flex items-center gap-2 mb-1"><h3 className="text-white font-semibold">Project Planner</h3>{isFree && <Lock size={12} className="text-[#F59E0B]" />}</div>
              <p className="text-xs text-[#64748B]">Plan projects and organise milestones.</p>
              {isFree && <p className="text-xs text-[#F59E0B] mt-2 font-semibold">Upgrade to Unlock</p>}
            </div>
          </Link>
          <Link href={isFree ? "/dashboard/settings/billing" : "/dashboard/clients"} className="bg-[#111A2E] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-all flex items-start gap-4 relative">
            <Users className="text-secondary shrink-0" size={24} />
            <div>
              <div className="flex items-center gap-2 mb-1"><h3 className="text-white font-semibold">Client Manager</h3>{isFree && <Lock size={12} className="text-[#F59E0B]" />}</div>
              <p className="text-xs text-[#64748B]">Manage your clients and relationships.</p>
              {isFree && <p className="text-xs text-[#F59E0B] mt-2 font-semibold">Upgrade to Unlock</p>}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
