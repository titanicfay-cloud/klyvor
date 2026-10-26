import Link from "next/link";
import Image from "next/image";
import { Shield, Users, LifeBuoy, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050812] text-white flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-[#27344B] bg-[#0B1020] flex flex-col fixed h-full z-40">
        <div className="h-20 flex items-center px-6 border-b border-[#27344B]">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.png" alt="KLYVOR" width={140} height={40} className="object-contain w-auto h-8" />
            <span className="text-[10px] font-bold bg-[#EF4444] text-white px-2 py-0.5 rounded">STAFF</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white transition-colors">
            <Shield size={18} /> Overview
          </Link>
          <Link href="/admin/support" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white transition-colors">
            <LifeBuoy size={18} /> Support Tickets
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white transition-colors">
            <Users size={18} /> User Management
          </Link>
        </div>

        <div className="p-4 border-t border-[#27344B]">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:text-white transition-colors">
            <ArrowLeft size={18} /> Exit to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
