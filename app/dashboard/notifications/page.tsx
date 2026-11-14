"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageLoading, PageEmpty } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/app/actions/notifications";

export default function NotificationsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: notes, error }, { data: reads }] = await Promise.all([
      supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(80),
      supabase.from("notification_reads").select("notification_id").eq("user_id", user.id),
    ]);
    if (error) toast.error("Could not load notifications.");
    setItems(notes || []);
    setReadIds((reads || []).map((row) => row.notification_id));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const unread = items.filter((item) => !readIds.includes(item.id));

  const markOne = async (id: string) => {
    const res = await markNotificationReadAction(id);
    if (res.error) toast.error(res.error);
    else setReadIds((prev) => [...prev, id]);
  };

  const markAll = async () => {
    const res = await markAllNotificationsReadAction(unread.map((item) => item.id));
    if (res.error) toast.error(res.error);
    else {
      toast.success("All marked read.");
      setReadIds(items.map((item) => item.id));
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Workspace</span>
          <h1 className="mb-2 text-3xl font-bold text-white">Notifications</h1>
          <p className="text-[#C7D0E0]">Your activity, private messages, and rare platform notices.</p>
        </div>
        <Button onClick={markAll} variant="outline" className="border-[#27344B] text-white">Mark all read</Button>
      </div>
      {items.length === 0 ? (
        <PageEmpty title="No notifications yet" description="New invoices, expenses, and staff messages will show up here." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isRead = readIds.includes(item.id);
            const label = item.audience === "all" ? "Platform" : "For you";
            return (
              <div key={item.id} className={`rounded-xl border p-4 ${isRead ? "border-[#27344B] bg-[#0B1020]" : "border-primary/30 bg-[#111A2E]"}`}>
                <div className="flex gap-3">
                  <Bell size={18} className="mt-0.5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{label}</p>
                    <p className="font-semibold text-white">{item.title}</p>
                    {item.body && <p className="mt-1 text-sm text-[#C7D0E0]">{item.body}</p>}
                    <div className="mt-3 flex gap-4">
                      {!isRead && <button onClick={() => markOne(item.id)} className="text-xs font-semibold text-primary">Mark read</button>}
                      {item.link && <Link href={item.link} className="text-xs text-[#C7D0E0] hover:text-white">Open</Link>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
