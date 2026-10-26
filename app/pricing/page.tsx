"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { CheckCircle2, Zap, Briefcase, Building2, ShieldCheck, Users, Crown, GraduationCap } from "lucide-react";

const PLANS = [
  { id: "free", name: "Free", price: 0, annual: 0, icon: GraduationCap, color: "text-[#64748B]", features: ["3 Active Projects", "3 Clients", "10 Documents", "Basic Notes"] },
  { id: "productivity", name: "Productivity", price: 19, annual: 190, icon: Zap, color: "text-[#F59E0B]", features: ["Unlimited Projects", "Unlimited Documents", "Rich Text Editor", "500MB Storage"] },
  { id: "professional", name: "Professional", price: 39, annual: 390, icon: Briefcase, color: "text-[#00D4FF]", features: ["Everything in Productivity", "20 Clients", "2GB Storage", "Advanced Document Types"] },
  { id: "business", name: "Business", price: 69, annual: 690, icon: Building2, color: "text-[#7C5CFC]", features: ["Everything in Professional", "Unlimited Clients", "5GB Storage", "Client CRM"] },
  { id: "all_access", name: "All-Access", price: 99, annual: 990, icon: ShieldCheck, color: "text-[#22C55E]", features: ["Everything in Business", "10GB Storage", "Priority Support", "All Future AI Tools"] },
  { id: "team", name: "Team", price: 149, annual: 1490, icon: Users, color: "text-[#F97316]", features: ["Everything in All-Access", "Shared Workspaces", "Team Permissions", "50GB Storage"] },
  { id: "business_plus", name: "Business Plus", price: 299, annual: 2990, icon: Crown, color: "text-[#EAB308]", features: ["Everything in Team", "Advanced Organization Controls", "SSO", "100GB Storage"] },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020]">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, transparent pricing.</h1>
          <p className="text-lg text-[#C7D0E0] mb-10">Start for free, then scale your workspace as you grow.</p>
          
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-[#64748B]'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 rounded-full bg-[#111A2E] border border-[#27344B] p-1 flex items-center transition-colors relative"
            >
              <div className={`w-6 h-6 rounded-full bg-klyvor-gradient transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-[#64748B]'}`}>
              Annually <span className="text-primary text-xs ml-1 font-bold">(Save 16.7% / 2 Months Free)</span>
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
          {PLANS.map((plan) => (
            <div key={plan.id} className="bg-[#111A2E] border border-[#27344B] p-6 rounded-2xl flex flex-col hover:border-primary/50 transition-colors">
              <plan.icon className={`w-8 h-8 mb-4 ${plan.color}`} />
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">${isAnnual ? plan.annual : plan.price}</span>
                <span className="text-sm text-[#64748B]">/{isAnnual ? 'yr' : 'mo'}</span>
              </div>
              
              {isAnnual && plan.price > 0 ? (
                <p className="text-xs text-[#22C55E] mb-6">${(plan.annual / 12).toFixed(2)}/mo billed annually</p>
              ) : (
                <p className="text-xs text-[#64748B] mb-6">Billed monthly</p>
              )}

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#C7D0E0]">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="w-full block mt-auto">
                <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.id === 'free' ? 'bg-[#27344B] text-white hover:bg-[#334155]' : 'bg-klyvor-gradient text-white hover:opacity-90'}`}>
                  {plan.id === 'free' ? 'Start for Free' : `Choose ${plan.name}`}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
