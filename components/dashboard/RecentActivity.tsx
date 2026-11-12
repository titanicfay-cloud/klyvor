"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CheckSquare, FileText, Clock, ArrowRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecentActivity() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [tasks, docs, proposals, times, invoices] = await Promise.all([
      supabase.from("tasks").select("id, title, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
      supabase.from("documents").select("id, title, updated_at, created_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(8),
      supabase.from("proposals").select("id, title, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
      supabase.from("time_entries").select("id, description, start_time").eq("user_id", user.id).order("start_time", { ascending: false }).limit(8),
      supabase.from("invoices").select("id, invoice_number, status, created_at").order("created_at", { ascending: false }).limit(8),
    ]);

    const activity = [
      ...(tasks.data || []).map((item) => ({ id: item.id, title: item.title, type: "Task", status: item.status, date: item.created_at, href: "/dashboard/tasks", icon: CheckSquare })),
      ...(docs.data || []).map((item) => ({ id: item.id, title: item.title || "Untitled Document", type: "Document", status: null, date: item.updated_at || item.created_at, href: "/dashboard/documents", icon: FileText })),
      ...(proposals.data || []).map((item) => ({ id: item.id, title: item.title || "Untitled Proposal", type: "Proposal", status: item.status, date: item.created_at, href: "/dashboard/proposals", icon: FileText })),
      ...(times.data || []).map((item) => ({ id: item.id, title: item.description || "Time entry", type: "Time", status: null, date: item.start_time, href: "/dashboard/time-tracker", icon: Clock })),
      ...(invoices.data || []).map((item) => ({ id: item.id, title: item.invoice_number || "Invoice", type: "Invoice", status: item.status, date: item.created_at, href: "/dashboard/invoices", icon: Receipt })),
    ]
      .filter((item) => item.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);

    setItems(activity);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const onFocus = () => load();
    const onVisible = () => { if (document.visibilityState === "visible") load(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    const timer = setInterval(load, 15000);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(timer);
    };
  }, [load]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <p className="text-sm text-[#64748B]">Pick up where you left off.</p>
      </div>
      {loading ? (
        <div className="rounded-xl border border-[#27344B] bg-[#111A2E] p-8 text-center text-sm text-[#64748B]">Loading recent work...</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#27344B] bg-[#111A2E]/50 p-10 text-center">
          <Clock className="mx-auto mb-4 h-8 w-8 text-[#64748B]" />
          <h3 className="mb-2 font-medium text-white">Your workspace is just getting started.</h3>
          <p className="mx-auto mb-6 max-w-md text-sm text-[#64748B]">Tasks, documents, time, and invoices will appear here once you use them.</p>
          <Link href="/dashboard/directory"><Button variant="outline" className="border-[#27344B] text-white hover:bg-[#111A2E]">Explore your tools</Button></Link>
        </div>
      ) : (
        <div className="divide-y divide-[#27344B] rounded-xl border border-[#27344B] bg-[#111A2E]">
          {items.map((item) => (
            <Link key={`\( {item.type}- \){item.id}`} href={item.href} className="group flex items-center justify-between p-4 transition-colors hover:bg-[#0B1020]/50">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#27344B] bg-[#0B1020]">
                  <item.icon size={16} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white group-hover:text-primary">{item.title}</p>
                  <p className="text-xs text-[#64748B]">{item.type}{item.status ? ` · ${item.status}` : ""}</p>
                </div>
              </div>
              <ArrowRight size={16} className="shrink-0 text-[#64748B] group-hover:text-primary" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
