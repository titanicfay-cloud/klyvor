import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckSquare, FileText, Calculator, LayoutGrid, ArrowRight, Plus, Calendar, Briefcase, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const fullName = user?.user_metadata?.full_name || "";
  const firstName = fullName.split(" ")[0] || "there";

  const tools = [
    { name: "Task Manager", desc: "Organise tasks, priorities, and deadlines in one place.", icon: CheckSquare, href: "/dashboard/tasks" },
    { name: "Documents & Notes", desc: "Capture ideas, write notes, and keep important information organised.", icon: FileText, href: "/dashboard/documents" },
    { name: "Pricing Calculator", desc: "Estimate sustainable rates using your income goals, expenses, and working hours.", icon: Calculator, href: "/dashboard/calculator" },
    { name: "Tool Directory", desc: "Explore available tools and discover what's coming next.", icon: LayoutGrid, href: "/dashboard/directory" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Your Workspace</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {firstName}.</h1>
        <p className="text-[#C7D0E0]">Your workspace is ready. What would you like to work on today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/tasks" className="flex items-center gap-4 bg-[#111A2E] border border-[#27344B] p-4 rounded-xl hover:border-primary/50 transition-colors group">
          {/* FIXED: Dark background, Cyan icon. On hover, solid Cyan background, Dark icon */}
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

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">Your Tools</h2>
          <p className="text-sm text-[#64748B]">Keep your most useful tools within reach.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.href} className="bg-[#0B1020] border border-[#27344B] p-6 rounded-xl hover:border-primary/50 transition-colors flex flex-col h-full group">
              <div className="w-10 h-10 rounded-lg bg-[#111A2E] border border-[#27344B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <tool.icon className="text-primary" size={20} />
              </div>
              <h3 className="text-white font-semibold mb-2">{tool.name}</h3>
              <p className="text-xs text-[#64748B] mb-6 flex-grow leading-relaxed">{tool.desc}</p>
              <div className="text-primary text-xs font-semibold flex items-center gap-1 mt-auto">
                Open Tool <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

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
          
          <Link href="/dashboard/business" className="bg-[#111A2E] border border-[#27344B] p-6 rounded-xl opacity-60 hover:opacity-100 transition-opacity flex items-start gap-4">
            <Briefcase className="text-secondary shrink-0" size={24} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold">Business Tools</h3>
                <span className="text-[10px] font-bold bg-[#27344B] text-[#C7D0E0] px-2 py-0.5 rounded-full">COMING SOON</span>
              </div>
              <p className="text-xs text-[#64748B]">Explore tools designed to support the practical side of professional work.</p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
