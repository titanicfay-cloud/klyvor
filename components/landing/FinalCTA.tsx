
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Orbit,
  Sparkles,
} from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/[0.06] bg-[#080E1C] px-4 py-24 sm:px-6 md:py-32 lg:px-8">
      {/* Atmospheric lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D4FF]/[0.07] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#7C5CFC]/[0.08] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#00D4FF]/[0.04] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/[0.10] bg-gradient-to-br from-[#14243A]/95 via-[#111B30]/95 to-[#17152F]/95 px-6 py-16 text-center shadow-[0_30px_100px_rgba(0,0,0,0.3)] sm:px-10 md:px-16 md:py-24">
          {/* Decorative orbital rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-40 h-80 w-80 rounded-full border border-[#00D4FF]/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-28 h-56 w-56 rounded-full border border-[#7C5CFC]/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 -left-24 h-96 w-96 rounded-full border border-[#00D4FF]/10"
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/[0.07] px-4 py-2">
              <Sparkles size={14} className="text-[#00D4FF]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
                Your next chapter starts here
              </span>
            </div>

            <div className="mb-7 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_35px_rgba(0,212,255,0.12)]">
                <Orbit size={27} className="text-[#00D4FF]" />
              </div>
            </div>

            <h2 className="mb-7 text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-6xl">
              Make room for
              <span className="block bg-gradient-to-r from-[#00D4FF] via-[#A5B4FC] to-[#B18AFF] bg-clip-text text-transparent">
                what's next.
              </span>
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-sm leading-8 text-slate-300 md:text-lg">
              Bring your work, plans and important activities into one
              connected workspace. Start with what you need and discover
              more ways to move forward with KLYVOR.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#00BBD8] to-[#7256E8] px-9 py-4 text-sm font-bold text-white shadow-[0_10px_35px_rgba(0,212,255,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,212,255,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] sm:w-auto"
              >
                Get Started Free
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/about"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.035] px-8 py-4 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-[#00D4FF]/40 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] sm:w-auto"
              >
                Explore KLYVOR
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <p className="mt-9 text-xs font-medium tracking-wide text-slate-500">
              KLYVOR — Beyond What's Possible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
