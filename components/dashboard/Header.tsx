"use client";

import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import UserDropdown from "./UserDropdown";
import { useState, useEffect } from "react";

const getBreadcrumb = (path: string) => {
  if (path === "/dashboard") return "Workspace / Overview";
  if (path.includes("/directory")) return "Workspace / Tool Directory";
  if (path.includes("/tasks")) return "Daily Work / Tasks";
  if (path.includes("/time-tracker")) return "Daily Work / Time Tracker";
  if (path.includes("/documents")) return "Daily Work / Documents";
  if (path.includes("/calculator")) return "Daily Work / Pricing Calculator";
  if (path.includes("/projects")) return "Clients & Projects / Projects";
  if (path.includes("/clients")) return "Clients & Projects / Clients";
  if (path.includes("/invoices")) return "Money / Invoices";
  if (path.includes("/expenses")) return "Money / Expenses";
  if (path.includes("/proposals")) return "Professional / Proposals";
  if (path.includes("/resumes")) return "Professional / CV Builder";
  if (path.includes("/settings/billing")) return "Settings / Billing";
  if (path.includes("/settings")) return "Workspace / Settings";
  if (path.includes("/admin")) return "Staff / Admin";
  return "Workspace";
};

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

  return (
    <header className="h-20 border-b border-[#27344B] bg-[#0B1020]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger className="inline-flex items-center justify-center h-10 w-10 rounded-md text-white hover:bg-[#111A2E]">
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-[#0B1020] border-r-[#27344B]">
              <Sidebar
                isMobile={true}
                role={role}
                planId={planId}
                onNavigate={() => setIsMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden sm:block text-sm font-medium text-[#64748B]">
          {getBreadcrumb(pathname)}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <UserDropdown userEmail={userEmail} userName={userName} planId={planId} />
      </div>
    </header>
  );
}
