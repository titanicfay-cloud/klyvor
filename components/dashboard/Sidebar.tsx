"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LayoutGrid, CheckSquare, FileText, Calculator, Calendar, Settings, LogOut, Users, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { title: "WORKSPACE", items: [{ label: "Overview", href: "/dashboard", icon: LayoutDashboard }, { label: "Tool Directory", href: "/dashboard/directory", icon: LayoutGrid }]},
  { title: "YOUR WORK", items: [{ label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { label: "Calendar", href: "/dashboard/calendar", icon: Calendar }, { label: "Documents & Notes", href: "/dashboard/documents", icon: FileText }, { label: "Pricing Calculator", href: "/dashboard/calculator", icon: Calculator }]},
  { title: "EXPLORE", items: [{ label: "Project Planner", href: "/dashboard/projects", icon: Calendar }, { label: "Clients", href: "/dashboard/clients", icon: Users }]},
];

export default function Sidebar({ isMobile = false, onNavigate }: { isMobile?: boolean, onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
        if (data) setRole(data.role);
      }
    };
    fetchRole();
  }, [supabase]);

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push("/login"); router.refresh(); };
  const isStaff = role === 'owner' || role === 'admin' || role === 'support';
  const staffLabel = role === 'owner' ? 'Owner Portal' : role === 'admin' ? 'Admin Portal' : 'Support Portal';

  return (
    <aside className={`w-64 h-[100dvh] border-r border-[#27344B] bg-[#0B1020] flex-col fixed top-0 left-0 z-40 ${isMobile ? "flex" : "hidden lg:flex"}`}>
      <div className="h-20 shrink-0 flex items-center px-6 border-b border-[#27344B]">
        <Link href="/dashboard" onClick={onNavigate}><Image src="/logo.png" alt="KLYVOR" width={160} height={50} className="object-contain w-auto h-10" priority /></Link>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto py-6 px-4 space-y-8">
        {navItems.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-3 px-2">{group.title}</h4>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    {/* FIXED: Removed any destructive colors, strictly using primary/navy */}
                    <Link href={item.href} onClick={onNavigate} className={cn("flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border", isActive ? "bg-[#111A2E] border-primary/30 text-primary" : "border-transparent text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white")}>
                      <div className="flex items-center gap-3"><item.icon size={18} className={isActive ? "text-primary" : "text-[#64748B]"} />{item.label}</div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {isStaff && (
          <div>
            <h4 className="text-xs font-semibold text-[#EF4444] tracking-wider uppercase mb-3 px-2 flex items-center gap-2"><ShieldAlert size={12} /> Staff Access</h4>
            <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/20"><LayoutDashboard size={18} />{staffLabel}</Link>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-[#27344B] shrink-0 space-y-1">
        <Link href="/dashboard/settings" onClick={onNavigate} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border", pathname === "/dashboard/settings" ? "bg-[#111A2E] border-primary/30 text-primary" : "border-transparent text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white")}>
          <Settings size={18} className={pathname === "/dashboard/settings" ? "text-primary" : "text-[#64748B]"} />Settings
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#2A1315] hover:text-[#EF4444] transition-colors border border-transparent text-left"><LogOut size={18} className="text-[#64748B]" />Sign Out</button>
      </div>
    </aside>
  );
}
