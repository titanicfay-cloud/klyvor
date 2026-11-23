
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Compass,
  Layers3,
  Rocket,
  UserPlus,
  Workflow,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Start With Your Work.",
    description:
      "Create your account and establish a workspace for the activities, responsibilities and goals that matter to you.",
    detail: "Your workspace begins here.",
    icon: UserPlus,
    accent: "#00D4FF",
    visual: "workspace",
  },
  {
    number: "02",
    title: "Make It Your Own.",
    description:
      "Explore the available tools and choose the ones that fit your current needs, from organising tasks to managing documents and planning your work.",
    detail: "Choose the tools you need.",
    icon: Compass,
    accent: "#7C5CFC",
    visual: "tools",
  },
  {
    number: "03",
    title: "Move Forward With Clarity.",
    description:
      "Use your workspace to keep important activities organised and develop a working routine that suits you.",
    detail: "Build momentum with structure.",
    icon: Rocket,
    accent: "#38D6B0",
    visual: "progress",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden border-y border-white/[0.06] bg-[#0D1528] py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#00D4FF]/[0.05] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#7C5CFC]/[0.07] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/[0.06] px-4 py-2">
            <Workflow size={14} className="text-[#00D4FF]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
              Simple by design
            </span>
          </div>

          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            A clearer way to
            <span className="block bg-gradient-to-r from-[#00D4FF] via-[#A5B4FC] to-[#7C5CFC] bg-clip-text text-transparent">
              get things done.
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Start with the work that matters to you. Choose the tools you
            need, establish your own way of working and build from there.
          </p>
        </div>

        <div className="relative grid gap-7 lg:grid-cols-3 lg:gap-6">
          {/* Desktop progression line */}
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-[39px] hidden h-px bg-gradient-to-r from-[#00D4FF]/50 via-[#7C5CFC]/50 to-[#38D6B0]/50 lg:block"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className={`group relative rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#17243B] via-[#111D32] to-[#101629] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-8 ${
                  index === 1 ? "lg:translate-y-7" : ""
                }`}
              >
                {/* Atmospheric accent */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-10 blur-[65px] transition-opacity duration-500 group-hover:opacity-30"
                  style={{ backgroundColor: step.accent }}
                />

                {/* Step indicator */}
                <div className="relative z-10 mb-8 flex items-center justify-between">
                  <div
                    className="flex h-[78px] w-[78px] items-center justify-center rounded-2xl border border-white/10 bg-[#0B1020] shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3"
                    style={{
                      boxShadow: `0 0 30px ${step.accent}18`,
                    }}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${step.accent}16`,
                        color: step.accent,
                      }}
                    >
                      <Icon size={24} strokeWidth={1.7} />
                    </div>
                  </div>

                  <span
                    className="font-mono text-4xl font-bold opacity-20"
                    style={{ color: step.accent }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Mini visual */}
                <div className="relative mb-8 flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0B1222]/80">
                  {step.visual === "workspace" && (
                    <div className="w-[75%] rounded-xl border border-[#00D4FF]/20 bg-[#14243A] p-3 shadow-xl transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="h-5 w-5 rounded-md bg-[#00D4FF]/20" />
                        <div className="h-1.5 w-20 rounded-full bg-white/20" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded-full bg-white/10" />
                        <div className="h-2 w-4/5 rounded-full bg-white/10" />
                        <div className="h-2 w-3/5 rounded-full bg-[#00D4FF]/30" />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <CheckCircle2 size={17} className="text-[#00D4FF]" />
                      </div>
                    </div>
                  )}

                  {step.visual === "tools" && (
                    <div className="grid w-[75%] grid-cols-3 gap-2 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                      {[Layers3, Compass, Workflow].map((ToolIcon, i) => (
                        <div
                          key={i}
                          className="flex h-16 items-center justify-center rounded-xl border border-white/10 bg-[#18213A] shadow-lg"
                          style={{
                            color: i === 1 ? "#7C5CFC" : "#A5B4FC",
                            transform: `translateY(${i === 1 ? "-8px" : "0"})`,
                          }}
                        >
                          <ToolIcon size={23} />
                        </div>
                      ))}
                    </div>
                  )}

                  {step.visual === "progress" && (
                    <div className="flex w-[75%] items-end justify-center gap-3 transition-transform duration-500 group-hover:scale-105">
                      {[35, 55, 75, 100].map((height, i) => (
                        <div
                          key={i}
                          className="relative flex w-9 items-end rounded-t-lg bg-[#38D6B0]/10"
                          style={{ height: `${height}px` }}
                        >
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-[#38D6B0]/40 to-[#38D6B0]"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                      <Rocket
                        size={25}
                        className="mb-2 text-[#38D6B0]"
                      />
                    </div>
                  )}
                </div>

                {/* Step content */}
                <div className="relative z-10">
                  <span
                    className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: step.accent }}
                  >
                    Step {step.number}
                  </span>

                  <h3 className="mb-3 text-xl font-bold leading-snug text-white md:text-2xl">
                    {step.title}
                  </h3>

                  <p className="min-h-[100px] text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 border-t border-white/[0.08] pt-5">
                    <CheckCircle2
                      size={15}
                      style={{ color: step.accent }}
                    />
                    <span className="text-xs font-medium text-slate-300">
                      {step.detail}
                    </span>
                  </div>
                </div>

                {/* Mobile progression */}
                {index !== 2 && (
                  <div className="absolute -bottom-7 left-1/2 z-20 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#101A2E] text-slate-500 lg:hidden">
                    <ArrowDown size={14} />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-20 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38D6B0]" />
            Your workflow. Your pace. Your workspace.
          </div>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#00D4FF]/50 to-transparent" />
        </div>
      </div>
    </section>
  );
                  }
