import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Shield, Users, LifeBuoy, CreditCard } from "lucide-react";

export default async function AdminOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();

  // Fetch some basic stats
  const { count: userCount } = await supabase.from("user_roles").select("*", { count: "exact", head: true });
  const { count: ticketCount } = await supabase.from("support_requests").select("*", { count: "exact", head: true }).eq("status", "new");
  const { count: premiumCount } = await supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).neq("plan_id", "free").eq("status", "active");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
          <span className="text-xs font-bold bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-wider border border-primary/30">
            {role?.role || "Staff"}
          </span>
        </div>
        <p className="text-[#C7D0E0]">Welcome to the command center. Here is the current status of KLYVOR.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-[#64748B] font-medium mb-1">Total Users</p>
            <p className="text-3xl font-bold text-white">{userCount || 0}</p>
          </div>
          <Users className="w-8 h-8 text-[#00D4FF]" />
        </div>

        <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-[#64748B] font-medium mb-1">Open Tickets</p>
            <p className="text-3xl font-bold text-white">{ticketCount || 0}</p>
          </div>
          <LifeBuoy className="w-8 h-8 text-[#F59E0B]" />
        </div>

        <div className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-[#64748B] font-medium mb-1">Active Premium Users</p>
            <p className="text-3xl font-bold text-white">{premiumCount || 0}</p>
          </div>
          <CreditCard className="w-8 h-8 text-[#22C55E]" />
        </div>
      </div>
    </div>
  );
}
