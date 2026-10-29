"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileForm({ user, fullName, setFullName, userRole, handleSaveProfile, savingProfile }: any) {
  return (
    <div className="animate-in fade-in">
      <div className="h-32 bg-klyvor-gradient opacity-80 w-full"></div>
      <div className="p-6 sm:p-8 relative">
        <div className="absolute -top-12 sm:-top-16 left-6 sm:left-8 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#0B1020] border-4 border-[#111A2E] flex items-center justify-center text-primary text-4xl font-bold shadow-xl">{fullName ? fullName.substring(0, 2).toUpperCase() : "KL"}</div>
        <div className="mt-14 sm:mt-20">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-white">{fullName || "User"}</h2>
            {userRole !== "user" && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${userRole === 'owner' ? 'bg-[#7C5CFC] text-white' : userRole === 'admin' ? 'bg-[#EF4444] text-white' : 'bg-[#F59E0B] text-white'}`}>{userRole}</span>}
          </div>
          <p className="text-sm text-[#64748B] mb-6">{user?.email}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
            <div className="space-y-2"><Label>Email</Label><Input disabled value={user?.email || ""} className="bg-[#0B1020] border-[#27344B] text-[#64748B]" /></div>
          </div>
          <Button onClick={handleSaveProfile} disabled={savingProfile} className="mt-6 bg-klyvor-gradient text-white w-full sm:w-auto">{savingProfile ? "Saving..." : "Update Profile"}</Button>
        </div>
      </div>
    </div>
  );
}
