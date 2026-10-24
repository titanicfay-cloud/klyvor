"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface ComingSoonProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  features: string[];
  accentColor?: string;
}

export default function ComingSoon({ title, subtitle, icon, features, accentColor = "#00D4FF" }: ComingSoonProps) {
  const handleNotify = () => {
    toast.success("You're on the list!", {
      description: "We'll notify you as soon as this tool is ready.",
    });
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden max-w-4xl mx-auto px-4">
      
      {/* Abstract Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[120px] rounded-full opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      ></div>

      {/* Icon Container */}
      <div className="relative mb-8">
        {/* Orbital Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#27344B] rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#27344B] rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        
        {/* Central Icon */}
        <div className="relative w-20 h-20 bg-[#111A2E] border border-[#27344B] rounded-2xl flex items-center justify-center shadow-2xl z-10">
          {icon}
        </div>
      </div>

      {/* Badge */}
      <span 
        className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 border"
        style={{ color: accentColor, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}10` }}
      >
        Coming Soon to V1.1
      </span>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
        {title}
      </h1>
      
      <p className="text-lg text-[#C7D0E0] mb-12 max-w-xl mx-auto">
        {subtitle}
      </p>

      {/* Feature List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-12">
        {features.map((feature, i) => (
          <div key={i} className="bg-[#111A2E] border border-[#27344B] p-4 rounded-xl flex flex-col items-center text-center gap-3">
            <CheckCircle2 size={20} style={{ color: accentColor }} />
            <span className="text-sm text-[#C7D0E0] font-medium">{feature}</span>
          </div>
        ))}
      </div>

      <Button onClick={handleNotify} className="bg-white text-[#0B1020] hover:bg-gray-200 px-8 py-6 rounded-full font-bold text-base shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
        Notify Me When It Launches
      </Button>
    </div>
  );
}
