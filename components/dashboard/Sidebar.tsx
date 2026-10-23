"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LayoutGrid, CheckSquare, FileText, Calculator, Calendar, Briefcase, Settings } from "lucide-react";

// FIXED: Explicitly typed the array so TypeScript knows 'soon' is optional
type NavItem = { label: string; href: string; icon: any; soon?: boolean };
type NavGroup = { title: string; items: NavItem[] };

const navItems: NavGroup[] = [
  { title: "WORKSPACE", items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Tool Directory", href: "/dashboard/directory", icon: LayoutGrid },
  ]},
  { title: "YOUR WORK", items: [
      { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { label: "Documents & Notes", href: "/dashboard/documents", icon: FileText },
      { label: "Pricing Calculator", href: "/dashboard/calculator", icon: Calculator },
  ]},
  { title: "EXPLORE", items: [
      { label: "Project Planner", href: "/dashboard/projects", icon: Calendar, soon: true },
      { label: "Business Tools", href: "/dashboard/business", icon: Briefcase, soon: true },
  ]},
];

export default function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  return (
    <aside className={`w-64 h-screen border-r border-[#27344B] bg-[#0B1020] flex flex-col fixed top-0 left-0 z-40 ${isMobile ? "flex" : "hidden lg:flex"}`}>
      <div className="h-20 flex items-center px-6 border-b border-[#27344B]">
        <Link href="/dashboard">
          <Image src="/logo.png" alt="KLYVOR" width={160} height={50} className="object-contain w-auto h-10" priority />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navItems.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-3 px-2">{group.title}</h4>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link href={item.href} className={cn("flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border", isActive ? "bg-[#111A2E] border-primary/30 text-primary" : "border-transparent text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white")}>
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={isActive ? "text-primary" : "text-[#64748B]"} />
                        {item.label}
                      </div>
                      {item.soon && <span className="text-[10px] font-bold bg-[#27344B] text-[#C7D0E0] px-2 py-0.5 rounded-full">SOON</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[#27344B]">
        <Link href="/dashboard/settings" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border", pathname === "/dashboard/settings" ? "bg-[#111A2E] border-primary/30 text-primary" : "border-transparent text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white")}>
          <Settings size={18} className={pathname === "/dashboard/settings" ? "text-primary" : "text-[#64748B]"} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
