"use client";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import UserDropdown from "./UserDropdown";
import { useState, useEffect } from "react";

const getBreadcrumb = (path: string) => {
  if (path === "/dashboard") return "Workspace / Overview";
  if (path.includes("directory")) return "Workspace / Tool Directory";
  if (path.includes("tasks")) return "Workspace / Tasks";
  if (path.includes("calendar")) return "Workspace / Calendar";
  if (path.includes("documents")) return "Workspace / Documents & Notes";
  if (path.includes("calculator")) return "Workspace / Pricing Calculator";
  if (path.includes("projects")) return "Workspace / Project Planner";
  if (path.includes("clients")) return "Workspace / Clients";
  if (path.includes("settings")) return "Workspace / Settings";
  return "Workspace";
};

export default function Header({ userEmail, userName, planId, role }: { userEmail: string, userName: string, planId: string, role: string }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <header className="h-20 border-b border-[#27344B] bg-[#0B1020]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center h-10 w-10 rounded-md text-white hover:bg-[#111A2E]"><Menu size={20} /></SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-[#0B1020] border-r-[#27344B]"><Sidebar isMobile={true} role={role} /></SheetContent>
          </Sheet>
        </div>
        <div className="hidden sm:block text-sm font-medium text-[#64748B]">{getBreadcrumb(pathname)}</div>
      </div>
      <div className="flex items-center gap-4">
        <UserDropdown userEmail={userEmail} userName={userName} planId={planId} />
      </div>
    </header>
  );
}
