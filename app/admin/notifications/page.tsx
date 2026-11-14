"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sendStaffNotificationAction } from "@/app/actions/notifications";

export default function StaffNotificationsPage() {
  const [audience, setAudience] = useState<"all" | "user">("all");
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);

  const send = async () => {
    setSaving(true);
    const res = await sendStaffNotificationAction({ audience, userId, title, body, link });
    setSaving(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success(audience === "all" ? "Sent to every user." : "Sent to that user only.");
      setTitle("");
      setBody("");
      setLink("");
      setUserId("");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#EF4444]">Staff</p>
        <h1 className="mt-2 text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-sm text-[#C7D0E0]">Send a platform notice to everyone, or a private note to one user id.</p>
      </div>
      <div className="space-y-4 rounded-xl border border-[#27344B] bg-[#111A2E] p-5">
        <div className="flex gap-2">
          <Button type="button" onClick={() => setAudience("all")} className={audience === "all" ? "bg-klyvor-gradient text-white" : "bg-[#0B1020] text-white"}>Everyone</Button>
          <Button type="button" onClick={() => setAudience("user")} className={audience === "user" ? "bg-klyvor-gradient text-white" : "bg-[#0B1020] text-white"}>One user</Button>
        </div>
        {audience === "user" && (
          <div className="space-y-2">
            <Label>User id</Label>
            <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Paste the user id" className="border-[#27344B] bg-[#0B1020] text-white" />
          </div>
        )}
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="border-[#27344B] bg-[#0B1020] text-white" />
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} className="h-28 w-full resize-none rounded-md border border-[#27344B] bg-[#0B1020] p-3 text-sm text-white" />
        </div>
        <div className="space-y-2">
          <Label>Link (optional)</Label>
          <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/dashboard" className="border-[#27344B] bg-[#0B1020] text-white" />
        </div>
        <Button onClick={send} disabled={saving} className="bg-klyvor-gradient text-white">{saving ? "Sending..." : "Send"}</Button>
      </div>
    </div>
  );
}
