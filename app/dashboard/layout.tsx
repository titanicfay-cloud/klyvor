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
  const { data: sub } = await supabase.from("user_subscriptions").select("plan_id, status").eq("user_id", user.id).single();
  const planId = (sub?.status === "active" ? sub?.plan_id : "free") || "free";

  return (
    <div className="min-h-screen bg-[#0B1020] flex w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 w-full">
        <Header userEmail={user.email || ""} userName={fullName} planId={planId} />
        <main className="flex-1 p-4 sm:p-8 w-full overflow-x-hidden">{children}</main>
      </div>
      <SupportWidget />
    </div>
  );
}
