import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LifeBuoy,
  MessageSquareText,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default async function SupportWorkspacePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!roleRow || !["owner", "support"].includes(roleRow.role)) {
    redirect("/dashboard");
  }

  const { count: openTickets } = await supabase
    .from("support_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#27344B] bg-[#111A2E]">
            <LifeBuoy className="h-5 w-5 text-[#F59E0B]" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F59E0B]">
              KLYVOR CUSTOMER CARE
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Support Workspace
            </h1>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-[#94A3B8]">
          A focused workspace for handling customer requests, tracking issues
          and escalating matters that need Owner attention.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-6">
          <p className="text-sm text-[#94A3B8]">New support requests</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-white">
            {openTickets ?? 0}
          </p>
          <p className="mt-2 text-xs text-[#64748B]">
            Requests currently marked as new
          </p>
        </div>

        <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-6">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1020]">
            <ShieldAlert className="h-5 w-5 text-[#F59E0B]" />
          </div>

          <h2 className="font-semibold text-white">
            Escalation-first support
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            Account, billing, security and ownership-sensitive issues should
            be escalated rather than handled with elevated access.
          </p>
        </div>
      </section>

      <Link
        href="/admin/support"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-[#27344B] bg-[#111A2E] p-5 transition-colors hover:border-[#F59E0B]/50 hover:bg-[#152039]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1020]">
            <MessageSquareText className="h-5 w-5 text-[#F59E0B]" />
          </div>

          <div>
            <h2 className="font-semibold text-white">Open support inbox</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Review and respond to customer requests.
            </p>
          </div>
        </div>

        <ArrowRight className="h-5 w-5 text-[#94A3B8] transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
