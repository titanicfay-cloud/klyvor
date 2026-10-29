"use client";
import { Button } from "@/components/ui/button";
export default function SecurityForm({ setIsPasswordModalOpen, handleSignOutAll, signingOutAll }: any) {
  return (
    <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
      <div><h2 className="text-xl font-bold text-white mb-1">Security & Authentication</h2><p className="text-sm text-[#C7D0E0]">Protect your account and control how you access KLYVOR.</p></div>
      <div className="flex items-center justify-between p-4 bg-[#0B1020] border border-[#27344B] rounded-xl max-w-md"><div><p className="text-white">Password</p><p className="text-xs text-[#64748B]">••••••••••••</p></div><Button variant="outline" onClick={() => setIsPasswordModalOpen(true)} className="border-[#27344B] text-white">Change</Button></div>
      <div className="pt-4 border-t border-[#27344B] max-w-md"><h3 className="text-white font-semibold mb-2">Session Management</h3><Button onClick={handleSignOutAll} disabled={signingOutAll} className="bg-[#0B1020] border border-[#EF4444] text-[#EF4444]">{signingOutAll ? "Signing out..." : "Sign Out All"}</Button></div>
    </div>
  );
}
