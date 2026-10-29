"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [roleName, setRoleName] = useState("STAFF");
  
  useEffect(() => {
    const supabase = createClient();
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
        if (data) setRoleName(data.role.toUpperCase());
      }
    };
    fetchRole();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex flex-col lg:flex-row">
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden h-16 border-b border-[#27344B] bg-[#0B1020] flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="KLYVOR" width={100} height={30} className="object-contain w-auto h-6" />
          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded ${roleName === 'OWNER' ? 'bg-[#7C5CFC]' : roleName === 'ADMIN' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'}`}>{roleName}</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger className="p-2 text-white"><Menu size={24} /></SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-[#0B1020] border-r-[#27344B]">
            <AdminSidebar roleName={roleName} onNavigate={() => setIsMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 border-r border-[#27344B] bg-[#0B1020] flex-col fixed h-full z-40 top-0 left-0">
        <AdminSidebar roleName={roleName} />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
