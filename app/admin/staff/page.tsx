
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ShieldCheck,
  Users,
  UserCog,
  RefreshCw,
  LockKeyhole,
  AlertCircle,
} from "lucide-react";

type StaffMember = {
  user_id: string;
  email: string | null;
  full_name: string;
  account_role: string;
  permissions: string[];
  registered_at: string;
};

const permissionOptions = [
  {
    key: "users.view",
    label: "View User Directory",
    description: "Access and view registered platform accounts.",
  },
  {
    key: "users.manage",
    label: "Manage Users",
    description: "Access permitted user-management operations.",
  },
  {
    key: "users.view_billing",
    label: "View Billing Information",
    description: "View subscription plans and billing information.",
  },
  {
    key: "users.view_activity",
    label: "View Account Activity",
    description: "View Last Active and account activity information.",
  },
  {
    key: "users.suspend",
    label: "Suspend Users",
    description: "Access permitted account-suspension operations.",
  },
];

export default function StaffManagementPage() {
  const [supabase] = useState(() => createClient());
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setIsOwner(false);
      setLoading(false);
      return;
    }

    const { data: roleRow, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleError || roleRow?.role !== "owner") {
      setIsOwner(false);
      setLoading(false);
      return;
    }

    setIsOwner(true);

    const { data, error } = await supabase.rpc(
      "get_staff_management_directory"
    );

    if (error) {
      setStaff([]);
      setMessage("Unable to load staff records: " + error.message);
      setMessageType("error");
    } else {
      setStaff((data || []) as StaffMember[]);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  async function changeRole(userId: string, role: string) {
    const member = staff.find((item) => item.user_id === userId);

    if (!member || member.account_role === "owner") return;

    const confirmed = window.confirm(
      `Are you sure you want to change this account's role to ${role.toUpperCase()}?`
    );

    if (!confirmed) return;

    setSaving(userId);
    setMessage("");

    const { error } = await supabase.rpc("set_staff_role", {
      p_user_id: userId,
      p_role: role,
    });

    if (error) {
      setMessage("Role update failed: " + error.message);
      setMessageType("error");
      setSaving(null);
      return;
    }

    setMessage("Account role updated successfully.");
    setMessageType("success");

    await loadStaff();
    setSaving(null);
  }

  async function changePermission(
    userId: string,
    permissionKey: string,
    enabled: boolean
  ) {
    const member = staff.find((item) => item.user_id === userId);

    if (!member || member.account_role !== "admin") return;

    const actionKey = `${userId}:${permissionKey}`;

    setSaving(actionKey);
    setMessage("");

    const { error } = await supabase.rpc("set_staff_permission", {
      p_user_id: userId,
      p_permission_key: permissionKey,
      p_enabled: enabled,
    });

    if (error) {
      setMessage("Permission update failed: " + error.message);
      setMessageType("error");
    } else {
      setStaff((current) =>
        current.map((item) =>
          item.user_id === userId
            ? {
                ...item,
                permissions: enabled
                  ? [...new Set([...item.permissions, permissionKey])]
                  : item.permissions.filter(
                      (permission) => permission !== permissionKey
                    ),
              }
            : item
        )
      );

      setMessage(
        enabled
          ? "Permission granted successfully."
          : "Permission revoked successfully."
      );
      setMessageType("success");
    }

    setSaving(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-[#00D4FF]" />
          <p className="text-sm text-[#94A3B8]">
            Loading staff records...
          </p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/5 p-7">
        <LockKeyhole className="mb-4 h-8 w-8 text-red-400" />
        <h1 className="text-xl font-bold text-white">
          Owner Access Required
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          Staff roles and permissions are reserved exclusively for the
          platform Owner.
        </p>
      </div>
    );
  }

  const ownerCount = staff.filter(
    (member) => member.account_role === "owner"
  ).length;

  const adminCount = staff.filter(
    (member) => member.account_role === "admin"
  ).length;

  const supportCount = staff.filter(
    (member) => member.account_role === "support"
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D4FF]">
            PLATFORM AUTHORITY
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Staff & Permissions
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94A3B8]">
            Control who operates KLYVOR and define the exact access
            permissions assigned to each administrator.
          </p>
        </div>

        <button
          type="button"
          onClick={loadStaff}
          disabled={loading || saving !== null}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#27344B] bg-[#111A2E] px-4 py-3 text-sm font-medium text-white transition hover:border-[#00D4FF]/50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh Records
        </button>
      </header>

      {message && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            messageType === "error"
              ? "border-red-500/30 bg-red-500/5 text-red-300"
              : "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
          }`}
        >
          {messageType === "error" ? (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          ) : (
            <ShieldCheck size={18} className="mt-0.5 shrink-0" />
          )}
          <span className="break-words">{message}</span>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
          <ShieldCheck className="mb-3 h-6 w-6 text-violet-400" />
          <p className="text-sm text-[#94A3B8]">Platform Owner</p>
          <p className="mt-1 text-3xl font-bold text-white">{ownerCount}</p>
        </div>

        <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
          <UserCog className="mb-3 h-6 w-6 text-[#00D4FF]" />
          <p className="text-sm text-[#94A3B8]">Administrators</p>
          <p className="mt-1 text-3xl font-bold text-white">{adminCount}</p>
        </div>

        <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
          <Users className="mb-3 h-6 w-6 text-amber-400" />
          <p className="text-sm text-[#94A3B8]">Support Staff</p>
          <p className="mt-1 text-3xl font-bold text-white">{supportCount}</p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Staff Accounts
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Manage staff roles and administrator permissions from one place.
          </p>
        </div>

        {staff.length === 0 ? (
          <div className="rounded-2xl border border-[#27344B] bg-[#111A2E] p-8 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-[#64748B]" />
            <p className="text-sm font-medium text-white">
              No staff accounts found
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              Staff accounts will appear here when roles are assigned.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {staff.map((member) => {
              const isPlatformOwner = member.account_role === "owner";

              return (
                <article
                  key={member.user_id}
                  className="space-y-5 rounded-2xl border border-[#27344B] bg-[#111A2E] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words text-base font-semibold text-white">
                          {member.full_name || "Name not provided"}
                        </h3>

                        <span className="rounded-md border border-[#27344B] bg-[#0B1020] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00D4FF]">
                          {member.account_role}
                        </span>
                      </div>

                      <p className="mt-2 break-all text-sm text-[#94A3B8]">
                        {member.email || "No email address"}
                      </p>

                      <p className="mt-2 break-all font-mono text-xs text-[#64748B]">
                        {member.user_id}
                      </p>

                      <p className="mt-2 text-xs text-[#64748B]">
                        Registered:{" "}
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(new Date(member.registered_at))}
                      </p>
                    </div>

                    {!isPlatformOwner && (
                      <div className="w-full shrink-0 lg:w-56">
                        <label
                          htmlFor={`role-${member.user_id}`}
                          className="mb-2 block text-xs font-medium text-[#94A3B8]"
                        >
                          Change Account Role
                        </label>

                        <select
                          id={`role-${member.user_id}`}
                          value={member.account_role}
                          disabled={saving === member.user_id || saving !== null}
                          onChange={(event) =>
                            changeRole(member.user_id, event.target.value)
                          }
                          className="w-full rounded-xl border border-[#27344B] bg-[#0B1020] px-3 py-3 text-sm text-white outline-none transition focus:border-[#00D4FF] disabled:opacity-50"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="support">Support</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {member.account_role === "admin" && (
                    <div className="border-t border-[#27344B] pt-5">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-white">
                          Administrator Permissions
                        </h4>
                        <p className="mt-1 text-xs leading-5 text-[#64748B]">
                          Grant or revoke each permission independently.
                          Changes are recorded in the staff administration
                          audit log.
                        </p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {permissionOptions.map((permission) => {
                          const checked =
                            member.permissions?.includes(permission.key) ||
                            false;

                          const actionKey =
                            `${member.user_id}:${permission.key}`;

                          return (
                            <label
                              key={permission.key}
                              className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#27344B] bg-[#0B1020] p-4 transition hover:border-[#00D4FF]/40"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={saving !== null}
                                onChange={(event) =>
                                  changePermission(
                                    member.user_id,
                                    permission.key,
                                    event.target.checked
                                  )
                                }
                                className="mt-1 h-4 w-4 shrink-0 accent-[#00D4FF]"
                              />

                              <span className="min-w-0">
                                <span className="block text-sm font-medium text-white">
                                  {permission.label}
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-[#64748B]">
                                  {permission.description}
                                </span>
                                {saving === actionKey && (
                                  <span className="mt-2 block text-xs text-[#00D4FF]">
                                    Updating...
                                  </span>
                                )}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {member.account_role === "support" && (
                    <div className="border-t border-[#27344B] pt-4">
                      <p className="text-xs leading-5 text-[#94A3B8]">
                        This account has Support Workspace access. Admin
                        permissions are not assigned to Support accounts.
                      </p>
                    </div>
                  )}

                  {isPlatformOwner && (
                    <div className="border-t border-[#27344B] pt-4">
                      <p className="text-xs leading-5 text-[#00D4FF]">
                        Protected Owner account. Role and ownership authority
                        cannot be modified through staff management.
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
