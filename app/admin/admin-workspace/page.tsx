
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShieldCheck, Users, Settings2 } from "lucide-react";

export default async function AdminWorkspacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!roleRow || !["owner", "admin"].includes(roleRow.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#27344B] bg-[#111A2E]">
            <ShieldCheck className="h-5 w-5 text-[#00D4FF]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D4FF]">
              KLYVOR OPERATIONS
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Admin Workspace
            </h1>
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[#94A3B8]">
          Your dedicated operational workspace for responsibilities assigned by the Owner.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-6">
          <Users className="mb-4 h-6 w-6 text-[#00D4FF]" />
          <h2 className="text-lg font-semibold text-white">User Operations</h2>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            User administration tools will be enabled according to permissions granted by the Owner.
          </p>
          <p className="mt-4 text-xs font-medium text-[#64748B]">
            Permission-controlled access
          </p>
        </div>

        <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-6">
          <Settings2 className="mb-4 h-6 w-6 text-[#A78BFA]" />
          <h2 className="text-lg font-semibold text-white">Operational Controls</h2>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            Administrative tools will be enabled individually based on assigned permissions.
          </p>
          <p className="mt-4 text-xs font-medium text-[#64748B]">
            Owner-governed permissions
          </p>
        </div>
      </section>

      <div className="rounded-2xl border border-[#27344B] bg-[#0F172A] p-5">
        <h2 className="font-semibold text-white">Your administrative workspace</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Your access is separate from the Owner Command Centre and Support Workspace.
        </p>
      </div>
    </div>
  );
            }
