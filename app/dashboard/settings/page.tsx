
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLoading } from "@/components/ui/states";
import { toast } from "sonner";

import {
  ArrowDownToLine,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  FileJson,
  Fingerprint,
  Globe2,
  KeyRound,
  LifeBuoy,
  LockKeyhole,
  Mail,
  MonitorSmartphone,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  AlertTriangle,
} from "lucide-react";

const TABS = [
  { id: "profile", label: "Personal profile", description: "Your identity and account details", icon: UserRound },
  { id: "security", label: "Security & access", description: "Password and active sessions", icon: ShieldCheck },
  { id: "preferences", label: "Workspace preferences", description: "Regional settings and communication", icon: SlidersHorizontal },
  { id: "support", label: "Support history", description: "Your conversations with KLYVOR", icon: LifeBuoy },
  { id: "data", label: "Data & privacy", description: "Access and export your information", icon: FileJson },
];

const panel = "rounded-2xl border border-[#27344B] bg-[#111A2E]";
const labelClass = "mb-2 block text-sm font-medium text-[#C7D0E0]";
const fieldClass = "h-11 w-full rounded-lg border border-[#27344B] bg-[#0B1020] px-3 text-sm text-white outline-none transition placeholder:text-[#64748B] focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/10 disabled:opacity-60";

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [productUpdates, setProductUpdates] = useState(false);
  const [tipsGuidance, setTipsGuidance] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [tickets, setTickets] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);

  const activeTab = TABS.find((item) => item.id === tab) || TABS[0];

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const { data: { user }, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          router.replace("/login");
          return;
        }

        if (!active) return;

        setEmail(user.email || "");
        setUserId(user.id);
        setFullName(user.user_metadata?.full_name || "");

        const { data: prefs, error: prefsError } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (prefsError) throw prefsError;

        if (prefs) {
          setTimezone(prefs.timezone || "UTC");
          setDateFormat(prefs.date_format || "DD/MM/YYYY");
          setProductUpdates(!!prefs.product_updates);
          setTipsGuidance(!!prefs.tips_and_guidance);
        } else {
          const { error } = await supabase
            .from("user_preferences")
            .insert([{ user_id: user.id }]);

          if (error) throw error;
        }

        const { data: rows, error: ticketError } = await supabase
          .from("support_requests")
          .select("*")
          .eq("email", user.email || "")
          .order("created_at", { ascending: false });

        if (ticketError) throw ticketError;
        if (active) setTickets(rows || []);
      } catch (error: any) {
        console.error("Settings loading error:", error);
        toast.error(error.message || "Unable to load your settings.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, [supabase, router]);

  const saveName = async () => {
    const name = fullName.trim();

    if (!name) return toast.error("Please enter your name.");

    setSavingName(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    setSavingName(false);

    if (error) toast.error(error.message);
    else {
      toast.success("Your profile has been updated.");
      router.refresh();
    }
  };

  const savePassword = async () => {
    if (password.length < 8) {
      return toast.error("Use at least 8 characters.");
    }
    if (password !== confirm) {
      return toast.error("Your passwords do not match.");
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);

    if (error) toast.error(error.message);
    else {
      toast.success("Your password has been updated.");
      setPassword("");
      setConfirm("");
    }
  };

  const signOutOthers = async () => {
    if (!window.confirm(
      "This will sign you out on every device, including this one. Continue?"
    )) return;

    const { error } = await supabase.auth.signOut({ scope: "global" });

    if (error) toast.error(error.message);
    else window.location.href = "/login";
  };

  const savePrefs = async () => {
    setSavingPrefs(true);

    const { error } = await supabase
      .from("user_preferences")
      .update({
        timezone,
        date_format: dateFormat,
        product_updates: productUpdates,
        tips_and_guidance: tipsGuidance,
      })
      .eq("user_id", userId);

    setSavingPrefs(false);

    if (error) toast.error(error.message);
    else toast.success("Workspace preferences saved.");
  };

  const exportData = async () => {
    setExporting(true);

    try {
      const pull = async (table: string, column: string) => {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq(column, userId);

        if (error) throw error;
        return data || [];
      };

      const [
        tasks, documents, calculations, projects, clients,
        invoices, expenses, proposals, resumes, timeEntries,
      ] = await Promise.all([
        pull("tasks", "user_id"),
        pull("documents", "user_id"),
        pull("pricing_calculations", "user_id"),
        pull("projects", "user_id"),
        pull("clients", "user_id"),
        pull("invoices", "user_id"),
        pull("expenses", "created_by"),
        pull("proposals", "user_id"),
        pull("resumes", "user_id"),
        pull("time_entries", "user_id"),
      ]);

      const payload = {
        platform: "KLYVOR",
        exported_at: new Date().toISOString(),
        profile: { name: fullName, email, user_id: userId },
        preferences: {
          timezone, dateFormat, productUpdates, tipsGuidance,
        },
        tasks,
        documents,
        pricing_calculations: calculations,
        projects,
        clients,
        invoices,
        expenses,
        proposals,
        resumes,
        time_entries: timeEntries,
        support_requests: tickets,
      };

      const file = new Blob(
        [JSON.stringify(payload, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "klyvor-data-export.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success("Your data export has been prepared.");
    } catch (error: any) {
      console.error("Data export error:", error);
      toast.error(error.message || "Unable to export your data.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <PageLoading label="Preparing your workspace settings..." />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7 pb-24">

      {/* KLYVOR SETTINGS INTRO */}
      <section className="relative overflow-hidden rounded-2xl border border-[#27344B] bg-[#111A2E] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#00D4FF]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-1/4 h-56 w-56 rounded-full bg-[#7C5CFC]/[0.09] blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00D4FF]/20 bg-[#00D4FF]/10">
                <SlidersHorizontal size={15} className="text-[#00D4FF]" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00D4FF]">
                Workspace control
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Account & Settings
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#94A3B8]">
              Your workspace, your preferences, your control.
              Configure your KLYVOR experience from one place.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#27344B] bg-[#0B1020]/70 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/10">
              <UserRound size={18} className="text-[#00D4FF]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {fullName || "KLYVOR Member"}
              </p>
              <p className="truncate text-xs text-[#64748B]">{email}</p>
            </div>
            <ShieldCheck size={17} className="ml-2 shrink-0 text-[#22C55E]" />
          </div>
        </div>
      </section>

      {/* SETTINGS NAVIGATION AND CONTENT */}
      <div className="grid gap-6 lg:grid-cols-[245px_minmax(0,1fr)]">

        <aside className="space-y-3">
          <p className="hidden px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#64748B] lg:block">
            Account control
          </p>

          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map((item) => {
              const Icon = item.icon;
              const selected = tab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`group flex shrink-0 items-center gap-3 rounded-xl border p-3 text-left transition-all lg:w-full ${
                    selected
                      ? "border-[#00D4FF]/30 bg-[#00D4FF]/[0.08] shadow-[inset_2px_0_0_#00D4FF]"
                      : "border-transparent hover:border-[#27344B] hover:bg-[#111A2E]"
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    selected
                      ? "bg-[#00D4FF]/15 text-[#00D4FF]"
                      : "bg-[#111A2E] text-[#64748B] group-hover:text-[#C7D0E0]"
                  }`}>
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`whitespace-nowrap text-sm font-medium ${
                      selected ? "text-white" : "text-[#94A3B8]"
                    }`}>
                      {item.label}
                    </p>
                    <p className="mt-0.5 hidden text-[11px] text-[#64748B] lg:block">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight size={15} className={`hidden lg:block ${
                    selected ? "text-[#00D4FF]" : "text-[#475569]"
                  }`} />
                </button>
              );
            })}
          </nav>

          <Link
            href="/dashboard/settings/billing"
            className="group flex items-center gap-3 rounded-xl border border-[#27344B] bg-[#111A2E] p-3 transition-all hover:border-[#7C5CFC]/40 hover:bg-[#7C5CFC]/[0.05]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C5CFC]/10 text-[#A78BFA]">
              <CreditCard size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">Billing & plans</p>
              <p className="text-[11px] text-[#64748B]">Manage your subscription</p>
            </div>
            <ArrowRight size={15} className="text-[#64748B] transition-transform group-hover:translate-x-1 group-hover:text-[#A78BFA]" />
          </Link>

          <div className="hidden rounded-xl border border-[#27344B] bg-[#111A2E]/60 p-4 lg:block">
            <div className="mb-2 flex items-center gap-2">
              <LockKeyhole size={14} className="text-[#00D4FF]" />
              <span className="text-xs font-semibold text-[#C7D0E0]">
                Your workspace. Your data.
              </span>
            </div>
            <p className="text-xs leading-5 text-[#64748B]">
              Your account information and workspace records remain
              subject to your account permissions.
            </p>
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <div className="flex items-center justify-between gap-3 border-b border-[#27344B] pb-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#00D4FF]">
                <span>KLYVOR</span>
                <span className="text-[#475569]">/</span>
                <span className="text-[#64748B]">{activeTab.label}</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {activeTab.label}
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                {activeTab.description}
              </p>
            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[#27344B] bg-[#111A2E] sm:flex">
              <activeTab.icon size={18} className="text-[#00D4FF]" />
            </div>
          </div>

          {/* STEP 3 CONTINUES HERE */}

          {/* PERSONAL PROFILE */}
          {tab === "profile" && (
            <div className="space-y-5">
              <section className={`${panel} overflow-hidden`}>
                <div className="border-b border-[#27344B] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Fingerprint size={19} className="text-[#00D4FF]" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Personal information</h3>
                      <p className="text-xs text-[#64748B]">Your KLYVOR account identity</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  <div>
                    <label className={labelClass}>Full name</label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className={fieldClass}
                    />
                    <p className="mt-2 text-xs text-[#64748B]">
                      The name associated with your workspace identity.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Login email address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                      <Input value={email} disabled className={`${fieldClass} pl-10`} />
                      <LockKeyhole size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    </div>
                    <p className="mt-2 text-xs text-[#64748B]">
                      Your login email cannot be changed from this page.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#27344B] pt-5">
                    <p className="text-xs text-[#64748B]">Your changes update your account profile.</p>
                    <Button onClick={saveName} disabled={savingName} className="bg-klyvor-gradient text-white hover:opacity-90">
                      {savingName ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </div>
              </section>

              <section className={`${panel} p-5 sm:p-6`}>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={19} className="mt-1 text-[#22C55E]" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">Account identifier</h3>
                    <p className="mt-1 text-sm leading-6 text-[#94A3B8]">
                      Your unique account reference within KLYVOR.
                    </p>
                    <p className="mt-3 break-all rounded-lg border border-[#27344B] bg-[#0B1020] px-3 py-2 font-mono text-[11px] text-[#64748B]">
                      {userId}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* SECURITY & ACCESS */}
          {tab === "security" && (
            <div className="space-y-5">
              <section className={`${panel} overflow-hidden`}>
                <div className="border-b border-[#27344B] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <KeyRound size={19} className="text-[#00D4FF]" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Password management</h3>
                      <p className="text-xs text-[#64748B]">Keep your account access secure</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  <div>
                    <label className={labelClass}>New password</label>
                    <Input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a new password" className={fieldClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Confirm new password</label>
                    <Input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm your new password" className={fieldClass} />
                  </div>

                  <div className="flex items-start gap-2 rounded-lg border border-[#27344B] bg-[#0B1020]/70 p-3">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#00D4FF]" />
                    <p className="text-xs leading-5 text-[#94A3B8]">
                      Use at least 8 characters and avoid reusing passwords from other services.
                    </p>
                  </div>

                  <div className="flex justify-end border-t border-[#27344B] pt-5">
                    <Button onClick={savePassword} disabled={savingPassword || !password || !confirm} className="bg-klyvor-gradient text-white hover:opacity-90">
                      {savingPassword ? "Updating..." : "Update password"}
                    </Button>
                  </div>
                </div>
              </section>

              <section className={`${panel} overflow-hidden`}>
                <div className="border-b border-[#27344B] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <MonitorSmartphone size={19} className="text-[#F87171]" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Session control</h3>
                      <p className="text-xs text-[#64748B]">Manage access across your devices</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-sm font-medium text-white">Sign out everywhere</p>
                    <p className="mt-1 max-w-md text-xs leading-5 text-[#94A3B8]">
                      End your authenticated sessions across devices. You will need to sign in again.
                    </p>
                  </div>
                  <Button onClick={signOutOthers} variant="outline" className="shrink-0 border-[#7F303B] bg-[#EF4444]/[0.06] text-[#F87171] hover:bg-[#EF4444]/10 hover:text-white">
                    Sign out everywhere
                  </Button>
                </div>
              </section>
            </div>
          )}

          {/* WORKSPACE PREFERENCES */}
          {tab === "preferences" && (
            <div className="space-y-5">
              <section className={`${panel} overflow-hidden`}>
                <div className="border-b border-[#27344B] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Globe2 size={19} className="text-[#A78BFA]" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Regional configuration</h3>
                      <p className="text-xs text-[#64748B]">Set your preferred time and date conventions</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  <div>
                    <label className={labelClass}>Time zone</label>
                    <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Africa/Lagos" className={fieldClass} />
                    <p className="mt-2 text-xs text-[#64748B]">
                      Use an IANA time zone, such as Africa/Lagos or Europe/London.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Date format</label>
                    <div className="relative">
                      <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                      <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className={`${fieldClass} appearance-none pl-10`}>
                        <option value="DD/MM/YYYY">DD/MM/YYYY — 18/11/2026</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY — 11/18/2026</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD — 2026-11-18</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <section className={`${panel} overflow-hidden`}>
                <div className="border-b border-[#27344B] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Sparkles size={19} className="text-[#00D4FF]" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Communication preferences</h3>
                      <p className="text-xs text-[#64748B]">Choose the updates you want to receive</p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-[#27344B] px-5 sm:px-6">
                  <label className="flex cursor-pointer items-start justify-between gap-4 py-5">
                    <div>
                      <p className="text-sm font-medium text-white">Product updates</p>
                      <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
                        New features, improvements and platform announcements.
                      </p>
                    </div>
                    <input type="checkbox" checked={productUpdates} onChange={(e) => setProductUpdates(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#00D4FF]" />
                  </label>

                  <label className="flex cursor-pointer items-start justify-between gap-4 py-5">
                    <div>
                      <p className="text-sm font-medium text-white">Tips & guidance</p>
                      <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
                        Practical guidance for getting more from your workspace.
                      </p>
                    </div>
                    <input type="checkbox" checked={tipsGuidance} onChange={(e) => setTipsGuidance(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#00D4FF]" />
                  </label>
                </div>

                <div className="flex justify-end border-t border-[#27344B] p-5 sm:px-6">
                  <Button onClick={savePrefs} disabled={savingPrefs} className="bg-klyvor-gradient text-white hover:opacity-90">
                    {savingPrefs ? "Saving..." : "Save preferences"}
                  </Button>
                </div>
              </section>
            </div>
          )}

          {/* SUPPORT HISTORY */}
          {tab === "support" && (
            <section className={`${panel} overflow-hidden`}>
              <div className="border-b border-[#27344B] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <LifeBuoy size={19} className="text-[#00D4FF]" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Your support history</h3>
                    <p className="text-xs text-[#64748B]">A record of your submitted requests</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#27344B] bg-[#0B1020]/70 p-4">
                  <div>
                    <p className="text-sm font-medium text-white">Need assistance?</p>
                    <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
                      Submit a new request using the floating support button in your workspace.
                    </p>
                  </div>
                  <LifeBuoy size={21} className="shrink-0 text-[#00D4FF]" />
                </div>

                {tickets.length === 0 ? (
                  <div className="flex flex-col items-center rounded-xl border border-dashed border-[#27344B] px-5 py-12 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#27344B] bg-[#0B1020]">
                      <LifeBuoy size={23} className="text-[#64748B]" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">No support requests yet</h4>
                    <p className="mt-2 max-w-sm text-xs leading-5 text-[#64748B]">
                      Your conversations with the KLYVOR support team will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="rounded-xl border border-[#27344B] bg-[#0B1020]/70 p-4 transition-colors hover:border-[#3A4B66]">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="break-words text-sm font-semibold text-white">
                              {ticket.subject || "Support request"}
                            </h4>
                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#94A3B8]">
                              {ticket.message}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full border border-[#27344B] bg-[#111A2E] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                            {ticket.status || "Open"}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 border-t border-[#27344B] pt-3 text-[11px] text-[#64748B]">
                          <CalendarDays size={12} />
                          {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "Date unavailable"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* DATA & PRIVACY */}
          {tab === "data" && (
            <div className="space-y-5">
              <section className={`${panel} overflow-hidden`}>
                <div className="border-b border-[#27344B] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Download size={19} className="text-[#00D4FF]" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Your information</h3>
                      <p className="text-xs text-[#64748B]">Access a portable copy of your workspace records</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Your data, in your hands</h4>
                    <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                      Prepare a downloadable JSON file containing your profile, preferences and available workspace records.
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "Tasks and documents",
                      "Projects and clients",
                      "Invoices and expenses",
                      "Pricing calculations",
                      "Proposals and resumes",
                      "Time entries and support requests",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 rounded-lg border border-[#27344B] bg-[#0B1020]/70 px-3 py-2.5">
                        <Check size={14} className="shrink-0 text-[#00D4FF]" />
                        <span className="text-xs text-[#C7D0E0]">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 rounded-xl border border-[#27344B] bg-[#0B1020]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C5CFC]/10 text-[#A78BFA]">
                        <FileJson size={19} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">KLYVOR data export</p>
                        <p className="text-xs text-[#64748B]">JSON · Machine-readable format</p>
                      </div>
                    </div>
                    <Button onClick={exportData} disabled={exporting} className="shrink-0 bg-klyvor-gradient text-white hover:opacity-90">
                      <ArrowDownToLine size={16} className="mr-2" />
                      {exporting ? "Preparing..." : "Export data"}
                    </Button>
                  </div>
                </div>
              </section>

              <section className={`${panel} p-5 sm:p-6`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="mt-1 shrink-0 text-[#FBBF24]" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Keep your export secure</h3>
                    <p className="mt-1 text-xs leading-6 text-[#94A3B8]">
                      Your export may contain personal and business information. Store downloaded files somewhere secure. The export includes records returned by the available account queries.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
