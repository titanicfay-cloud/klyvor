
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const PLANS = [
  {
    id: "free",
    name: "Free",
    month: 0,
    year: 0,
    meant: "Daily basics, before client or money work.",
    opens: ["Tasks", "Documents", "Pricing calculator"],
    limits: ["10 documents", "Plain notes only", "No file uploads"],
    closed: ["Time tracker", "Projects", "Clients", "Proposals", "CV", "Invoices", "Expenses"],
  },
  {
    id: "productivity",
    name: "Productivity",
    month: 19,
    year: 190,
    meant: "Writing and time tracking. Client tools stay locked.",
    opens: ["Time tracker", "Rich text", "File uploads"],
    limits: ["Unlimited documents", "500 MB of files"],
    closed: ["Projects", "Clients", "Proposals", "CV", "Invoices", "Expenses"],
  },
  {
    id: "professional",
    name: "Professional",
    month: 39,
    year: 390,
    meant: "Client work. Getting paid is still locked.",
    opens: ["Projects", "Clients", "Proposals", "CV builder"],
    limits: ["Unlimited projects and documents", "20 clients", "2 GB of files"],
    closed: ["Invoices", "Expenses"],
  },
  {
    id: "business",
    name: "Business",
    month: 69,
    year: 690,
    meant: "The plan that opens getting paid.",
    opens: ["Invoices", "Expenses"],
    limits: ["Unlimited clients", "5 GB of files", "Every live solo tool"],
    closed: ["Shared workspaces", "Team permissions", "SSO"],
  },
  {
    id: "all_access",
    name: "All-Access",
    month: 99,
    year: 990,
    meant: "Same tools as Business. More file space.",
    opens: ["No extra tool beyond Business"],
    limits: ["10 GB of files"],
    closed: ["Shared workspaces", "AI tools", "Priority support"],
  },
  {
    id: "team",
    name: "Team",
    month: 149,
    year: 1490,
    meant: "Same tools as All-Access. Storage only, for now.",
    opens: ["No extra tool"],
    limits: ["50 GB of files"],
    closed: ["Shared workspaces", "Team permissions"],
  },
  {
    id: "business_plus",
    name: "Business Plus",
    month: 299,
    year: 2990,
    meant: "Same tools. The largest file allowance.",
    opens: ["No extra tool"],
    limits: ["100 GB of files"],
    closed: ["SSO", "Organisation controls"],
  },
];

