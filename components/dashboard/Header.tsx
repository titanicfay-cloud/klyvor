"use client";

import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BadgeCheck, Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import UserDropdown from "./UserDropdown";
import NotificationBell from "./NotificationBell";
import { useState, useEffect } from "react";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  productivity: "Productivity",
  professional: "Professional",
  business: "Business",
  all_access: "All-Access",
  team: "Team",
  business_plus: "Business Plus",
};

function pageInfo(path: string) {
  if (path === "/dashboard") return { section: "Workspace", title: "Overview" };
  if (path.includes("/directory")) return { section: "Workspace", title: "Tools" };
  if (path.includes("/notifications")) return { section: "Workspace", title: "Alerts" };
  if (path.includes("/tasks")) return { section: "Daily Work", title: "Tasks" };
  if (path.includes("/time-tracker")) return { section: "Daily Work", title: "Time" };
  if (path.includes("/documents")) return { section: "Daily Work", title: "Documents" };
  if (path.includes("/calculator")) return { section: "Daily Work", title: "Pricing" };
  if (path.includes("/calendar")) return { section: "Daily Work", title: "Calendar" };
  if (path.includes("/projects")) return { section: "Work", title: "Projects" };
  if (path.includes("/clients")) return { section: "Work", title: "Clients" };
  if (path.includes("/invoices")) return { section: "Money", title: "Invoices" };
  if (path.includes("/expenses")) return { section: "Money", title: "Expenses" };
  if (path.includes("/proposals")) return { section: "Professional", title: "Proposals" };
  if (path.includes("/resumes")) return { section: "Professional", title: "CV" };
  if (path.includes("/settings/billing")) return { section: "Account", title: "Billing" };
  if (path.includes("/settings")) return { section: "Account", title: "Settings" };
  return { section: "Workspace", title: "KLYVOR" };
}

export default function Header({
  userEmail,
  userName,
  planId,
  role,
}: {
  userEmail: string;
  userName: string;
  planId: string;
  role: string;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const page = pageInfo(pathname);
  const planName = PLAN_LABEL[planId] || "Free";
  const isPremium = planId && planId !== "free";

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-2 border-b border-[#27344B] bg-[#0B1020]/90 px-3 py-2 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <div className="lg:hidden shrink-0">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-[#111A2E]">
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-r-[#27344B] bg-[#0B1020] p-0">
              <Sidebar isMobile={true} role={role} planId={planId} onNavigate={() => setIsMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">{page.section}</p>
          <h1 className="truncate text-base font-bold text-white sm:text-lg">{page.title}</h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <span className={`hidden items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${isPremium ? "border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF]" : "border-[#27344B] text-[#64748B]"}`}>
          {isPremium && <BadgeCheck size={13} />}
          {planName}
        </span>
        {isPremium && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#00D4FF]/40 bg-[#00D4FF]/10 text-[#00D4FF] sm:hidden" title={planName}>
            <BadgeCheck size={16} />
          </span>
        )}
        <NotificationBell />
        <UserDropdown userEmail={userEmail} userName={userName} planId={planId} />
      </div>
    </header>
  );
}
