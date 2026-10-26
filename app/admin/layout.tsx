"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Users, LifeBuoy, ArrowLeft, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Extract the sidebar content so we can reuse it for both Desktop and Mobile
  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="h-20 flex items-center px-6 border-b border-[#27344B]">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2">
          <Image src="/logo.png" alt="KLYVOR" width={140} height={40} className="object-contain w-auto h-8" />
          <span className="text-[10px] font-bold bg-[#EF4444] text-white px-2 py-0.5 rounded">STAFF</span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white transition-colors">
          <Shield size={18} /> Overview
        </Link>
        <Link href="/admin/support" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white transition-colors">
          <LifeBuoy size={18} /> Support Tickets
        </Link>
        <Link href="/admin/users" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white transition-colors">
          <Users size={18} /> User Management
        </Link>
      </div>

      <div className="p-4 border-t border-[#27344B]">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:text-white transition-colors">
          <ArrowLeft size={18} /> Exit to App
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#050812] text-white flex flex-col lg:flex-row">
      
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden h-16 border-b border-[#27344B] bg-[#0B1020] flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="KLYVOR" width={100} height={30} className="object-contain w-auto h-6" />
          <span className="text-[10px] font-bold bg-[#EF4444] text-white px-2 py-0.5 rounded">STAFF</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger className="p-2 text-white">
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-[#0B1020] border-r-[#27344B] flex flex-col">
            <SidebarContent onNavigate={() => setIsMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 border-r border-[#27344B] bg-[#0B1020] flex-col fixed h-full z-40 top-0 left-0">
        <SidebarContent />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
