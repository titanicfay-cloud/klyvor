"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PreferencesForm({ timezone, setTimezone, dateFormat, setDateFormat, productUpdates, setProductUpdates, tipsGuidance, setTipsGuidance, handleSavePreferences, savingPrefs }: any) {
  return (
    <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
      <div><h2 className="text-xl font-bold text-white mb-1">Make It Yours</h2><p className="text-sm text-[#C7D0E0]">Configure your workspace to suit the way you work.</p></div>
      <div className="space-y-2 max-w-md"><Label>Time Zone</Label>
        <Select value={timezone} onValueChange={(val) => setTimezone(val as string)}>
          <SelectTrigger className="bg-[#0B1020] border-[#27344B] text-white w-full"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#111A2E] border-[#27344B] text-white"><SelectItem value="UTC">UTC</SelectItem><SelectItem value="Africa/Lagos">Africa/Lagos</SelectItem><SelectItem value="Europe/London">Europe/London</SelectItem><SelectItem value="America/New_York">America/New_York</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="pt-4 border-t border-[#27344B] space-y-4 max-w-md">
        <h3 className="text-white font-semibold">Notifications</h3>
        <div className="flex items-center justify-between"><span className="text-sm text-white">Product Updates</span><Switch checked={productUpdates} onCheckedChange={setProductUpdates} /></div>
        <div className="flex items-center justify-between"><span className="text-sm text-white">Tips & Guidance</span><Switch checked={tipsGuidance} onCheckedChange={setTipsGuidance} /></div>
      </div>
      <Button onClick={handleSavePreferences} disabled={savingPrefs} className="bg-klyvor-gradient text-white w-full sm:w-auto">{savingPrefs ? "Saving..." : "Save Preferences"}</Button>
    </div>
  );
}
