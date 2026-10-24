"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ComingSoonProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  features: string[];
  accentColor?: string;
}

export default function ComingSoon({ title, subtitle, icon, features, accentColor = "#00D4FF" }: ComingSoonProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // Added to prevent UI flash
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsChecking(false);
        return;
      }

      // FIXED: Using maybeSingle() instead of single() to handle 0 rows gracefully
      const { data, error } = await supabase
        .from("feature_waitlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("feature_name", title)
        .maybeSingle();

      if (data) setHasJoined(true);
      setIsChecking(false);
    };
    checkStatus();
  }, [title]); // Removed supabase from dependency array to prevent re-fetching

  const handleNotify = async () => {
    if (hasJoined) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to join the waitlist.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("feature_waitlist").insert([{
      user_id: user.id,
      email: user.email,
      feature_name: title
    }]);

    if (error) {
      if (error.code === '23505') { // Unique violation code
        setHasJoined(true);
      } else {
        toast.error("Could not join the waitlist. Please try again.");
      }
    } else {
      setHasJoined(true);
      toast.success("You're on the list!", {
        description: `We'll notify you as soon as ${title} is ready.`,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden max-w-4xl mx-auto px-4">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[120px] rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: accentColor }}></div>

      <div className="relative mb-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#27344B] rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#27344B] rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        
        <div className="relative w-20 h-20 bg-[#111A2E] border border-[#27344B] rounded-2xl flex items-center justify-center shadow-2xl z-10">
          {icon}
        </div>
      </div>

      <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 border" style={{ color: accentColor, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}10` }}>
        Coming Soon to V1.1
      </span>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{title}</h1>
      <p className="text-lg text-[#C7D0E0] mb-12 max-w-xl mx-auto">{subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-12">
        {features.map((feature, i) => (
          <div key={i} className="bg-[#111A2E] border border-[#27344B] p-4 rounded-xl flex flex-col items-center text-center gap-3">
            <CheckCircle2 size={20} style={{ color: accentColor }} />
            <span className="text-sm text-[#C7D0E0] font-medium">{feature}</span>
          </div>
        ))}
      </div>

      {isChecking ? (
         <Button disabled className="px-8 py-6 rounded-full font-bold text-base bg-[#111A2E] text-[#64748B] border border-[#27344B]">
           <Loader2 size={18} className="mr-2 animate-spin" /> Checking status...
         </Button>
      ) : (
        <Button 
          onClick={handleNotify} 
          disabled={loading || hasJoined}
          className={`px-8 py-6 rounded-full font-bold text-base transition-all ${
            hasJoined 
              ? "bg-success/20 text-success border border-success/30 cursor-not-allowed hover:bg-success/20" 
              : "bg-white text-[#0B1020] hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          }`}
        >
          {loading ? <><Loader2 size={18} className="mr-2 animate-spin" /> Joining...</> 
           : hasJoined ? <><CheckCircle2 size={18} className="mr-2" /> You're on the list</> 
           : "Notify Me When It Launches"}
        </Button>
      )}
    </div>
  );
}
