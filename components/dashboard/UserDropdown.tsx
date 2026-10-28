"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";

export default function UserDropdown({ userEmail, userName, planId }: { userEmail: string, userName: string, planId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const initials = userName ? userName.substring(0, 2).toUpperCase() : "KL";
  const planName = planId === 'free' ? 'Free' : planId.replace('_', ' ').toUpperCase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-white">{userName}</span>
          <span className="text-xs text-[#64748B]">{userEmail}</span>
        </div>
        <Avatar className="h-10 w-10 border border-[#27344B]">
          <AvatarFallback className="bg-[#111A2E] text-primary text-xs font-bold">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-[#111A2E] border-[#27344B] text-white">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-[#64748B]">{userEmail}</p>
            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 w-max">
              {planName} Plan
            </span>
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
  );
}
