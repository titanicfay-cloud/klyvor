"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Shield, Settings, Database, Download, CreditCard, LifeBuoy } from "lucide-react";
import Link from "next/link";
import ProfileForm from "@/components/features/settings/ProfileForm";
import SecurityForm from "@/components/features/settings/SecurityForm";
import PreferencesForm from "@/components/features/settings/PreferencesForm";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [fullName, setFullName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [signingOutAll, setSigningOutAll] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [productUpdates, setProductUpdates] = useState(false);
  const [tipsGuidance, setTipsGuidance] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user); setFullName(user.user_metadata?.full_name || "");
        const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
        if (roleData) setUserRole(roleData.role);
        const { data: userTickets } = await supabase.from("support_requests").select("*").eq("email", user.email).order("created_at", { ascending: false });
        setTickets(userTickets || []);
      }
      const { data: prefs } = await supabase.from("user_preferences").select("*").single();
      if (prefs) { setTimezone(prefs.timezone); setDateFormat(prefs.date_format); setProductUpdates(prefs.product_updates || false); setTipsGuidance(prefs.tips_and_guidance || false); }
      else if (user) { await supabase.from("user_preferences").insert([{ user_id: user.id }]); }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (error) toast.error("Failed."); else { toast.success("Profile updated."); router.refresh(); }
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message); else { toast.success("Password changed."); setIsPasswordModalOpen(false); setNewPassword(""); setConfirmPassword(""); }
    setSavingPassword(false);
  };

  const handleSignOutAll = async () => {
    if (!confirm("This will end your other active sessions.")) return;
    setSigningOutAll(true);
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) toast.error("Failed."); else window.location.href = "/login";
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("user_preferences").update({ timezone, date_format: dateFormat, product_updates: productUpdates, tips_and_guidance: tipsGuidance }).eq("user_id", user?.id);
    if (error) toast.error("Failed."); else toast.success("Saved.");
    setSavingPrefs(false);
  };

  const handleExportData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [tasksRes, docsRes, calcsRes, projRes, clientRes] = await Promise.all([supabase.from("tasks").select("*"), supabase.from("documents").select("*"), supabase.from("pricing_calculations").select("*"), supabase.from("projects").select("*"), supabase.from("clients").select("*")]);
    const exportData = { profile: { name: fullName, email: user.email, joined: user.created_at, role: userRole }, tasks: tasksRes.data || [], documents: docsRes.data || [], calculations: calcsRes.data || [], projects: projRes.data || [], clients: clientRes.data || [] };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `klyvor-export.json`; a.click(); URL.revokeObjectURL(url);
    toast.success("Data exported.");
  };

  if (loading) return <div className="p-8 text-white">Loading settings...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div><span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Your Account</span><h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Account Settings</h1></div>

      <div className="flex overflow-x-auto border-b border-[#27344B] pb-px hide-scrollbar">
        {[{ id: "profile", label: "Profile", icon: User },{ id: "security", label: "Security", icon: Shield },{ id: "preferences", label: "Preferences", icon: Settings },{ id: "support", label: "Support", icon: LifeBuoy },{ id: "data", label: "Privacy", icon: Database }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-[#64748B] hover:text-white"}`}><tab.icon size={16} /> {tab.label}</button>
        ))}
        <Link href="/dashboard/settings/billing" className="flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 border-transparent text-[#64748B] hover:text-white transition-colors whitespace-nowrap"><CreditCard size={16} /> Billing</Link>
      </div>

      <div className="bg-[#111A2E] border border-[#27344B] rounded-2xl overflow-hidden">
        {activeTab === "profile" && <ProfileForm user={user} fullName={fullName} setFullName={setFullName} userRole={userRole} handleSaveProfile={handleSaveProfile} savingProfile={savingProfile} />}
        {activeTab === "security" && <SecurityForm setIsPasswordModalOpen={setIsPasswordModalOpen} handleSignOutAll={handleSignOutAll} signingOutAll={signingOutAll} />}
        {activeTab === "preferences" && <PreferencesForm timezone={timezone} setTimezone={setTimezone} dateFormat={dateFormat} setDateFormat={setDateFormat} productUpdates={productUpdates} setProductUpdates={setProductUpdates} tipsGuidance={tipsGuidance} setTipsGuidance={setTipsGuidance} handleSavePreferences={handleSavePreferences} savingPrefs={savingPrefs} />}
        {activeTab === "support" && ( <div className="p-6 sm:p-8 space-y-4 animate-in fade-in"><div><h2 className="text-xl font-bold text-white mb-1">Support History</h2><p className="text-sm text-[#C7D0E0]">View your submitted tickets.</p></div>{tickets.length === 0 ? <p className="text-sm text-[#64748B]">No tickets.</p> : tickets.map(t => <div key={t.id} className="bg-[#0B1020] p-4 rounded-xl border border-[#27344B]"><h3 className="text-white">{t.subject}</h3><p className="text-sm text-[#C7D0E0]">{t.message}</p></div>)}</div> )}
        {activeTab === "data" && ( <div className="p-6 sm:p-8 space-y-4 animate-in fade-in"><div><h2 className="text-xl font-bold text-white mb-1">Your Data</h2><p className="text-sm text-[#C7D0E0]">Manage your account data.</p></div><Button onClick={handleExportData} className="bg-white text-[#0B1020]"><Download className="mr-2" size={16}/> Export Data</Button></div> )}
      </div>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}><DialogContent className="bg-[#0B1020] border-[#27344B] text-white"><DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader><form onSubmit={handleChangePassword} className="space-y-4"><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="bg-[#111A2E] border-[#27344B] text-white" /><Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="bg-[#111A2E] border-[#27344B] text-white" /><Button type="submit" className="w-full bg-klyvor-gradient text-white">Update</Button></form></DialogContent></Dialog>
    </div>
  );
}
