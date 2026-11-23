
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [
  { name: "About", href: "/about" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
];

export default function LandingNavStrip() {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/[0.07] bg-[#0B1427]">
      {/* Atmospheric lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-32 w-[70%] -translate-x-1/2 rounded-full bg-[#00D4FF]/[0.07] blur-[80px]"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:px-6 md:flex-row lg:px-8">
        {/* Navigation glass panel */}
        <nav
          aria-label="Main landing page links"
          className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-2 shadow-[0_12px_35px_rgba(0,0,0,0.2)] backdrop-blur-xl md:w-auto md:gap-x-3"
        >
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
            >
              {link.name}
              <span className="absolute bottom-1 left-4 right-4 h-px origin-left scale-x-0 bg-gradient-to-r from-[#00D4FF] to-[#7C5CFC] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Sign-up action */}
        <Link
          href="/signup"
          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#00D4FF]/30 bg-gradient-to-br from-[#00AFCF] to-[#6550D9] px-7 py-3 text-sm font-bold text-white shadow-[0_8px_25px_rgba(0,212,255,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,212,255,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] sm:w-auto"
        >
          <span className="relative z-10">Sign Up</span>
          <ArrowUpRight
            size={17}
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
          <span className="absolute inset-0 translate-x-[-110%] bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
        </Link>
      </div>
    </section>
  );
}
