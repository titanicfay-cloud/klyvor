import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Users, ArrowUpRight, ShieldCheck } from "lucide-react";

type DirectoryUser = {
  user_id: string;
  email: string | null;
  full_name: string;
  registered_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  last_active_at: string | null;
  account_status: string;
  account_role: string;
  plan_id: string | null;
  subscription_status: string | null;
  billing_interval: string | null;
  payment_provider: string | null;
  current_period_end: string | null;
  billing_visible: boolean;
  activity_visible: boolean;
};

function formatDate(value: string | null) {
  if (!value) return "Not recorded yet";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusStyle(status: string) {
  if (status === "active")
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

  if (status === "suspended")
    return "border-red-500/30 bg-red-500/10 text-red-400";

  if (status === "unconfirmed")
    return "border-amber-500/30 bg-amber-500/10 text-amber-400";

  return "border-[#475569] bg-[#1E293B] text-[#94A3B8]";
}

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
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

  const role = roleRow?.role;

  if (role !== "owner" && role !== "admin") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const query = (params.q || "").trim().slice(0, 100);

  const { data: users, error } = await supabase.rpc(
    "get_user_directory",
    {
      p_search: query || null,
      p_limit: 100,
    }
  );

  const rows = (users || []) as DirectoryUser[];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#27344B] bg-[#111A2E]">
              <Users className="h-5 w-5 text-[#00D4FF]" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D4FF]">
              KLYVOR PLATFORM MANAGEMENT
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            User Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94A3B8]">
            Search accounts, review account status and inspect available account activity.
          </p>
        </div>

        <div className="rounded-xl border border-[#27344B] bg-[#111A2E] px-4 py-3">
          <p className="text-xs text-[#64748B]">Accounts displayed</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            {rows.length}
          </p>
        </div>
      </header>

      <form method="GET" className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />

          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by name, email or user ID"
            className="h-12 w-full rounded-xl border border-[#27344B] bg-[#111A2E] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#64748B] focus:border-[#00D4FF]/60"
          />
        </div>

        <button
          type="submit"
          className="h-12 rounded-xl border border-[#00D4FF]/30 bg-[#00D4FF]/10 px-6 text-sm font-semibold text-[#00D4FF] transition-colors hover:bg-[#00D4FF]/15"
        >
          Search users
        </button>

        {query && (
          <Link
            href="/admin/users"
            className="flex h-12 items-center justify-center rounded-xl border border-[#27344B] px-5 text-sm text-[#94A3B8] hover:bg-[#111A2E]"
          >
            Clear
          </Link>
        )}
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
          <h2 className="font-semibold text-red-400">
            Unable to load users
          </h2>

          <p className="mt-2 text-sm text-[#94A3B8]">
            Your account may not have the required User Management permission, or the directory service may need attention.
          </p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[#27344B] bg-[#111A2E]">
          <div className="flex items-center justify-between border-b border-[#27344B] px-5 py-4">
            <div>
              <h2 className="font-semibold text-white">
                Account directory
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                Showing up to 100 most recently registered accounts
              </p>
            </div>

            <ShieldCheck className="h-5 w-5 text-[#00D4FF]" />
          </div>

          {rows.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-[#475569]" />

              <p className="font-medium text-white">
                No matching accounts
              </p>

              <p className="mt-1 text-sm text-[#64748B]">
                Try another name, email address or User ID.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="border-b border-[#27344B] bg-[#0B1020]/60">
                  <tr className="text-[11px] uppercase tracking-wider text-[#64748B]">
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">User ID</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold">Account status</th>
                    <th className="px-5 py-4 font-semibold">Registered</th>
                    <th className="px-5 py-4 font-semibold">Last active</th>
                    <th className="px-5 py-4 font-semibold">Last sign-in</th>
                    <th className="px-5 py-4 font-semibold">Plan</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#27344B]">
                  {rows.map((account) => (
                    <tr
                      key={account.user_id}
                      className="align-top transition-colors hover:bg-[#152039]/60"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">
                          {account.full_name || "Name not provided"}
                        </p>

                        {account.email ? (
                          <a
                            href={`mailto:${account.email}`}
                            className="mt-1 block text-xs text-[#00D4FF] hover:underline"
                          >
                            {account.email}
                          </a>
                        ) : (
                          <span className="mt-1 block text-xs text-[#64748B]">
                            No email
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/users/${account.user_id}`}
                          className="inline-flex items-center gap-1 font-mono text-xs text-[#00D4FF] hover:underline"
                        >
                          {account.user_id.slice(0, 8)}…
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-md border border-[#475569] bg-[#0B1020] px-2 py-1 text-xs font-semibold uppercase text-[#CBD5E1]">
                          {account.account_role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-md border px-2 py-1 text-xs font-medium capitalize ${statusStyle(account.account_status)}`}
                        >
                          {account.account_status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-[#94A3B8]">
                        {formatDate(account.registered_at)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-[#94A3B8]">
                        {account.activity_visible
                          ? formatDate(account.last_active_at)
                          : "Restricted"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-[#94A3B8]">
                        {formatDate(account.last_sign_in_at)}
                      </td>

                      <td className="px-5 py-4">
                        {account.billing_visible ? (
                          <div>
                            <p className="text-sm font-medium capitalize text-white">
                              {account.plan_id || "Unknown"}
                            </p>

                            <p className="mt-1 text-xs capitalize text-[#64748B]">
                              {account.subscription_status || "No subscription record"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-[#64748B]">
                            Restricted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
