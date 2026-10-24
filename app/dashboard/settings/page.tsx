"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Shield, Settings, Database, AlertTriangle, Download, Loader2, Key } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Profile State
  const [fullName, setFullName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Security State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [signingOutAll, setSigningOutAll] = useState(false);

  // Preferences State
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [productUpdates, setProductUpdates] = useState(false);
  const [tipsGuidance, setTipsGuidance] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Data State
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
      }

      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("*")
        .single();

      if (prefs) {
        setTimezone(prefs.timezone);
        setDateFormat(prefs.date_format);
        setProductUpdates(prefs.product_updates);
        setTipsGuidance(prefs.tips_and_guidance);
      } else if (user) {
        // Create default preferences if they don't exist
        await supabase.from("user_preferences").insert([{ user_id: user.id }]);
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });

    if (error) toast.error("Failed to update profile.");
    else toast.success("Profile updated successfully.");
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters.");

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) toast.error(error.message);
    else {
      toast.success("Password changed successfully.");
      setIsPasswordModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPassword(false);
  };

  const handleSignOutAll = async () => {
    if (!confirm("This will end your other active sessions. You may need to sign in again on your devices.")) return;
    setSigningOutAll(true);
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) toast.error("Failed to sign out of all devices.");
    else window.location.href = "/login";
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("user_preferences").update({
      timezone,
      date_format: dateFormat,
      product_updates: productUpdates,
      tips_and_guidance: tipsGuidance
    }).eq("user_id", user?.id);

    if (error) toast.error("Failed to save preferences.");
    else { toast.success("Preferences saved successfully."); router.refresh(); }
    setSavingPrefs(false);
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const [tasksRes, docsRes, calcsRes] = await Promise.all([
        supabase.from("tasks").select("*"),
        supabase.from("documents").select("*"),
        supabase.from("pricing_calculations").select("*")
      ]);

      const exportData = {
        profile: { name: fullName, email: user.email, joined: user.created_at },
        tasks: tasksRes.data || [],
        documents: docsRes.data || [],
        calculations: calcsRes.data || []
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `klyvor-data-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully.");
    } catch (err) {
      toast.error("Failed to export data.");
    }
    setExporting(false);
  };

  if (loading) return <div className="p-8 text-white">Loading settings...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      <div>
        <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-2 block">Your Account</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-[#C7D0E0]">Make KLYVOR yours. Manage your personal information, preferences, security, and account access in one place.</p>
      </div>

      {/* Navigation */}
      <div className="flex overflow-x-auto border-b border-[#27344B] pb-px hide-scrollbar">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "security", label: "Security", icon: Shield },
          { id: "preferences", label: "Preferences", icon: Settings },
          { id: "data", label: "Privacy", icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-[#64748B] hover:text-white"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="bg-[#111A2E] border border-[#27344B] rounded-2xl p-6 sm:p-8">
        
        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Your Profile</h2>
              <p className="text-sm text-[#C7D0E0]">Keep your personal details up to date.</p>
            </div>
            
            <div className="flex items-center gap-6 pb-6 border-b border-[#27344B]">
              <div className="w-20 h-20 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center text-primary text-2xl font-bold">
                {fullName ? fullName.substring(0, 2).toUpperCase() : "KL"}
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{fullName || "Klyvor User"}</p>
                <p className="text-sm text-[#64748B]">{user?.email}</p>
                <p className="text-xs text-[#64748B] mt-1">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={user?.email || ""} disabled className="bg-[#0B1020] border-[#27344B] text-[#64748B] cursor-not-allowed" />
                <p className="text-xs text-[#64748B]">To change your email, please contact support.</p>
              </div>
              <Button onClick={handleSaveProfile} disabled={savingProfile} className="bg-klyvor-gradient text-white">
                {savingProfile ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Security & Authentication</h2>
              <p className="text-sm text-[#C7D0E0]">Protect your account and control how you access KLYVOR.</p>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="flex items-center justify-between p-4 bg-[#0B1020] border border-[#27344B] rounded-xl">
                <div>
                  <p className="text-white font-medium">Password</p>
                  <p className="text-xs text-[#64748B]">••••••••••••</p>
                </div>
                <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)} className="border-[#27344B] text-white hover:bg-[#111A2E]">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0B1020] border border-[#27344B] rounded-xl">
                <div>
                  <p className="text-white font-medium">Email Verification</p>
                  <p className="text-xs text-success">Verified</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#27344B]">
                <h3 className="text-white font-semibold mb-2">Session Management</h3>
                <p className="text-sm text-[#64748B] mb-4">If you suspect unauthorized access, you can sign out of all devices.</p>
                <Button onClick={handleSignOutAll} disabled={signingOutAll} variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">
                  {signingOutAll ? "Signing out..." : "Sign Out of All Devices"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* PREFERENCES */}
        {activeTab === "preferences" && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Make It Yours</h2>
              <p className="text-sm text-[#C7D0E0]">Configure your workspace to suit the way you work.</p>
            </div>

            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select value={timezone} onValueChange={(val) => setTimezone(val as string)}>
                  <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST/EDT)</SelectItem>
                    <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select value={dateFormat} onValueChange={(val) => setDateFormat(val as string)}>
                  <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2E] border-[#27344B] text-white">
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-[#27344B] space-y-4">
                <h3 className="text-white font-semibold">Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Product Updates</p>
                    <p className="text-xs text-[#64748B]">New features and announcements.</p>
                  </div>
                  <Switch checked={productUpdates} onCheckedChange={setProductUpdates} className="data-[state=checked]:bg-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Tips and Guidance</p>
                    <p className="text-xs text-[#64748B]">Suggestions for using KLYVOR.</p>
                  </div>
                  <Switch checked={tipsGuidance} onCheckedChange={setTipsGuidance} className="data-[state=checked]:bg-primary" />
                </div>
              </div>

              <Button onClick={handleSavePreferences} disabled={savingPrefs} className="bg-klyvor-gradient text-white w-full">
                {savingPrefs ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>
        )}

        {/* DATA & PRIVACY */}
        {activeTab === "data" && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Your Data, Your Control</h2>
              <p className="text-sm text-[#C7D0E0]">Understand how your information is stored and manage your account data.</p>
            </div>

            <div className="space-y-6 max-w-md">
              <div className="p-4 bg-[#0B1020] border border-[#27344B] rounded-xl">
                <h3 className="text-white font-semibold mb-2">Export Your Data</h3>
                <p className="text-sm text-[#64748B] mb-4">Download a JSON file containing your profile information, tasks, documents, and saved calculations.</p>
                <Button onClick={handleExportData} disabled={exporting} className="bg-white text-[#0B1020] hover:bg-gray-200">
                  {exporting ? <><Loader2 className="mr-2 animate-spin" size={16} /> Exporting...</> : <><Download className="mr-2" size={16} /> Export My Data</>}
                </Button>
              </div>

              {/* DANGER ZONE */}
              <div className="mt-12 pt-8 border-t border-[#EF4444]/30">
                <h3 className="text-[#EF4444] font-bold text-lg mb-2 flex items-center gap-2">
                  <AlertTriangle size={20} /> Danger Zone
                </h3>
                <p className="text-sm text-[#C7D0E0] mb-4">Permanently delete your KLYVOR account and associated personal data. This action cannot be undone.</p>
                <Button variant="outline" className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 cursor-not-allowed" disabled>
                  Delete My Account (Contact Support for V1)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PASSWORD MODAL */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="bg-[#0B1020] border-[#27344B] text-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription className="text-[#C7D0E0]">
              Ensure your account is using a long, random password to stay secure.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-[#111A2E] border-[#27344B] text-white focus-visible:ring-primary" />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)} className="text-[#C7D0E0] hover:text-white">Cancel</Button>
              <Button type="submit" disabled={savingPassword} className="bg-klyvor-gradient text-white">
                {savingPassword ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
