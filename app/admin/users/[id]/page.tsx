
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  ShieldCheck,
  Clock3,
  CreditCard,
  CalendarDays,
  Mail,
  Activity,
} from "lucide-react";

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
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function DetailCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1020]">
        <Icon className="h-5 w-5 text-[#00D4FF]" />
      </div>

      <p className="text-xs font-medium text-[#64748B]">{title}</p>
      <p className="mt-2 break-words text-lg font-semibold text-white">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs text-[#64748B]">{description}</p>
      )}
    </div>
  );
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

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

  if (!["owner", "admin"].includes(roleRow?.role || "")) {
    redirect("/dashboard");
  }

  const { data, error } = await supabase.rpc(
    "get_user_directory",
    {
      p_search: id,
      p_limit: 1,
    }
  );

  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
        <h1 className="text-xl font-bold text-red-400">
          Unable to load account
        </h1>
        <p className="mt-2 text-sm text-[#94A3B8]">
          Your access permission or the account directory service needs attention.
        </p>
        <Link
          href="/admin/users"
          className="mt-5 inline-flex items-center gap-2 text-sm text-[#00D4FF]"
        >
          <ArrowLeft size={16} />
          Back to User Management
        </Link>
      </div>
    );
  }

  const account = (data || []).find(
    (item: DirectoryUser) => item.user_id === id
  ) as DirectoryUser | undefined;

  if (!account) notFound();

  const statusColor =
    account.account_status === "active"
      ? "text-emerald-400"
      : account.account_status === "suspended"
        ? "text-red-400"
        : "text-amber-400";

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-[#94A3B8] transition-colors hover:text-[#00D4FF]"
      >
        <ArrowLeft size={16} />
        Back to User Management
      </Link>

      <header className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#27344B] bg-[#0B1020]">
              <UserRound className="h-8 w-8 text-[#00D4FF]" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00D4FF]">
                ACCOUNT PROFILE
              </p>

              <h1 className="mt-1 break-words text-2xl font-bold text-white">
                {account.full_name || "Name not provided"}
              </h1>

              <p className="mt-1 break-all text-sm text-[#94A3B8]">
                {account.email || "No email address"}
              </p>
            </div>
          </div>

          <span className={`w-fit rounded-lg border border-[#27344B] bg-[#0B1020] px-3 py-2 text-xs font-bold uppercase ${statusColor}`}>
            {account.account_status}
          </span>
        </div>

        <div className="mt-7 border-t border-[#27344B] pt-5">
          <p className="text-xs text-[#64748B]">User ID</p>
          <p className="mt-2 break-all font-mono text-sm text-[#CBD5E1]">
            {account.user_id}
          </p>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Account information
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Identity, registration and verification details.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailCard
            title="Account role"
            value={account.account_role}
            description="Current platform access role"
            icon={ShieldCheck}
          />

          <DetailCard
            title="Registration date"
            value={formatDate(account.registered_at)}
            icon={CalendarDays}
          />

          <DetailCard
            title="Email verification"
            value={
              account.email_confirmed_at
                ? "Confirmed"
                : "Not confirmed"
            }
            description={formatDate(account.email_confirmed_at)}
            icon={Mail}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Account activity
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Last Active and Last Sign-in are tracked separately.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailCard
            title="Last active"
            value={
              account.activity_visible
                ? formatDate(account.last_active_at)
                : "Restricted"
            }
            description="Most recent tracked authenticated app request"
            icon={Activity}
          />

          <DetailCard
            title="Last sign-in"
            value={formatDate(account.last_sign_in_at)}
            description="Authentication sign-in timestamp"
            icon={Clock3}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Subscription overview
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Current subscription information, subject to billing permissions.
          </p>
        </div>

        {account.billing_visible ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailCard
              title="Current plan"
              value={account.plan_id || "No record"}
              description="Recorded subscription plan"
              icon={CreditCard}
            />

            <DetailCard
              title="Subscription status"
              value={account.subscription_status || "No record"}
              icon={ShieldCheck}
            />

            <DetailCard
              title="Billing interval"
              value={account.billing_interval || "Not available"}
              icon={CalendarDays}
            />

            <DetailCard
              title="Payment provider"
              value={account.payment_provider || "Not available"}
              icon={CreditCard}
            />

            <DetailCard
              title="Current period ends"
              value={formatDate(account.current_period_end)}
              icon={Clock3}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-6">
            <p className="text-sm text-[#94A3B8]">
              Billing information is restricted for your current permission level.
            </p>
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-[#27344B] bg-[#0F172A] p-5">
        <p className="text-sm font-semibold text-white">
          Additional account records
        </p>
        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          Usage analytics, subscription history, account events, role changes
          and administrative actions will be added to this profile in the next
          stages.
        </p>
      </div>
    </div>
  );
}
