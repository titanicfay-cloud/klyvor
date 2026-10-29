"use client";
import Link from "next/link";
import Image from "next/image";
import { Shield, Users, LifeBuoy, ArrowLeft } from "lucide-react";

export default function AdminSidebar({ roleName, onNavigate }: { roleName: string, onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full w-full bg-[#0B1020]">
      <div className="h-20 shrink-0 flex items-center px-6 border-b border-[#27344B]">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2">
          <Image src="/logo.png" alt="KLYVOR" width={140} height={40} className="object-contain w-auto h-8" />
          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded ${roleName === 'OWNER' ? 'bg-[#7C5CFC]' : roleName === 'ADMIN' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'}`}>
            {roleName}
          </span>
        </Link>
      </div>
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white transition-colors">
          <Shield size={18} /> {roleName === 'OWNER' ? 'Owner' : roleName === 'ADMIN' ? 'Admin' : 'Support'} Overview
        </Link>
        <Link href="/admin/support" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white transition-colors">
          <LifeBuoy size={18} /> Support Tickets
        </Link>
        {(roleName === 'OWNER' || roleName === 'ADMIN') && (
          <Link href="/admin/users" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white transition-colors">
            <Users size={18} /> User Management
          </Link>
        )}
      </div>
      <div className="p-4 border-t border-[#27344B]">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:text-white transition-colors">
          <ArrowLeft size={18} /> Exit to App
        </Link>
      </div>
    </div>
  );
}
