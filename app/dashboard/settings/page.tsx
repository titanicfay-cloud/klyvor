"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Shield, Settings, Database, AlertTriangle, Download, Loader2, CreditCard, LifeBuoy } from "lucide-react";
import Link from "next/link";

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

  const [exporting, setExporting] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
        const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
        if (roleData) setUserRole(roleData.role);
        const { data: userTickets } = await supabase.from("support_requests").select("*").eq("email", user.email).order("created_at", { ascending: false });
        setTickets(userTickets || []);
      }
      const { data: prefs } = await supabase.from("user_preferences").select("*").single();
      if (prefs) {
        setTimezone(prefs.timezone);
        setDateFormat(prefs.date_format);
        setProductUpdates(prefs.product_updates || false);
        setTipsGuidance(prefs.tips_and_guidance || false);
      } else if (user) { await supabase.from("user_preferences").insert([{ user_id: user.id }]); }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (error) toast.error("Failed to update profile.");
    else { toast.success("Profile updated."); router.refresh(); }
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters.");
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else { toast.success("Password changed."); setIsPasswordModalOpen(false); setNewPassword(""); setConfirmPassword(""); }
    setSavingPassword(false);
  };

  const handleSignOutAll = async () => {
    if (!confirm("This will end your other active sessions.")) return;
    setSigningOutAll(true);
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) toast.error("Failed to sign out.");
    else window.location.href = "/login";
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("user_preferences").update({ timezone, date_format: dateFormat, product_updates: productUpdates, tips_and_guidance: tipsGuidance }).eq("user_id", user?.id);
    if (error) toast.error("Failed to save.");
    else toast.success("Preferences saved.");
    setSavingPrefs(false);
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");
      const [tasksRes, docsRes, calcsRes, projRes, clientRes] = await Promise.all([supabase.from("tasks").select("*"), supabase.from("documents").select("*"), supabase.from("pricing_calculations").select("*"), supabase.from("projects").select("*"), supabase.from("clients").select("*")]);
      const exportData = { profile: { name: fullName, email: user.email, joined: user.created_at, role: userRole }, tasks: tasksRes.data || [], documents: docsRes.data || [], calculations: calcsRes.data || [], projects: projRes.data || [], clients: clientRes.data || [] };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `klyvor-export-${new Date().toISOString().split("T")[0]}.json`; a.click(); URL.revokeObjectURL(url);
      toast.success("Data exported.");
    } catch (err) { toast.error("Failed to export."); }
    setExporting(false);
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
        {activeTab === "profile" && (
          <div className="animate-in fade-in">
            <div className="h-32 bg-klyvor-gradient opacity-80 w-full"></div>
            <div className="p-6 sm:p-8 relative">
              <div className="absolute -top-12 sm:-top-16 left-6 sm:left-8 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#0B1020] border-4 border-[#111A2E] flex items-center justify-center text-primary text-4xl font-bold shadow-xl">{fullName ? fullName.substring(0, 2).toUpperCase() : "KL"}</div>
              <div className="mt-14 sm:mt-20">
                <div className="flex items-center gap-3 mb-1"><h2 className="text-2xl font-bold text-white">{fullName || "User"}</h2>{userRole !== "user" && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${userRole === 'owner' ? 'bg-[#7C5CFC] text-white' : userRole === 'admin' ? 'bg-[#EF4444] text-white' : 'bg-[#F59E0B] text-white'}`}>{userRole}</span>}</div>
                <p className="text-sm text-[#64748B] mb-6">{user?.email}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input disabled value={user?.email || ""} className="bg-[#0B1020] border-[#27344B] text-[#64748B]" /></div>
                </div>
                <Button onClick={handleSaveProfile} disabled={savingProfile} className="mt-6 bg-klyvor-gradient text-white w-full sm:w-auto">{savingProfile ? "Saving..." : "Update Profile"}</Button>
              </div>
            </div>
          </div>
        )}
        {activeTab === "security" && ( <div className="p-6 space-y-6 animate-in fade-in"><h2 className="text-xl font-bold text-white">Security</h2><div className="flex items-center justify-between p-4 bg-[#0B1020] border border-[#27344B] rounded-xl"><div><p className="text-white">Password</p></div><Button variant="outline" onClick={() => setIsPasswordModalOpen(true)} className="border-[#27344B] text-white">Change</Button></div><Button onClick={handleSignOutAll} className="bg-[#0B1020] border border-[#EF4444] text-[#EF4444]">Sign Out All</Button></div> )}
        {activeTab === "preferences" && (
          <div className="p-6 space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-white">Preferences</h2>
            <div className="space-y-2"><Label>Time Zone</Label><Select value={timezone} onValueChange={(val) => setTimezone(val as string)}><SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="UTC">UTC</SelectItem><SelectItem value="Africa/Lagos">Africa/Lagos</SelectItem></SelectContent></Select></div>
            <div className="pt-4 border-t border-[#27344B] space-y-4">
              <h3 className="text-white font-semibold">Notifications</h3>
              <div className="flex items-center justify-between"><span className="text-sm text-white">Product Updates</span><Switch checked={productUpdates} onCheckedChange={setProductUpdates} /></div>
              <div className="flex items-center justify-between"><span className="text-sm text-white">Tips & Guidance</span><Switch checked={tipsGuidance} onCheckedChange={setTipsGuidance} /></div>
            </div>
            <Button onClick={handleSavePreferences} className="bg-klyvor-gradient text-white w-full">Save Preferences</Button>
          </div>
        )}
        {activeTab === "support" && ( <div className="p-6 space-y-4 animate-in fade-in"><h2 className="text-xl font-bold text-white">Support History</h2>{tickets.length === 0 ? <p className="text-sm text-[#64748B]">No tickets.</p> : tickets.map(t => <div key={t.id} className="bg-[#0B1020] p-4 rounded-xl border border-[#27344B]"><h3 className="text-white">{t.subject}</h3><p className="text-sm text-[#C7D0E0]">{t.message}</p></div>)}</div> )}
        {activeTab === "data" && ( <div className="p-6 space-y-4 animate-in fade-in"><h2 className="text-xl font-bold text-white">Privacy</h2><Button onClick={handleExportData} className="bg-white text-[#0B1020]"><Download className="mr-2" size={16}/> Export Data</Button></div> )}
      </div>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}><DialogContent className="bg-[#0B1020] border-[#27344B] text-white"><DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader><form onSubmit={handleChangePassword} className="space-y-4"><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="bg-[#111A2E] border-[#27344B] text-white" /><Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="bg-[#111A2E] border-[#27344B] text-white" /><Button type="submit" className="w-full bg-klyvor-gradient text-white">Update</Button></form></DialogContent></Dialog>
    </div>
  );
}
