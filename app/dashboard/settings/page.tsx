"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Shield, Settings, Database, AlertTriangle, Download, Loader2, CreditCard, LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [signingOutAll, setSigningOutAll] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
        const { data: userTickets } = await supabase.from("support_requests").select("*").eq("email", user.email).order("created_at", { ascending: false });
        setTickets(userTickets || []);
      }
      const { data: prefs } = await supabase.from("user_preferences").select("*").single();
      if (prefs) {
        setTimezone(prefs.timezone);
        setDateFormat(prefs.date_format);
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (error) toast.error("Failed to update profile.");
    else toast.success("Profile updated.");
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
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
    const { error } = await supabase.from("user_preferences").update({ timezone, date_format: dateFormat }).eq("user_id", user?.id);
    if (error) toast.error("Failed to save.");
    else toast.success("Preferences saved.");
    setSavingPrefs(false);
  };

  if (loading) return <div className="p-8 text-white">Loading settings...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Your Account</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Account Settings</h1>
      </div>

      <div className="flex overflow-x-auto border-b border-[#27344B] pb-px hide-scrollbar">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "security", label: "Security", icon: Shield },
          { id: "preferences", label: "Preferences", icon: Settings },
          { id: "support", label: "Support History", icon: LifeBuoy },
          { id: "data", label: "Privacy", icon: Database },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-[#64748B] hover:text-white"}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
        <Link href="/dashboard/settings/billing" className="flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 border-transparent text-[#64748B] hover:text-white transition-colors whitespace-nowrap">
          <CreditCard size={16} /> Billing
        </Link>
      </div>

      <div className="bg-[#111A2E] border border-[#27344B] rounded-2xl p-6 sm:p-8">
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in">
            <div><h2 className="text-xl font-bold text-white mb-1">Your Profile</h2><p className="text-sm text-[#C7D0E0]">Keep your personal details up to date.</p></div>
            <div className="flex items-center gap-6 pb-6 border-b border-[#27344B]">
              <div className="w-20 h-20 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center text-primary text-2xl font-bold">{fullName ? fullName.substring(0, 2).toUpperCase() : "KL"}</div>
              <div><p className="text-white font-semibold text-lg">{fullName || "Klyvor User"}</p><p className="text-sm text-[#64748B]">{user?.email}</p></div>
            </div>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white" /></div>
              <Button onClick={handleSaveProfile} disabled={savingProfile} className="bg-klyvor-gradient text-white">{savingProfile ? "Saving..." : "Save Profile"}</Button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
           <div className="space-y-8 animate-in fade-in">
             <div><h2 className="text-xl font-bold text-white mb-1">Security <div><h2 className="text-xl font-bold text-white mb-1">Security</h2></div> Authentication</h2><p className="text-sm text-[#C7D0E0]">Protect your account and control how you access KLYVOR.</p></div>
             <div className="space-y-4 max-w-md">
               <div className="flex items-center justify-between p-4 bg-[#0B1020] border border-[#27344B] rounded-xl">
                 <div><p className="text-white font-medium">Password</p><p className="text-xs text-[#64748B]">••••••••••••</p></div>
                 <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)} className="border-[#27344B] text-white hover:bg-[#111A2E]">Change</Button>
               </div>
               <div className="pt-4 border-t border-[#27344B]">
                 <h3 className="text-white font-semibold mb-2">Session Management</h3>
                 {/* FIXED: Replaced the buggy opacity classes with explicit hex codes */}
                 <Button onClick={handleSignOutAll} disabled={signingOutAll} className="bg-[#0B1020] border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
                   {signingOutAll ? "Signing out..." : "Sign Out of All Devices"}
                 </Button>
               </div>
             </div>
           </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-8 animate-in fade-in">
            <div><h2 className="text-xl font-bold text-white mb-1">Make It Yours</h2><p className="text-sm text-[#C7D0E0]">Configure your workspace to suit the way you work.</p></div>
            <div className="space-y-6 max-w-md">
              <div className="space-y-2"><Label>Time Zone</Label>
                <Select value={timezone} onValueChange={(val) => setTimezone(val as string)}>
                  <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="UTC">UTC</SelectItem><SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem><SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Date Format</Label>
                <Select value={dateFormat} onValueChange={(val) => setDateFormat(val as string)}>
                  <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem><SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem><SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem></SelectContent>
                </Select>
              </div>
              <Button onClick={handleSavePreferences} disabled={savingPrefs} className="bg-klyvor-gradient text-white w-full">{savingPrefs ? "Saving..." : "Save Preferences"}</Button>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-6 animate-in fade-in">
            <div><h2 className="text-xl font-bold text-white mb-1">Support History</h2><p className="text-sm text-[#C7D0E0]">View the status of tickets you have submitted.</p></div>
            {tickets.length === 0 ? <p className="text-sm text-[#64748B]">You have not submitted any tickets yet.</p> : (
              <div className="space-y-4">
                {tickets.map(t => (
                  <div key={t.id} className="bg-[#0B1020] border border-[#27344B] p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2"><h3 className="text-white font-medium">{t.subject}</h3><span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-[#F59E0B]/30 text-[#F59E0B]">{t.status}</span></div>
                    <p className="text-sm text-[#C7D0E0] mb-3">{t.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "data" && (
          <div className="space-y-8 animate-in fade-in">
            <div><h2 className="text-xl font-bold text-white mb-1">Your Data, Your Control</h2><p className="text-sm text-[#C7D0E0]">Understand how your information is stored and manage your account data.</p></div>
            <div className="space-y-6 max-w-md">
              <div className="mt-8 pt-8 border-t border-[#EF4444]/30">
                <h3 className="text-[#EF4444] font-bold text-lg mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Danger Zone</h3>
                <Button variant="outline" className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 cursor-not-allowed" disabled>Delete My Account</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
