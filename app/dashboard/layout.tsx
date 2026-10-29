import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import SupportWidget from "@/components/support/SupportWidget";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = user.user_metadata?.full_name || "User";
  
  const [subRes, roleRes] = await Promise.all([
    supabase.from("user_subscriptions").select("plan_id, status").eq("user_id", user.id).single(),
    supabase.from("user_roles").select("role").eq("user_id", user.id).single()
  ]);

  const planId = (subRes.data?.status === "active" ? subRes.data?.plan_id : "free") || "free";
  const role = roleRes.data?.role || "user";

  return (
    <div className="min-h-screen bg-[#0B1020] flex w-full overflow-x-hidden">
      <Sidebar role={role} planId={planId} />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 w-full">
        <Header userEmail={user.email || ""} userName={fullName} planId={planId} role={role} />
        <main className="flex-1 p-4 sm:p-8 w-full overflow-x-hidden">{children}</main>
      </div>
      <SupportWidget />
    </div>
  );
}
