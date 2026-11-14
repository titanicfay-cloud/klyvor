"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLoading } from "@/components/ui/states";
import { toast } from "sonner";
import { CreditCard, Download, LifeBuoy, Settings, Shield, User } from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Settings },
  { id: "support", label: "Support", icon: LifeBuoy },
  { id: "data", label: "Your data", icon: Download },
];

export default function SettingsPage() {
  const supabase = createClient();
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

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email || "");
      setUserId(user.id);
      setFullName(user.user_metadata?.full_name || "");
      const { data: prefs } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle();
      if (prefs) {
        setTimezone(prefs.timezone || "UTC");
        setDateFormat(prefs.date_format || "DD/MM/YYYY");
        setProductUpdates(!!prefs.product_updates);
        setTipsGuidance(!!prefs.tips_and_guidance);
      } else {
        await supabase.from("user_preferences").insert([{ user_id: user.id }]);
      }
      const { data: rows } = await supabase.from("support_requests").select("*").eq("email", user.email).order("created_at", { ascending: false });
      setTickets(rows || []);
      setLoading(false);
    };
    load();
  }, []);

  const saveName = async () => {
    const name = fullName.trim();
    if (!name) return toast.error("Name cannot be empty.");
    setSavingName(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    setSavingName(false);
    if (error) toast.error(error.message);
    else { toast.success("Name saved."); router.refresh(); }
  };

  const savePassword = async () => {
    if (password.length < 8) return toast.error("Use at least 8 characters.");
    if (password !== confirm) return toast.error("Passwords do not match.");
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) toast.error(error.message);
    else { toast.success("Password updated."); setPassword(""); setConfirm(""); }
  };

  const signOutOthers = async () => {
    if (!confirm("This signs you out on every device, including this one.")) return;
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) toast.error(error.message);
    else window.location.href = "/login";
  };

  const savePrefs = async () => {
    setSavingPrefs(true);
    const { error } = await supabase.from("user_preferences").update({
      timezone,
      date_format: dateFormat,
      product_updates: productUpdates,
      tips_and_guidance: tipsGuidance,
    }).eq("user_id", userId);
    setSavingPrefs(false);
    if (error) toast.error(error.message);
    else toast.success("Preferences saved.");
  };

  const exportData = async () => {
    setExporting(true);
    const pull = async (table: string, column: string) => {
      const { data, error } = await supabase.from(table).select("*").eq(column, userId);
      return error ? [] : data || [];
    };
    const payload = {
      exported_at: new Date().toISOString(),
      profile: { name: fullName, email, user_id: userId },
      preferences: { timezone, dateFormat, productUpdates, tipsGuidance },
      tasks: await pull("tasks", "user_id"),
      documents: await pull("documents", "user_id"),
      pricing_calculations: await pull("pricing_calculations", "user_id"),
      projects: await pull("projects", "user_id"),
      clients: await pull("clients", "user_id"),
      invoices: await pull("invoices", "user_id"),
      expenses: await pull("expenses", "created_by"),
      proposals: await pull("proposals", "user_id"),
      resumes: await pull("resumes", "user_id"),
      time_entries: await pull("time_entries", "user_id"),
      support_requests: tickets,
    };
    const file = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "klyvor-data.json";
    link.click();
    setExporting(false);
    toast.success("Download started.");
  };

  if (loading) return <PageLoading label="Loading settings..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div className="flex gap-2 overflow-x-auto border-b border-[#27344B]">
        {TABS.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm ${tab === item.id ? "border-[#00D4FF] text-[#00D4FF]" : "border-transparent text-[#64748B]"}`}>
            <item.icon size={15} /> {item.label}
          </button>
        ))}
        <Link href="/dashboard/settings/billing" className="flex shrink-0 items-center gap-2 px-3 py-3 text-sm text-[#64748B]"><CreditCard size={15} /> Billing</Link>
      </div>

      {tab === "profile" && (
        <section className="space-y-4 rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
          <h2 className="text-lg font-bold text-white">Profile</h2>
          <label className="block text-sm text-[#C7D0E0]">Name<input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-[#27344B] bg-[#0B1020] px-3 text-white" /></label>
          <label className="block text-sm text-[#C7D0E0]">Login email<input value={email} disabled className="mt-1 h-11 w-full rounded-md border border-[#27344B] bg-[#0B1020] px-3 text-[#64748B]" /></label>
          <p className="text-xs text-[#64748B]">Email is your login. It is not editable here.</p>
          <p className="break-all text-xs text-[#64748B]">User id: {userId}</p>
          <Button onClick={saveName} disabled={savingName} className="bg-klyvor-gradient text-white">{savingName ? "Saving..." : "Save name"}</Button>
        </section>
      )}

      {tab === "security" && (
        <section className="space-y-4 rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
          <h2 className="text-lg font-bold text-white">Password</h2>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="border-[#27344B] bg-[#0B1020] text-white" />
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" className="border-[#27344B] bg-[#0B1020] text-white" />
          <Button onClick={savePassword} disabled={savingPassword} className="bg-klyvor-gradient text-white">{savingPassword ? "Updating..." : "Update password"}</Button>
          <Button onClick={signOutOthers} variant="outline" className="border-[#EF4444] text-[#EF4444]">Sign out every device</Button>
        </section>
      )}

      {tab === "preferences" && (
        <section className="space-y-4 rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
          <h2 className="text-lg font-bold text-white">Preferences</h2>
          <label className="block text-sm text-[#C7D0E0]">Timezone<input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-[#27344B] bg-[#0B1020] px-3 text-white" placeholder="Africa/Lagos" /></label>
          <label className="block text-sm text-[#C7D0E0]">Date format
            <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="mt-1 h-11 w-full rounded-md border border-[#27344B] bg-[#0B1020] px-3 text-white">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={productUpdates} onChange={(e) => setProductUpdates(e.target.checked)} /> Product updates</label>
          <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={tipsGuidance} onChange={(e) => setTipsGuidance(e.target.checked)} /> Tips and guidance</label>
          <Button onClick={savePrefs} disabled={savingPrefs} className="bg-klyvor-gradient text-white">{savingPrefs ? "Saving..." : "Save preferences"}</Button>
        </section>
      )}

      {tab === "support" && (
        <section className="space-y-3 rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
          <h2 className="text-lg font-bold text-white">Your tickets</h2>
          <p className="text-sm text-[#C7D0E0]">New tickets are sent from the support button on any dashboard page.</p>
          {tickets.length === 0 ? <p className="text-sm text-[#64748B]">No tickets yet.</p> : tickets.map((ticket) => (
            <div key={ticket.id} className="rounded-xl border border-[#27344B] bg-[#0B1020] p-4">
              <p className="font-semibold text-white">{ticket.subject || "Ticket"}</p>
              <p className="mt-1 text-sm text-[#C7D0E0]">{ticket.message}</p>
              <p className="mt-2 text-xs uppercase text-[#64748B]">{ticket.status || "open"}</p>
            </div>
          ))}
        </section>
      )}

      {tab === "data" && (
        <section className="space-y-4 rounded-2xl border border-[#27344B] bg-[#111A2E] p-5">
          <h2 className="text-lg font-bold text-white">Download your data</h2>
          <p className="text-sm text-[#C7D0E0]">A JSON file of your profile, tasks, documents, quotes, projects, clients, invoices, expenses, proposals, CVs, time entries, and tickets.</p>
          <Button onClick={exportData} disabled={exporting} className="bg-white text-[#0B1020]">{exporting ? "Preparing..." : "Export JSON"}</Button>
        </section>
      )}
    </div>
  );
}
