
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0B1020] pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#7C5CFC]/10 blur-[130px]" />
        <div className="absolute right-[-12rem] top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#00D4FF]/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Hero copy */}
        <div className="relative z-10 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#69E5FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]" />
            One platform. More possibilities.
          </div>

          <h1 className="mb-7 text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.4rem]">
            Your work deserves
            <br />
            <span className="bg-gradient-to-r from-[#00D4FF] via-[#8C8AFF] to-[#7C5CFC] bg-clip-text text-transparent">
              a bigger universe.
            </span>
          </h1>

          <p className="mx-auto mb-9 max-w-xl text-base leading-8 text-slate-400 sm:text-lg lg:mx-0">
            Bring your projects, clients, documents and business tools
            together in one connected professional workspace. Less
            fragmentation. More room to move forward.
          </p>

          <div className="mb-7 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href="/signup"
              className="rounded-full bg-gradient-to-r from-[#00BFEA] to-[#7357F5] px-8 py-4 text-sm font-bold text-white shadow-[0_8px_35px_rgba(0,212,255,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(124,92,252,0.35)]"
            >
              Get Started Free
              <span className="ml-2">→</span>
            </Link>

            <Link
              href="/about"
              className="rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:border-[#00D4FF]/50 hover:bg-white/[0.08]"
            >
              Explore the Platform
            </Link>
          </div>

          <p className="text-xs tracking-wide text-slate-500">
            Built for independent professionals, creators and growing
            businesses.
          </p>
        </div>

        {/* Orbital workspace visual */}
        <div className="relative mx-auto w-full max-w-[580px]">
          <div className="relative aspect-square w-full">
            {/* Outer atmospheric glow */}
            <div className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#00D4FF]/15 to-[#7C5CFC]/15 blur-[65px]" />

            {/* Orbital rings */}
            <div className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00D4FF]/15 [transform:translate(-50%,-50%)_rotateX(66deg)]" />
            <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7C5CFC]/30 [transform:translate(-50%,-50%)_rotateX(66deg)_rotateZ(-35deg)]" />
            <div className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00D4FF]/20 [transform:translate(-50%,-50%)_rotateX(66deg)_rotateZ(35deg)]" />

            {/* Orbiting points */}
            <div className="absolute left-[13%] top-[42%] h-3 w-3 rounded-full bg-[#00D4FF] shadow-[0_0_22px_6px_rgba(0,212,255,0.5)] motion-safe:animate-[pulse_3s_ease-in-out_infinite]" />
            <div className="absolute right-[15%] top-[25%] h-2.5 w-2.5 rounded-full bg-[#9C83FF] shadow-[0_0_20px_5px_rgba(124,92,252,0.6)] motion-safe:animate-[pulse_4s_ease-in-out_infinite]" />
            <div className="absolute bottom-[17%] left-[35%] h-2 w-2 rounded-full bg-[#00D4FF] shadow-[0_0_18px_5px_rgba(0,212,255,0.5)]" />

            {/* Central orbital object */}
            <div className="absolute left-1/2 top-1/2 z-10 flex h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#1C3154] via-[#121D39] to-[#251B50] shadow-[0_0_80px_rgba(0,212,255,0.16),inset_0_0_45px_rgba(124,92,252,0.2)]">
              <div className="absolute inset-[9%] rounded-full border border-[#00D4FF]/30" />
              <div className="absolute inset-[20%] rounded-full border border-[#7C5CFC]/40" />
              <div className="absolute h-[48%] w-[48%] rounded-full bg-gradient-to-br from-[#00D4FF] via-[#557CFF] to-[#7C5CFC] opacity-90 blur-[1px] shadow-[0_0_45px_rgba(0,212,255,0.45)]" />
              <div className="absolute h-[28%] w-[28%] rounded-full bg-[#E5FAFF] opacity-90 blur-[12px]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.04] to-white/20" />
            </div>

            {/* Floating workspace panel: projects */}
            <div className="absolute left-[-1%] top-[15%] z-20 w-[43%] rounded-2xl border border-white/15 bg-[#111C32]/85 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl motion-safe:animate-[bounce_7s_ease-in-out_infinite] [animation-direction:alternate] sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</span>
                <span className="h-2 w-2 rounded-full bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]" />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00D4FF]/15 text-[#00D4FF]">◇</div>
                <div>
                  <div className="h-2 w-20 rounded bg-white/75" />
                  <div className="mt-1.5 h-1.5 w-12 rounded bg-slate-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7C5CFC]" /></div>
                <div className="h-1.5 w-3/4 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Floating workspace panel: documents */}
            <div className="absolute right-[-1%] top-[20%] z-20 w-[40%] rounded-2xl border border-[#7C5CFC]/30 bg-[#17172F]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl motion-safe:animate-[bounce_8s_ease-in-out_infinite] [animation-direction:alternate] sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C5CFC]/20 text-[#A998FF]">▤</div>
                <div>
                  <div className="text-[11px] font-semibold text-white">Documents</div>
                  <div className="mt-1 text-[9px] text-slate-500">Your work, organised</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full rounded bg-white/15" />
                <div className="h-1.5 w-4/5 rounded bg-white/10" />
                <div className="h-1.5 w-2/3 rounded bg-white/10" />
              </div>
            </div>

            {/* Floating workspace panel: clients */}
            <div className="absolute bottom-[12%] left-[13%] z-20 w-[43%] rounded-2xl border border-[#00D4FF]/20 bg-[#101D30]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl motion-safe:animate-[bounce_9s_ease-in-out_infinite] [animation-direction:alternate] sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00D4FF]/10 text-[#69E5FF]">◎</div>
                <div>
                  <div className="text-[11px] font-semibold text-white">Business tools</div>
                  <div className="mt-1 text-[9px] text-slate-500">Connected in one place</div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="h-7 flex-1 rounded-lg border border-white/10 bg-white/[0.04]" />
                <div className="h-7 flex-1 rounded-lg border border-white/10 bg-white/[0.04]" />
                <div className="h-7 flex-1 rounded-lg border border-white/10 bg-white/[0.04]" />
              </div>
            </div>

            {/* Small accent marker */}
            <div className="absolute bottom-[22%] right-[8%] z-20 rounded-full border border-white/10 bg-[#101A30]/90 px-3 py-2 text-[9px] font-semibold tracking-widest text-[#8DEBFF] shadow-xl backdrop-blur-xl">
              KLYVOR
            </div>
          </div>
        </div>
      </div>
    </section>
  );
              }
