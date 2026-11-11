"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LayoutGrid,
  CheckSquare,
  FileText,
  Calculator,
  Calendar,
  Settings,
  LogOut,
  Users,
  ShieldAlert,
  Clock,
  Receipt,
  Lock,
  Wallet,
  ChevronDown,
} from "lucide-react";

const navGroups = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard, premium: false },
      { label: "Tool Directory", href: "/dashboard/directory", icon: LayoutGrid, premium: false },
    ],
  },
  {
    title: "Daily Work",
    items: [
      { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare, premium: false },
      { label: "Time Tracker", href: "/dashboard/time-tracker", icon: Clock, premium: true },
      { label: "Documents", href: "/dashboard/documents", icon: FileText, premium: false },
      { label: "Pricing Calculator", href: "/dashboard/calculator", icon: Calculator, premium: false },
    ],
  },
  {
    title: "Clients & Projects",
    items: [
      { label: "Projects", href: "/dashboard/projects", icon: Calendar, premium: true },
      { label: "Clients", href: "/dashboard/clients", icon: Users, premium: true },
    ],
  },
  {
    title: "Money",
    items: [
      { label: "Invoices", href: "/dashboard/invoices", icon: Receipt, premium: true },
      { label: "Expenses", href: "/dashboard/expenses", icon: Wallet, premium: true },
    ],
  },
  {
    title: "Professional",
    items: [
      { label: "Proposals", href: "/dashboard/proposals", icon: FileText, premium: true },
      { label: "CV Builder", href: "/dashboard/resumes", icon: FileText, premium: true },
    ],
  },
];

export default function Sidebar({
  isMobile = false,
  onNavigate,
  role,
  planId,
}: {
  isMobile?: boolean;
  onNavigate?: () => void;
  role: string;
  planId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isStaff = role === "owner" || role === "admin" || role === "support";
  const staffLabel =
    role === "owner" ? "Owner Portal" : role === "admin" ? "Admin Portal" : "Support Portal";
  const isFree = planId === "free";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Workspace: true,
    "Daily Work": true,
    "Clients & Projects": true,
    Money: true,
    Professional: true,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "w-64 h-[100dvh] border-r border-[#27344B] bg-[#0B1020] flex-col fixed top-0 left-0 z-40",
        isMobile ? "flex" : "hidden lg:flex"
      )}
    >
      <div className="h-20 shrink-0 flex items-center px-6 border-b border-[#27344B]">
        <Link href="/dashboard" onClick={onNavigate}>
          <Image
            src="/logo.png"
            alt="KLYVOR"
            width={160}
            height={50}
            className="object-contain w-auto h-10"
            priority
          />
        </Link>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto py-5 px-3 space-y-1">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.title];

          return (
            <div key={group.title} className="mb-2">
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold text-[#64748B] tracking-wider uppercase hover:text-[#C7D0E0] transition-colors"
              >
                <span>{group.title}</span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    isOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>

              {isOpen && (
                <ul className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href || pathname.startsWith(item.href + "/");
                    const isLocked = isFree && item.premium;
                    const targetHref = isLocked ? "/dashboard/settings/billing" : item.href;

                    return (
                      <li key={item.label}>
                        <Link
                          href={targetHref}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all border",
                            isActive
                              ? "bg-[#111A2E] border-primary/30 text-primary"
                              : "border-transparent text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              size={17}
                              className={isActive ? "text-primary" : "text-[#64748B]"}
                            />
                            <span>{item.label}</span>
                          </div>
                          {isLocked && <Lock size={12} className="text-[#F59E0B] shrink-0" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {isStaff && (
          <div className="mt-6 pt-4 border-t border-[#27344B]">
            <h4 className="px-3 mb-2 text-[11px] font-semibold text-[#EF4444] tracking-wider uppercase flex items-center gap-1.5">
              <ShieldAlert size={12} />
              Staff
            </h4>
            <Link
              href="/admin"
              onClick={onNavigate}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/20 transition-colors"
            >
              <LayoutDashboard size={17} />
              {staffLabel}
            </Link>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[#27344B] shrink-0 space-y-0.5">
        <Link
          href="/dashboard/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border",
            pathname.startsWith("/dashboard/settings")
              ? "bg-[#111A2E] border-primary/30 text-primary"
              : "border-transparent text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white"
          )}
        >
          <Settings
            size={17}
            className={
              pathname.startsWith("/dashboard/settings") ? "text-primary" : "text-[#64748B]"
            }
          />
          Settings
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#2A1315] hover:text-[#EF4444] transition-colors border border-transparent text-left"
        >
          <LogOut size={17} className="text-[#64748B]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
