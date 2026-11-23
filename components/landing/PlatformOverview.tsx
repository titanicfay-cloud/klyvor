
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  FileText,
  FolderKanban,
  Layers3,
  TrendingUp,
} from "lucide-react";

const areas = [
  {
    number: "01",
    label: "PRODUCTIVITY",
    title: "Bring Your Work Into Focus.",
    description:
      "Give your responsibilities structure. Organise tasks, plan projects and keep important priorities within view.",
    link: "Explore Productivity",
    accent: "#00D4FF",
    icon: FolderKanban,
    features: ["Task organisation", "Project planning", "Progress tracking"],
  },
  {
    number: "02",
    label: "DOCUMENTS",
    title: "Keep Your Ideas Within Reach.",
    description:
      "Create, organise and revisit the information that supports your work. Give important notes a clear place to live.",
    link: "Explore Documents",
    accent: "#7C5CFC",
    icon: FileText,
    features: ["Quick notes", "Rich documents", "Organised information"],
  },
  {
    number: "03",
    label: "BUSINESS",
    title: "Make Decisions With Clarity.",
    description:
      "Bring structure to professional decisions with tools designed to help you estimate costs, understand pricing and plan your next steps.",
    link: "Discover Business Tools",
    accent: "#38D6B0",
    icon: TrendingUp,
    features: ["Pricing calculations", "Client management", "Business planning"],
  },
];

export default function PlatformOverview() {
  return (
    <section
      id="platform"
      className="relative overflow-hidden bg-[#0B1020] py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-180px] top-20 h-[420px] w-[420px] rounded-full bg-[#00D4FF]/[0.06] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-180px] bottom-0 h-[420px] w-[420px] rounded-full bg-[#7C5CFC]/[0.08] blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.28em] text-[#00D4FF]">
            The KLYVOR Platform
          </span>

          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            One platform.
            <span className="block bg-gradient-to-r from-[#00D4FF] via-[#A5B4FC] to-[#7C5CFC] bg-clip-text text-transparent">
              More room to grow.
            </span>
          </h2>

          <p className="max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Professional work involves more than completing individual tasks.
            It takes planning, organisation, financial clarity and the ability
            to keep important information within reach.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {areas.map((area, index) => {
            const Icon = area.icon;

            return (
              <article
                key={area.number}
                className={`group relative min-h-[470px] overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-[#17213A] via-[#101A30] to-[#0D1427] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(0,212,255,0.09)] md:p-8 ${
                  index === 0 ? "lg:translate-y-5" : ""
                } ${index === 2 ? "lg:-translate-y-5" : ""}`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-[80px] transition-opacity duration-500 group-hover:opacity-40"
                  style={{ backgroundColor: area.accent }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-slate-500">
                    {area.number} / {area.label}
                  </span>

                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"
                    style={{ color: area.accent }}
                  >
                    <Icon size={21} />
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="relative mx-auto my-10 flex h-44 items-center justify-center [perspective:900px]"
                >
                  <div
                    className="absolute h-36 w-36 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: area.accent }}
                  />

                  <div
                    className="relative flex h-32 w-40 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-transform duration-700 group-hover:[transform:rotateY(-12deg)_rotateX(8deg)_translateY(-8px)]"
                    style={{
                      boxShadow: `0 25px 60px rgba(0,0,0,0.35), 0 0 35px ${area.accent}18`,
                      transform: "rotateY(-14deg) rotateX(8deg)",
                    }}
                  >
                    <div className="absolute inset-x-4 top-4 h-px bg-white/15" />
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: `${area.accent}18`,
                          color: area.accent,
                        }}
                      >
                        <Icon size={29} strokeWidth={1.5} />
                      </div>
                      <div className="h-1.5 w-20 rounded-full bg-white/15" />
                      <div className="h-1 w-12 rounded-full bg-white/10" />
                    </div>
                  </div>

                  <div
                    className="absolute bottom-3 right-[12%] flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-[#17213A] shadow-xl transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"
                    style={{ color: area.accent }}
                  >
                    {index === 0 ? (
                      <FolderKanban size={19} />
                    ) : index === 1 ? (
                      <Layers3 size={19} />
                    ) : (
                      <TrendingUp size={19} />
                    )}
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">
                    {area.title}
                  </h3>

                  <p className="mb-6 text-sm leading-7 text-slate-400">
                    {area.description}
                  </p>

                  <div className="mb-7 space-y-2.5">
                    {area.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2.5 text-xs text-slate-300"
                      >
                        <CheckCircle2
                          size={14}
                          style={{ color: area.accent }}
                        />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-all hover:gap-3"
                  >
                    {area.link}
                    <ArrowRight size={16} style={{ color: area.accent }} />
                  </Link>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: area.accent }}
                />
              </article>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Layers3 size={16} className="text-[#00D4FF]" />
            A connected workspace for professional growth
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/[0.08]"
          >
            Discover KLYVOR
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
 }
