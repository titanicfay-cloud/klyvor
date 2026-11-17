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
    meant: "Try the daily basics: tasks, notes, and price quotes.",
    points: ["Tasks, documents, and the pricing calculator", "10 documents, quick notes only", "No file attachments", "Projects, clients, invoices, and expenses stay locked"],
  },
  {
    id: "productivity",
    name: "Productivity",
    month: 19,
    year: 190,
    meant: "For heavier writing and time tracking. Client and money tools stay locked.",
    points: ["Time tracker opens", "Unlimited documents and rich text", "500 MB for files", "Projects, clients, proposals, and CV stay locked"],
  },
  {
    id: "professional",
    name: "Professional",
    month: 39,
    year: 390,
    meant: "For client work: projects, clients, proposals, and a CV. No invoices yet.",
    points: ["Projects, clients, proposals, and CV builder", "Up to 20 clients", "Unlimited projects and documents", "2 GB for files"],
  },
  {
    id: "business",
    name: "Business",
    month: 69,
    year: 690,
    meant: "For getting paid: invoices and expenses, plus unlimited clients.",
    points: ["Invoices and expenses open", "Unlimited clients", "Same writing and project tools as Professional", "5 GB for files"],
  },
  {
    id: "all_access",
    name: "All-Access",
    month: 99,
    year: 990,
    meant: "The full solo plan. Same live tools as Business, with 10 GB for files.",
    points: ["Same tools as Business", "10 GB for files", "No extra tools beyond Business", "Shared workspaces are not included"],
  },
  {
    id: "team",
    name: "Team",
    month: 149,
    year: 1490,
    meant: "Same live tools as All-Access, with 50 GB. Shared workspaces are not switched on yet.",
    points: ["Same tools as All-Access", "50 GB for files", "Shared workspaces are not live", "Team permissions are not live"],
  },
  {
    id: "business_plus",
    name: "Business Plus",
    month: 299,
    year: 2990,
    meant: "Same live tools, with 100 GB. Organisation controls are not switched on yet.",
    points: ["Same tools as All-Access", "100 GB for files", "SSO is not live", "Organisation controls are not live"],
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020]">
      <Navbar />
      <main className="flex-grow px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Pricing</h1>
          <p className="text-lg text-[#C7D0E0]">
            Each paid tier adds real tools. Team and Business Plus only add file space until shared work is switched on.
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <button onClick={() => setAnnual(false)} className={!annual ? "rounded-full bg-[#00D4FF] px-4 py-2 text-xs font-semibold text-[#0B1020]" : "rounded-full bg-[#111A2E] px-4 py-2 text-xs font-semibold text-[#64748B]"}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={annual ? "rounded-full bg-[#00D4FF] px-4 py-2 text-xs font-semibold text-[#0B1020]" : "rounded-full bg-[#111A2E] px-4 py-2 text-xs font-semibold text-[#64748B]"}>Yearly</button>
          </div>
          <p className="mt-3 text-xs text-[#64748B]">Yearly is ten months of the monthly price.</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
          {PLANS.map((plan) => {
            const price = annual ? plan.year : plan.month;
            return (
              <article key={plan.id} className="flex flex-col rounded-2xl border border-[#27344B] bg-[#111A2E] p-6">
                <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                <p className="mt-2 text-3xl font-bold text-white">{price === 0 ? "$0" : "$" + price}<span className="text-sm font-normal text-[#64748B]">{price === 0 ? "" : annual ? " / year" : " / month"}</span></p>
                <p className="mt-3 text-sm text-[#C7D0E0]">{plan.meant}</p>
                <ul className="mt-4 flex-grow space-y-2 text-sm text-[#C7D0E0]">
                  {plan.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-6 block rounded-xl bg-white py-3 text-center text-sm font-semibold text-[#0B1020]">
                  {plan.id === "free" ? "Start free" : "Create account, then choose this plan"}
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
