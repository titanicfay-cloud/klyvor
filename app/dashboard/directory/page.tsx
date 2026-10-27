"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, CheckSquare, FileText, Calculator, Calendar, Users, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const allTools = [
  { name: "Task Manager", description: "Organise tasks, set priorities, and keep track of deadlines.", href: "/dashboard/tasks", category: "Productivity", icon: CheckSquare },
  { name: "Project Planner", description: "Plan projects, organise milestones, and keep work moving forward.", href: "/dashboard/projects", category: "Planning", icon: Calendar },
  { name: "Documents & Notes", description: "Create, organise, and save notes and rich documents.", href: "/dashboard/documents", category: "Documents & Writing", icon: FileText },
  { name: "Client Manager", description: "Manage your clients and keep your relationships organized.", href: "/dashboard/clients", category: "Business & Finance", icon: Users },
  { name: "Pricing Calculator", description: "Estimate your rates using income targets, expenses, and billable working hours.", href: "/dashboard/calculator", category: "Business & Finance", icon: Calculator },
];

const categories = ["All Tools", "Productivity", "Documents & Writing", "Business & Finance", "Planning"];

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Tools");

  const filteredTools = allTools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All Tools" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Explore Klyvor</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your tools, all in one place.</h1>
        <p className="text-[#C7D0E0]">Discover the tools available in your workspace.</p>
      </div>

      <div className="space-y-6">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
          <Input type="text" placeholder="Search tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-[#111A2E] border-[#27344B] text-white placeholder:text-[#64748B] focus-visible:ring-1 focus-visible:ring-primary h-12" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={cn("px-4 py-2 rounded-full text-sm font-semibold transition-colors border", activeCategory === cat ? "bg-[#00D4FF] text-[#0B1020] border-[#00D4FF]" : "bg-[#111A2E] text-[#C7D0E0] border-[#27344B] hover:border-[#00D4FF]")}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div key={tool.name} className="bg-[#0B1020] border border-[#27344B] rounded-xl p-6 flex flex-col h-full hover:border-[#00D4FF] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#111A2E] border border-[#27344B] flex items-center justify-center"><tool.icon className="text-[#00D4FF]" size={20} /></div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full border bg-[#111A2E] text-[#00D4FF] border-[#00D4FF]/30">AVAILABLE</span>
            </div>
            <h3 className="text-white font-semibold mb-2">{tool.name}</h3>
            <p className="text-sm text-[#64748B] mb-6 flex-grow leading-relaxed">{tool.description}</p>
            <Link href={tool.href} className="text-[#00D4FF] text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all w-max">Open Tool <ArrowRight size={16} /></Link>
          </div>
        ))}
      </div>
    </div>
  );
}
