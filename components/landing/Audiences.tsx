
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  FileText,
  GraduationCap,
  Palette,
  Receipt,
  Sparkles,
  Users,
  ClipboardList,
} from "lucide-react";

const audiences = [
  {
    number: "01",
    title: "Freelancers & Independent Professionals",
    description:
      "Take control of your independent work. Organise projects, manage clients, prepare invoices, calculate your rates and keep everything moving.",
    icon: BriefcaseBusiness,
    accent: "#00D4FF",
    tools: ["Projects", "Clients", "Invoices", "Pricing"],
  },
  {
    number: "02",
    title: "Entrepreneurs & Business Owners",
    description:
      "Bring structure to your business activities. Manage expenses, track important work, organise documents and stay on top of operations.",
    icon: Building2,
    accent: "#7C5CFC",
    tools: ["Expenses", "Documents", "Planning", "Business"],
  },
  {
    number: "03",
    title: "Creators & Digital Professionals",
    description:
      "Turn ideas into organised work. Plan activities, manage responsibilities, prepare proposals and keep your creative projects on track.",
    icon: Palette,
    accent: "#F0A6FF",
    tools: ["Tasks", "Documents", "Projects", "Proposals"],
  },
  {
    number: "04",
    title: "Career Builders & Job Seekers",
    description:
      "Present yourself professionally. Create your CV, prepare important documents, organise career goals and plan your next move.",
    icon: GraduationCap,
    accent: "#38D6B0",
    tools: ["CV Builder", "Documents", "Tasks", "Planning"],
  },
  {
    number: "05",
    title: "Teams & Growing Organisations",
    description:
      "Create more structure around collaborative work, responsibilities and the activities that keep your organisation moving.",
    icon: Users,
    accent: "#FFBE69",
    tools: ["Team Workspace", "Projects", "Tasks", "Operations"],
  },
];

const tools = [
  { label: "Task Management", icon: ClipboardList },
  { label: "Expense Tracking", icon: Receipt },
  { label: "Invoice Creation", icon: FileText },
  { label: "Document Writing", icon: FileText },
  { label: "CV Creation", icon: BriefcaseBusiness },
  { label: "Project Pricing", icon: Calculator },
];

export default function Audiences() {
  return (
    <section
      id="solutions"
      className="relative isolate overflow-hidden border-y border-white/[0.06] bg-[#0B1222] py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#00D4FF]/[0.05] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-[#7C5CFC]/[0.07] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/25 bg-[#7C5CFC]/[0.08] px-4 py-2">
            <Sparkles size={14} className="text-[#A99AFF]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B9ABFF]">
              Made for the way you work
            </span>
          </div>

          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            One workspace.
            <span className="block bg-gradient-to-r from-[#00D4FF] via-[#A5B4FC] to-[#7C5CFC] bg-clip-text text-transparent">
              Different people. Endless possibilities.
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Whether you're building a business, developing your career,
            working independently or simply trying to stay organised,
            KLYVOR brings useful professional tools together in one
            connected workspace.
          </p>
        </div>

        {/* Audience cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <article
                key={audience.number}
                className="group relative flex flex-col overflow-hidden rounded-[26px] border border-white/[0.08] bg-gradient-to-br from-[#17243A] via-[#111D32] to-[#0F1729] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_30px_75px_rgba(0,0,0,0.32)]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-[0.08] blur-[65px] transition-opacity duration-500 group-hover:opacity-25"
                  style={{ backgroundColor: audience.accent }}
                />

                <div className="relative mb-7 flex items-center justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1020] shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      boxShadow: `0 0 28px ${audience.accent}16`,
                    }}
                  >
                    <Icon
                      size={25}
                      style={{ color: audience.accent }}
                      strokeWidth={1.7}
                    />
                  </div>

                  <span
                    className="font-mono text-3xl font-bold opacity-20"
                    style={{ color: audience.accent }}
                  >
                    {audience.number}
                  </span>
                </div>

                <h3 className="relative mb-3 text-xl font-bold leading-snug text-white">
                  {audience.title}
                </h3>

                <p className="relative mb-7 flex-grow text-sm leading-7 text-slate-400">
                  {audience.description}
                </p>

                <div className="relative flex flex-wrap gap-2 border-t border-white/[0.07] pt-5">
                  {audience.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[10px] font-medium text-slate-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/* Everyone welcome */}
        <div className="relative mt-8 overflow-hidden rounded-[28px] border border-[#00D4FF]/20 bg-gradient-to-br from-[#132B40] via-[#142039] to-[#211B43] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.25)] md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#00D4FF]/10 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-[#7C5CFC]/10 blur-[90px]"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="mb-5 flex items-center gap-2 text-[#00D4FF]">
                <Sparkles size={17} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  And everyone in between
                </span>
              </div>

              <h3 className="mb-5 text-2xl font-bold leading-tight text-white md:text-4xl">
                You don't need a job title to need a better workspace.
              </h3>

              <p className="max-w-xl text-sm leading-8 text-slate-300 md:text-base">
                Maybe you just want to manage your daily tasks, keep track
                of expenses, create invoices, write documents, build a CV,
                calculate project prices or organise your personal and
                professional responsibilities. You belong here too.
              </p>

              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#00D4FF]">
                <CheckCircle2 size={17} />
                One place for more of the work that matters.
              </div>
            </div>

            {/* Tool showcase */}
            <div className="relative rounded-2xl border border-white/10 bg-[#0A1121]/70 p-5 shadow-2xl backdrop-blur-xl md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">
                    Your professional toolkit
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Useful tools. One connected workspace.
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#00D4FF]/20 bg-[#00D4FF]/10">
                  <Sparkles size={17} className="text-[#00D4FF]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {tools.map((tool, index) => {
                  const ToolIcon = tool.icon;

                  return (
                    <div
                      key={tool.label}
                      className="flex min-h-[68px] items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 transition-all duration-300 hover:border-[#00D4FF]/25 hover:bg-white/[0.07]"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          index % 2 === 0
                            ? "bg-[#00D4FF]/10 text-[#00D4FF]"
                            : "bg-[#7C5CFC]/15 text-[#A99AFF]"
                        }`}
                      >
                        <ToolIcon size={17} />
                      </div>
                      <span className="text-xs font-medium text-slate-300">
                        {tool.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3 text-xs text-slate-400">
                <Sparkles size={14} className="text-[#A99AFF]" />
                And many more tools to explore
              </div>
            </div>
          </div>
        </div>

        {/* Closing line */}
        <div className="mt-14 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-slate-400">
            However you work. Whatever you're working towards.
          </p>
          <p className="mt-2 bg-gradient-to-r from-[#00D4FF] to-[#A99AFF] bg-clip-text text-lg font-bold text-transparent md:text-xl">
            There's room for you at KLYVOR.
          </p>
        </div>
      </div>
    </section>
  );
                }