function FeatureGroup({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: "open" | "limit" | "closed";
}) {
  const Icon = type === "closed" ? X : Check;

  return (
    <div>
      <p
        className={`mb-3 text-[10px] font-bold uppercase tracking-[0.18em] ${
          type === "open"
            ? "text-[#00D4FF]"
            : type === "limit"
              ? "text-[#A78BFA]"
              : "text-slate-500"
        }`}
      >
        {title}
      </p>

      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className={`flex items-start gap-2.5 text-[13px] leading-5 ${
              type === "closed" ? "text-slate-500" : "text-slate-300"
            }`}
          >
            <Icon
              size={15}
              className={`mt-0.5 shrink-0 ${
                type === "open"
                  ? "text-[#00D4FF]"
                  : type === "limit"
                    ? "text-[#A78BFA]"
                    : "text-slate-600"
              }`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#080E1C] text-white">
      <Navbar />

      <main className="relative flex-grow px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#00D4FF]/[0.055] blur-[150px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-180px] top-[500px] h-[500px] w-[500px] rounded-full bg-[#7C5CFC]/[0.07] blur-[140px]"
        />

        <div className="relative mx-auto max-w-7xl">
          {/* Page introduction */}
          <header className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/[0.06] px-4 py-2">
              <Sparkles size={14} className="text-[#00D4FF]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
                KLYVOR plans and access
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">
              One workspace.
              <span className="mt-2 block bg-gradient-to-r from-[#00D4FF] via-[#9BA8FF] to-[#B18AFF] bg-clip-text text-transparent">
                Your level of possibility.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-400 md:text-base">
              Start with the essentials. Unlock more capabilities as your
              work grows. Choose the access that makes sense for you.
            </p>

            {/* Billing selector */}
            <div className="mt-9 inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#111B30] p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.25)]">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                aria-pressed={!annual}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  !annual
                    ? "bg-gradient-to-r from-[#00BBD8] to-[#7256E8] text-white shadow-[0_5px_20px_rgba(0,212,255,0.2)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setAnnual(true)}
                aria-pressed={annual}
                className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  annual
                    ? "bg-gradient-to-r from-[#00BBD8] to-[#7256E8] text-white shadow-[0_5px_20px_rgba(0,212,255,0.2)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Yearly
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    annual
                      ? "bg-white/20 text-white"
                      : "bg-[#00D4FF]/10 text-[#00D4FF]"
                  }`}
                >
                  SAVE 2 MONTHS
                </span>
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Yearly costs ten months of the monthly price.
            </p>
          </header>

          {/* Plan cards */}
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
            {PLANS.map((plan) => {
              const price = annual ? plan.year : plan.month;
              const featured = plan.id === "business";

              return (
                <article
                  key={plan.id}
                  className={`group relative flex flex-col overflow-hidden rounded-[26px] border p-6 transition-all duration-300 hover:-translate-y-1.5 ${
                    featured
                      ? "border-[#00D4FF]/40 bg-gradient-to-br from-[#142B42] via-[#111D33] to-[#17152F] shadow-[0_20px_65px_rgba(0,212,255,0.10)]"
                      : "border-white/[0.09] bg-gradient-to-br from-[#111B30] to-[#0D1527] shadow-[0_15px_45px_rgba(0,0,0,0.18)] hover:border-white/20"
                  }`}
                >
                  {/* Card glow */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full blur-[85px] ${
                      featured
                        ? "bg-[#00D4FF]/[0.12]"
                        : "bg-[#7C5CFC]/[0.07]"
                    }`}
                  />

                  <div className="relative flex flex-grow flex-col">
                    {featured && (
                      <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#00D4FF]/25 bg-[#00D4FF]/[0.09] px-3 py-1.5">
                        <Zap size={12} className="text-[#00D4FF]" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#00D4FF]">
                          Featured plan
                        </span>
                      </div>
                    )}

                    {!featured && <div className="mb-5 h-[30px]" />}

                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      {plan.name}
                    </h2>

                    <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-400">
                      {plan.meant}
                    </p>

                    <div className="mt-7 border-b border-white/[0.08] pb-7">
                      <div className="flex items-end gap-1.5">
                        <span className="text-4xl font-bold tracking-tight text-white">
                          ${price}
                        </span>
                        {price !== 0 && (
                          <span className="pb-1 text-xs text-slate-500">
                            / {annual ? "year" : "month"}
                          </span>
                        )}
                      </div>

                      {annual && price > 0 && (
                        <p className="mt-2 text-xs text-[#00D4FF]">
                          Equivalent to ${(price / 10).toFixed(0)} per month
                          when billed yearly
                        </p>
                      )}

                      {!annual && price > 0 && (
                        <p className="mt-2 text-xs text-slate-500">
                          Billed monthly
                        </p>
                      )}
                    </div>

                    <div className="mt-7 space-y-7">
                      <FeatureGroup
                        title="Included access"
                        items={plan.opens}
                        type="open"
                      />

                      <FeatureGroup
                        title="Plan limits"
                        items={plan.limits}
                        type="limit"
                      />

                      <FeatureGroup
                        title="Not included"
                        items={plan.closed}
                        type="closed"
                      />
                    </div>

                    <div className="mt-auto pt-8">
                      <Link
                        href="/signup"
                        className={`group/link flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] ${
                          featured
                            ? "bg-gradient-to-r from-[#00BBD8] to-[#7256E8] text-white shadow-[0_8px_25px_rgba(0,212,255,0.2)] hover:shadow-[0_12px_35px_rgba(0,212,255,0.3)]"
                            : "border border-white/10 bg-white/[0.05] text-slate-200 hover:border-[#00D4FF]/35 hover:bg-[#00D4FF]/[0.07] hover:text-white"
                        }`}
                      >
                        {plan.id === "free" ? "Start free" : "Create an account"}
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover/link:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Closing note */}
          <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-3 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/[0.07]">
              <ShieldCheck size={20} className="text-[#00D4FF]" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Your workspace. Your pace. Your next possibility.
            </p>
            <p className="text-xs leading-6 text-slate-500">
              Choose your starting point and move forward when you're ready.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
                      }
              
