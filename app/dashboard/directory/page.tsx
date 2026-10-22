"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, LayoutGrid, CheckSquare, FileText, Calculator, Calendar, Briefcase, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const allTools = [
  {
    name: "Task Manager",
    description: "Organise tasks, set priorities, and keep track of deadlines.",
    href: "/dashboard/tasks",
    category: "Productivity",
    status: "AVAILABLE",
    icon: CheckSquare,
  },
  {
    name: "Documents & Notes",
    description: "Create, organise, and save notes and documents in your personal workspace.",
    href: "/dashboard/documents",
    category: "Documents & Writing",
    status: "AVAILABLE",
    icon: FileText,
  },
  {
    name: "Pricing Calculator",
    description: "Estimate your rates using income targets, expenses, and billable working hours.",
    href: "/dashboard/calculator",
    category: "Business & Finance",
    status: "AVAILABLE",
    icon: Calculator,
  },
  {
    name: "Project Planner",
    description: "Structure projects, manage milestones, and organise your next steps.",
    href: "/dashboard/projects",
    category: "Planning",
    status: "COMING SOON",
    icon: Calendar,
  },
  {
    name: "Business Tools",
    description: "Explore tools designed to support business organisation and professional growth.",
    href: "/dashboard/business",
    category: "Business & Finance",
    status: "COMING SOON",
    icon: Briefcase,
  },
];

const categories = ["All Tools", "Productivity", "Documents & Writing", "Business & Finance", "Planning"];

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Tools");

  const filteredTools = allTools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "All Tools" || tool.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Explore Klyvor</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your tools, all in one place.</h1>
        <p className="text-[#C7D0E0]">Discover the tools available in your workspace and explore what's coming next.</p>
      </div>

      <div className="space-y-6">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
          <Input 
            type="text" 
            placeholder="Search tools by name or purpose..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#111A2E] border-[#27344B] text-white placeholder:text-[#64748B] focus-visible:ring-1 focus-visible:ring-primary h-12"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-colors border",
                activeCategory === cat 
                  ? "bg-[#00D4FF] text-[#0B1020] border-[#00D4FF]" // Explicit Hex Colors
                  : "bg-[#111A2E] text-[#C7D0E0] border-[#27344B] hover:border-[#00D4FF]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div 
              key={tool.name} 
              className={cn(
                "bg-[#0B1020] border rounded-xl p-6 flex flex-col h-full transition-all",
                tool.status === "AVAILABLE" ? "border-[#27344B] hover:border-[#00D4FF]" : "border-[#27344B] opacity-70"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#111A2E] border border-[#27344B] flex items-center justify-center">
                  <tool.icon className={tool.status === "AVAILABLE" ? "text-[#00D4FF]" : "text-[#64748B]"} size={20} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-full border",
                  tool.status === "AVAILABLE" ? "bg-[#111A2E] text-[#00D4FF] border-[#00D4FF]/30" : "bg-[#27344B] text-[#C7D0E0] border-transparent"
                )}>
                  {tool.status}
                </span>
              </div>
              
              <h3 className="text-white font-semibold mb-2">{tool.name}</h3>
              <p className="text-sm text-[#64748B] mb-6 flex-grow leading-relaxed">{tool.description}</p>
              
              {tool.status === "AVAILABLE" ? (
                <Link href={tool.href} className="text-[#00D4FF] text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all w-max">
                  Open Tool <ArrowRight size={16} />
                </Link>
              ) : (
                <span className="text-[#64748B] text-sm font-semibold flex items-center gap-2 w-max">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[#27344B] rounded-xl p-16 text-center bg-[#111A2E]">
          <Search className="w-10 h-10 text-[#64748B] mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No tools found.</h3>
          <p className="text-sm text-[#64748B] mb-6">Try a different search term or select another category.</p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveCategory("All Tools"); }}
            className="bg-[#27344B] text-white px-6 py-2 rounded-full font-medium hover:bg-[#334155] transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
