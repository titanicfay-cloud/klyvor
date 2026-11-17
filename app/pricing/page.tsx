"use client";

import { useState } from "react";
import Link from "next/link";
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

function Group({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-5 text-[#C7D0E0]">
            <span className="text-[#00D4FF]">•</span>
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
    <div className="flex min-h-screen flex-col bg-[#0B1020]" style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}>
      <Navbar />
      <main className="flex-grow px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00D4FF]">Plans</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Pricing</h1>
          <p className="mt-3 text-base leading-7 text-[#C7D0E0]">Each tier is grouped by what opens, what is limited, and what is not included.</p>
          <div className="mt-6 flex gap-2">
            <button onClick={() => setAnnual(false)} className={!annual ? "rounded-full bg-[#00D4FF] px-4 py-2 text-sm font-semibold text-[#0B1020]" : "rounded-full bg-[#111A2E] px-4 py-2 text-sm font-medium text-[#64748B]"}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={annual ? "rounded-full bg-[#00D4FF] px-4 py-2 text-sm font-semibold text-[#0B1020]" : "rounded-full bg-[#111A2E] px-4 py-2 text-sm font-medium text-[#64748B]"}>Yearly</button>
          </div>
          <p className="mt-2 text-sm text-[#64748B]">Yearly costs ten months of the monthly price.</p>
        </header>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
          {PLANS.map((plan) => {
            const price = annual ? plan.year : plan.month;
            return (
              <article key={plan.id} className="flex flex-col rounded-2xl border border-[#27344B] bg-[#111A2E] p-6">
                <h2 className="text-2xl font-semibold tracking-tight text-white">{plan.name}</h2>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  {price === 0 ? "$0" : "$" + price}
                  <span className="ml-1 text-sm font-normal text-[#64748B]">{price === 0 ? "" : annual ? "/ year" : "/ month"}</span>
                </p>
                <p className="mt-2 text-sm leading-6 text-[#C7D0E0]">{plan.meant}</p>
                <div className="mt-5 space-y-4">
                  <Group title="Opens" items={plan.opens} />
                  <Group title="Limits" items={plan.limits} />
                  <Group title="Not included" items={plan.closed} />
                </div>
                <Link href="/signup" className="mt-6 block rounded-xl bg-white py-3 text-center text-sm font-semibold text-[#0B1020]">
                  {plan.id === "free" ? "Start free" : "Create an account"}
                </Link>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
