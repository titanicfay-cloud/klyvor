"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, Settings } from "lucide-react";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

const getBreadcrumb = (path: string) => {
  if (path === "/dashboard") return "Workspace / Overview";
  if (path.includes("directory")) return "Workspace / Tool Directory";
  if (path.includes("tasks")) return "Workspace / Tasks";
  if (path.includes("documents")) return "Workspace / Documents & Notes";
  if (path.includes("calculator")) return "Workspace / Pricing Calculator";
  if (path.includes("projects")) return "Workspace / Project Planner";
  if (path.includes("business")) return "Workspace / Business Tools";
  if (path.includes("settings")) return "Workspace / Settings";
  return "Workspace";
};

export default function Header({ userEmail, userName }: { userEmail: string, userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = userName ? userName.substring(0, 2).toUpperCase() : "KL";
  if (!mounted) return null;

  return (
    <header className="h-20 border-b border-[#27344B] bg-[#0B1020]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center h-10 w-10 rounded-md text-white hover:bg-[#111A2E]">
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-[#0B1020] border-r-[#27344B]"><Sidebar isMobile={true} /></SheetContent>
          </Sheet>
        </div>
        <div className="hidden sm:block text-sm font-medium text-[#64748B]">{getBreadcrumb(pathname)}</div>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
            <span className="hidden sm:block text-sm text-[#C7D0E0]">{userEmail}</span>
            <Avatar className="h-9 w-9 border border-[#27344B]">
              <AvatarFallback className="bg-[#111A2E] text-primary text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#111A2E] border-[#27344B] text-white">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName || "Klyvor User"}</p>
                <p className="text-xs leading-none text-[#64748B]">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#27344B]" />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="hover:bg-[#0B1020] cursor-pointer">
              <Settings size={16} className="mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#27344B]" />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:bg-destructive/10 cursor-pointer">
              <LogOut size={16} className="mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
