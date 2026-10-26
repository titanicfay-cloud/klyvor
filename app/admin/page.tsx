import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Shield, Users, LifeBuoy, CreditCard } from "lucide-react";

export default async function AdminOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();

  const { count: userCount } = await supabase.from("user_roles").select("*", { count: "exact", head: true });
  const { count: ticketCount } = await supabase.from("support_requests").select("*", { count: "exact", head: true }).eq("status", "new");
  const { count: premiumCount } = await supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).neq("plan_id", "free").eq("status", "active");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Owner & Admin Overview</h1>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">
            {role?.role || "Staff"}
          </span>
        </div>
        <p className="text-sm text-[#64748B]">Welcome to the command center. Here is the current status of KLYVOR.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-[#111A2E] border border-[#27344B] p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#64748B] font-medium mb-1">Total Users</p>
            <p className="text-2xl font-bold text-white">{userCount || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#0B1020] border border-[#27344B] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#00D4FF]" />
          </div>
        </div>

        <div className="bg-[#111A2E] border border-[#27344B] p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#64748B] font-medium mb-1">Open Tickets</p>
            <p className="text-2xl font-bold text-white">{ticketCount || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#0B1020] border border-[#27344B] flex items-center justify-center">
            <LifeBuoy className="w-5 h-5 text-[#F59E0B]" />
          </div>
        </div>

        <div className="bg-[#111A2E] border border-[#27344B] p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#64748B] font-medium mb-1">Premium Users</p>
            <p className="text-2xl font-bold text-white">{premiumCount || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#0B1020] border border-[#27344B] flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#22C55E]" />
          </div>
        </div>
      </div>
      
      {/* Placeholder for future charts */}
      <div className="mt-8 border border-dashed border-[#27344B] rounded-xl p-8 text-center bg-[#111A2E]/50">
        <Shield className="w-8 h-8 text-[#27344B] mx-auto mb-3" />
        <p className="text-sm text-[#64748B]">System analytics and charts will appear here as KLYVOR grows.</p>
      </div>
    </div>
  );
}
