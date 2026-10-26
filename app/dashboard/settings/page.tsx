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
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
        
        // Fetch user's tickets
        const { data: userTickets } = await supabase
          .from("support_requests")
          .select("*")
          .eq("email", user.email)
          .order("created_at", { ascending: false });
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
    else toast.success("Profile updated successfully.");
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else {
      toast.success("Password changed.");
      setIsPasswordModalOpen(false);
      setNewPassword(""); setConfirmPassword("");
    }
    setSavingPassword(false);
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
        {activeTab === "support" && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Support History</h2>
              <p className="text-sm text-[#C7D0E0]">View the status of tickets you have submitted.</p>
            </div>
            {tickets.length === 0 ? (
              <p className="text-sm text-[#64748B]">You have not submitted any support tickets yet.</p>
            ) : (
              <div className="space-y-4">
                {tickets.map(t => (
                  <div key={t.id} className="bg-[#0B1020] border border-[#27344B] p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium">{t.subject}</h3>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${t.status === 'resolved' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30' : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'}`}>{t.status}</span>
                    </div>
                    <p className="text-sm text-[#C7D0E0] mb-3">{t.message}</p>
                    <p className="text-xs text-[#64748B]">Submitted on {new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Keep Profile, Security, Preferences, Data tabs exactly as they were */}
        {activeTab === "profile" && ( <div className="text-white">Profile tab content here...</div> )}
        {activeTab === "security" && ( <div className="text-white">Security tab content here...</div> )}
        {activeTab === "preferences" && ( <div className="text-white">Preferences tab content here...</div> )}
        {activeTab === "data" && ( <div className="text-white">Data tab content here...</div> )}
      </div>
    </div>
  );
}
