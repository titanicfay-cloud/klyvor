
import {
  ArrowRight,
  Calculator,
  FileText,
  FolderKanban,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

const scatteredTools = [
  {
    label: "Tasks",
    detail: "Different places",
    icon: FolderKanban,
    position: "left-0 top-5 -rotate-12",
    color: "#00D4FF",
  },
  {
    label: "Documents",
    detail: "Hard to organise",
    icon: FileText,
    position: "right-0 top-12 rotate-12",
    color: "#7C5CFC",
  },
  {
    label: "Calculations",
    detail: "Separate workflows",
    icon: Calculator,
    position: "left-5 bottom-8 rotate-6",
    color: "#38D6B0",
  },
  {
    label: "Client details",
    detail: "Disconnected records",
    icon: Users,
    position: "right-3 bottom-3 -rotate-6",
    color: "#F0B86B",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/[0.06] bg-[#0B1020] py-24 md:py-32">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#7C5CFC]/[0.07] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#00D4FF]/[0.06] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Story */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F0B86B]/20 bg-[#F0B86B]/[0.06] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F0B86B]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F0B86B]">
                The problem we're solving
              </span>
            </div>

            <h2 className="mb-7 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              Your work shouldn't be
              <span className="block bg-gradient-to-r from-[#00D4FF] to-[#7C5CFC] bg-clip-text text-transparent">
                scattered everywhere.
              </span>
            </h2>

            <div className="space-y-5 text-base leading-8 text-slate-400">
              <p>
                Important tasks live in one place. Documents sit somewhere
                else. Plans, calculations and ideas are spread across
                different tools.
              </p>

              <p>
                Before meaningful work can move forward, you often have to
                spend time finding, organising and reconnecting everything.
                That fragmentation can make professional life feel more
                complicated than it needs to be.
              </p>
            </div>

            <div className="mt-9 rounded-2xl border border-[#00D4FF]/20 bg-gradient-to-br from-[#00D4FF]/[0.08] to-[#7C5CFC]/[0.06] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.2)]">
              <div className="mb-3 flex items-center gap-2 text-[#00D4FF]">
                <Zap size={17} />
                <span className="text-xs font-bold uppercase tracking-[0.16em]">
                  A better approach
                </span>
              </div>

              <p className="text-sm leading-7 text-slate-200 md:text-base">
                KLYVOR is built around a simpler idea: bring useful
                professional tools together in one coherent environment,
                so managing your work becomes a more organised part of
                doing it.
              </p>
            </div>
          </div>

          {/* Visual transformation */}
          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="relative h-[460px] overflow-hidden rounded-[32px] border border-white/[0.07] bg-gradient-to-br from-[#111C32] via-[#0D172B] to-[#101027] shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:h-[500px]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.16]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "35px 35px",
                }}
              />

              {/* Visual heading */}
              <div className="absolute left-6 top-6 z-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  The transformation
                </span>
                <p className="mt-1 text-sm font-semibold text-white">
                  From scattered to connected
                </p>
              </div>

              {/* Scattered tools */}
              <div className="absolute inset-x-0 top-24 h-56">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Disconnected workflows
                </div>

                {scatteredTools.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <div
                      key={tool.label}
                      className={`absolute ${tool.position} flex w-[145px] items-center gap-3 rounded-xl border border-white/10 bg-[#1A263B]/90 p-3 shadow-xl backdrop-blur-xl transition-transform duration-500 hover:scale-105`}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${tool.color}18`, color: tool.color }}
                      >
                        <Icon size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">
                          {tool.label}
                        </p>
                        <p className="truncate text-[9px] text-slate-500">
                          {tool.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Transformation beam */}
              <div className="absolute left-1/2 top-[275px] flex -translate-x-1/2 items-center gap-3">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#00D4FF]/50" />
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 text-[#00D4FF] shadow-[0_0_25px_rgba(0,212,255,0.2)]">
                  <ArrowRight size={17} />
                </div>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#7C5CFC]/50" />
              </div>

              {/* Unified workspace */}
              <div className="absolute bottom-7 left-1/2 w-[82%] -translate-x-1/2">
                <div className="relative rounded-2xl border border-[#00D4FF]/30 bg-gradient-to-br from-[#172A43] via-[#121E36] to-[#1A1738] p-5 shadow-[0_0_60px_rgba(0,212,255,0.12)]">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-[#00D4FF]/10 to-[#7C5CFC]/10 blur-2xl"
                  />

                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7C5CFC] text-white shadow-lg">
                        <Workflow size={19} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          KLYVOR
                        </p>
                        <p className="text-[9px] text-slate-400">
                          Connected workspace
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-[#38D6B0]/20 bg-[#38D6B0]/10 px-2.5 py-1 text-[9px] font-semibold text-[#38D6B0]">
                      Connected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Tasks", icon: FolderKanban },
                      { label: "Documents", icon: FileText },
                      { label: "Planning", icon: Calculator },
                      { label: "Clients", icon: Users },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-3"
                        >
                          <Icon size={14} className="text-[#00D4FF]" />
                          <span className="text-[10px] font-medium text-slate-300">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#38D6B0]" />
                    <span className="text-[9px] text-slate-400">
                      Your professional work, brought together.
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 right-5 text-[8px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                Beyond What's Possible.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
          }
