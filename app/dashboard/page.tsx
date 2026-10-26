import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckSquare, FileText, Calculator, LayoutGrid, ArrowUpRight, Plus, Calendar, Briefcase, Clock } from "lucide-react";
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

      {/* Quick Actions (Row) */}
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

      {/* BENTO GRID: YOUR TOOLS (Cleaned up descriptions) */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">Your Tools</h2>
          <p className="text-sm text-[#64748B]">Jump directly into your active work.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(140px,auto)]">
          
          {/* Task Manager (Large) */}
          <Link href="/dashboard/tasks" className="md:col-span-2 bg-gradient-to-br from-[#111A2E] to-[#0B1020] border border-[#27344B] p-6 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.05)] flex flex-col justify-between">
            <CheckSquare className="absolute -bottom-8 -right-8 w-48 h-48 text-white/[0.03] group-hover:text-primary/[0.05] transition-colors rotate-12 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#0B1020] border border-[#27344B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckSquare className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Task Manager</h3>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-primary font-semibold mt-8 text-sm">
              Open Tasks <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </Link>

          {/* Documents (Tall) */}
          <Link href="/dashboard/documents" className="md:col-span-1 md:row-span-2 bg-[#0B1020] border border-[#27344B] p-6 rounded-2xl relative overflow-hidden group hover:border-secondary/50 transition-all hover:shadow-[0_0_30px_rgba(124,92,252,0.05)] flex flex-col justify-between">
            <FileText className="absolute -bottom-10 -right-10 w-64 h-64 text-white/[0.02] group-hover:text-secondary/[0.05] transition-colors -rotate-12 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#111A2E] border border-[#27344B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-secondary" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Documents & Notes</h3>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-secondary font-semibold mt-8 text-sm">
              Write Document <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </Link>

          {/* Calculator (Small) */}
          <Link href="/dashboard/calculator" className="md:col-span-1 bg-[#0B1020] border border-[#27344B] p-6 rounded-2xl relative overflow-hidden group hover:border-success/50 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.05)] flex flex-col justify-between">
            <Calculator className="absolute -bottom-6 -right-6 w-32 h-32 text-white/[0.03] group-hover:text-success/[0.05] transition-colors pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#111A2E] border border-[#27344B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calculator className="text-success" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Pricing Calculator</h3>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-success font-semibold mt-6 text-sm">
              Calculate <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </Link>

          {/* Directory (Small) */}
          <Link href="/dashboard/directory" className="md:col-span-1 bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl relative overflow-hidden group hover:border-white/30 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] flex flex-col justify-between">
            <LayoutGrid className="absolute -bottom-6 -right-6 w-32 h-32 text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#0B1020] border border-[#27344B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LayoutGrid className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Explore Directory</h3>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-white font-semibold mt-6 text-sm">
              View All <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
          <Link href="/dashboard/directory">
            <Button variant="outline" className="border-[#27344B] text-white hover:bg-[#111A2E]">
              Explore your tools
            </Button>
          </Link>
        </div>
      </div>

      {/* Coming Soon Preview */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">More Possibilities Ahead</h2>
          <p className="text-sm text-[#64748B]">KLYVOR is designed to grow with the way you work.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/projects" className="bg-[#111A2E] border border-[#27344B] p-6 rounded-xl opacity-60 hover:opacity-100 transition-opacity flex items-start gap-4">
            <Calendar className="text-secondary shrink-0" size={24} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold">Project Planner</h3>
                <span className="text-[10px] font-bold bg-[#27344B] text-[#C7D0E0] px-2 py-0.5 rounded-full">COMING SOON</span>
              </div>
              <p className="text-xs text-[#64748B]">Plan projects, organise milestones, and keep work moving forward.</p>
            </div>
          </Link>
          
          <Link href="/dashboard/clients" className="bg-[#111A2E] border border-[#27344B] p-6 rounded-xl opacity-60 hover:opacity-100 transition-opacity flex items-start gap-4">
            <Briefcase className="text-secondary shrink-0" size={24} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold">Business Tools</h3>
                <span className="text-[10px] font-bold bg-[#27344B] text-[#C7D0E0] px-2 py-0.5 rounded-full">COMING SOON</span>
              </div>
              <p className="text-xs text-[#64748B]">Manage your clients and keep your relationships organized.</p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
