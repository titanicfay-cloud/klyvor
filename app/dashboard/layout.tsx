import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Extract first name from metadata if it exists, otherwise use full name or email prefix
  const fullName = user.user_metadata?.full_name || "";
  const firstName = fullName.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-[#0B1020] flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col">
        <Header userEmail={user.email || ""} userName={firstName} />
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
