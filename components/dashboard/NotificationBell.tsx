"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function NotificationBell() {
  const supabase = createClient();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: notes }, { data: reads }] = await Promise.all([
        supabase.from("notifications").select("id").order("created_at", { ascending: false }).limit(50),
        supabase.from("notification_reads").select("notification_id").eq("user_id", user.id),
      ]);
      if (!active) return;
      const seen = new Set((reads || []).map((row) => row.notification_id));
      setCount((notes || []).filter((note) => !seen.has(note.id)).length);
    };
    load();
    const timer = setInterval(load, 20000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  return (
    <Link href="/dashboard/notifications" className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-[#C7D0E0] hover:bg-[#111A2E] hover:text-white">
      <Bell size={18} />
      {count > 0 && (
        <span className="absolute right-1 top-1 min-w-[16px] rounded-full bg-[#00D4FF] px-1 text-center text-[10px] font-bold text-[#0B1020]">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
