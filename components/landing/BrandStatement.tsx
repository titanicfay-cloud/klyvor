
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  Layers3,
  Orbit,
  Sparkles,
} from "lucide-react";

const principles = [
  {
    number: "01",
    title: "Start Simply",
    description: "Begin with the tools and capabilities you need today.",
  },
  {
    number: "02",
    title: "Choose What Fits",
    description: "Find the access level that suits the way you work.",
  },
  {
    number: "03",
    title: "Expand Over Time",
    description: "Explore more possibilities as your needs evolve.",
  },
];

export default function BrandStatement() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-y border-white/[0.06] bg-[#080E1C] px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D4FF]/[0.06] blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#7C5CFC]/[0.07] blur-[120px]"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/[0.06] px-4 py-2">
              <Orbit size={14} className="text-[#00D4FF]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
                The KLYVOR philosophy
              </span>
            </div>

            <h2 className="mb-7 text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              More than a collection of tools.
              <span className="mt-2 block bg-gradient-to-r from-[#00D4FF] via-[#9BA8FF] to-[#B18AFF] bg-clip-text text-transparent">
                A better way to work.
              </span>
            </h2>

            <div className="max-w-xl space-y-5 text-sm leading-8 text-slate-400 md:text-base">
              <p>
                The tools you use should help you move forward, not create
                more complexity. Your work is connected. Your ideas
                influence your plans. Your plans shape what you do next.
              </p>

              <p>
                KLYVOR brings useful professional tools into one
                environment, giving you more room to organise, create,
                manage and grow in the direction that matters to you.
              </p>
            </div>

            <div className="mt-9 border-l-2 border-[#00D4FF] pl-5">
              <p className="text-base font-semibold leading-7 text-white md:text-lg">
                Start with what you need today.
                <span className="block text-[#00D4FF]">
                  Build toward what comes next.
                </span>
              </p>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center">
            <div aria-hidden="true" className="absolute inset-[8%] rounded-full border border-[#00D4FF]/10" />
            <div aria-hidden="true" className="absolute inset-[19%] rounded-full border border-[#7C5CFC]/20" />
            <div aria-hidden="true" className="absolute inset-[30%] rounded-full border border-white/[0.07]" />

            <div aria-hidden="true" className="absolute h-[72%] w-[72%] rotate-[-28deg] rounded-[50%] border border-[#00D4FF]/40 shadow-[0_0_35px_rgba(0,212,255,0.08)]" />
            <div aria-hidden="true" className="absolute h-[72%] w-[72%] rotate-[42deg] rounded-[50%] border border-[#7C5CFC]/40 shadow-[0_0_35px_rgba(124,92,252,0.08)]" />

            <div className="absolute left-[15%] top-[24%] h-3 w-3 rounded-full bg-[#00D4FF] shadow-[0_0_22px_#00D4FF]" />
            <div className="absolute bottom-[19%] right-[19%] h-3 w-3 rounded-full bg-[#A78BFA] shadow-[0_0_22px_#7C5CFC]" />
            <div className="absolute right-[17%] top-[29%] h-2 w-2 rounded-full bg-[#F0A6FF] shadow-[0_0_18px_#F0A6FF]" />

            <div className="relative z-10 flex h-36 w-36 flex-col items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#172B48] to-[#11142B] shadow-[0_0_65px_rgba(0,212,255,0.13)] md:h-44 md:w-44">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00D4FF]/20 bg-[#00D4FF]/10">
                <Sparkles size={25} className="text-[#00D4FF]" />
              </div>
              <span className="text-sm font-extrabold tracking-[0.22em] text-white">
                KLYVOR
              </span>
              <span className="mt-1 text-[8px] font-semibold tracking-[0.17em] text-slate-500">
                BEYOND WHAT'S POSSIBLE.
              </span>
            </div>

            <div className="absolute left-0 top-[48%] rounded-xl border border-white/[0.08] bg-[#111B30]/90 px-3 py-2 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Layers3 size={14} className="text-[#00D4FF]" />
                <span className="text-[10px] font-semibold text-slate-300">
                  Organisation
                </span>
              </div>
            </div>

            <div className="absolute right-0 top-[49%] rounded-xl border border-white/[0.08] bg-[#111B30]/90 px-3 py-2 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Compass size={14} className="text-[#A78BFA]" />
                <span className="text-[10px] font-semibold text-slate-300">
                  Possibility
                </span>
              </div>
            </div>

            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/[0.08] bg-[#111B30]/90 px-4 py-2 text-[10px] font-semibold tracking-wider text-slate-400 shadow-xl">
              ONE PLATFORM · MORE POSSIBILITIES
            </div>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="relative overflow-hidden border-b border-white/[0.06] bg-[#0B1222] px-4 py-24 sm:px-6 md:py-28 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#7C5CFC]/[0.06] blur-[120px]"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-[#7C5CFC]/[0.07] px-4 py-2">
              <Sparkles size={14} className="text-[#A99AFF]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B9ABFF]">
                Access that fits your needs
              </span>
            </div>

            <h2 className="mb-5 text-3xl font-bold leading-tight text-white md:text-5xl">
              Your workspace.
              <span className="block bg-gradient-to-r from-[#00D4FF] to-[#A78BFA] bg-clip-text text-transparent">
                Your way forward.
              </span>
            </h2>

            <p className="text-sm leading-8 text-slate-400 md:text-base">
              Different people need different tools. Choose the access
              that suits your needs today, with room to explore more
              capabilities as your work evolves.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((principle, index) => (
              <div
                key={principle.number}
                className={`group relative overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                  index === 1
                    ? "border-[#00D4FF]/25 bg-gradient-to-br from-[#142B42] to-[#141A34] shadow-[0_15px_45px_rgba(0,212,255,0.07)]"
                    : "border-white/[0.08] bg-[#111B2E]"
                }`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span
                    className={`font-mono text-3xl font-bold ${
                      index === 1 ? "text-[#00D4FF]/70" : "text-slate-600"
                    }`}
                  >
                    {principle.number}
                  </span>
                  <ArrowUpRight
                    size={19}
                    className="text-slate-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#00D4FF]"
                  />
                </div>

                <h3 className="mb-3 text-lg font-bold text-white">
                  {principle.title}
                </h3>
                <p className="text-sm leading-7 text-slate-400">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00BBD8] to-[#7256E8] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(0,212,255,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,212,255,0.22)]"
            >
              Explore Plans
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
