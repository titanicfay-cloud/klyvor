import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckSquare, FileText, Calculator, Plus, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const fullName = user?.user_metadata?.full_name || "";
  const firstName = fullName.split(" ")[0] || "there";

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Your Workspace</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {firstName}.</h1>
        <p className="text-[#C7D0E0]">Your workspace is ready. What would you like to work on today?</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/tasks" className="flex items-center gap-4 bg-[#111A2E] border border-[#27344B] p-4 rounded-xl hover:border-primary/50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#0B1020] transition-colors shrink-0">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Create a task</h3>
              <p className="text-xs text-[#64748B]">Capture something you need to get done.</p>
            </div>
          </Link>
          
          <Link href="/dashboard/documents" className="flex items-center gap-4 bg-[#111A2E] border border-[#27344B] p-4 rounded-xl hover:border-secondary/50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Write a document</h3>
              <p className="text-xs text-[#64748B]">Start a note, idea, or working draft.</p>
            </div>
          </Link>

          <Link href="/dashboard/calculator" className="flex items-center gap-4 bg-[#111A2E] border border-[#27344B] p-4 rounded-xl hover:border-success/50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center text-success group-hover:bg-success group-hover:text-white transition-colors shrink-0">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Calculate your rate</h3>
              <p className="text-xs text-[#64748B]">Estimate what you should charge for your work.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity (Empty State) */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <p className="text-sm text-[#64748B]">Pick up where you left off.</p>
        </div>
        <div className="border border-dashed border-[#27344B] rounded-xl p-10 text-center bg-[#111A2E]/50">
          <Clock className="w-8 h-8 text-[#64748B] mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">Your workspace is just getting started.</h3>
          <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto">Tasks, documents, and saved calculations will appear here as you begin using KLYVOR.</p>
          <Button asChild variant="outline" className="border-[#27344B] text-white hover:bg-[#111A2E]">
             <Link href="/dashboard/directory">Explore your tools</Link>
          </Button>
        </div>
      </div>

      {/* Coming Soon / Explore */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">Explore More</h2>
          <p className="text-sm text-[#64748B]">Expand your workflow with these KLYVOR features.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/projects" className="bg-[#111A2E] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-all flex items-start gap-4">
            <Calendar className="text-secondary shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold mb-1">Project Planner</h3>
              <p className="text-xs text-[#64748B]">Plan projects, organise milestones, and keep work moving forward.</p>
            </div>
          </Link>
          
          <Link href="/dashboard/clients" className="bg-[#111A2E] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-all flex items-start gap-4">
            <Users className="text-secondary shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold mb-1">Client Manager</h3>
              <p className="text-xs text-[#64748B]">Manage your clients and keep your relationships organized.</p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
