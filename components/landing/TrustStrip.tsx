import { Layers, Target, TrendingUp } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="bg-[#111A2E] border-y border-[#27344B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#27344B]">
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-2 md:pr-8">
            <Layers className="text-primary w-6 h-6 mb-2" />
            <h3 className="text-white text-sm font-semibold tracking-wide uppercase">01 — One Connected Workspace</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Bring essential professional activities together in one organised environment.</p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-2 md:px-8 pt-8 md:pt-0">
            <Target className="text-secondary w-6 h-6 mb-2" />
            <h3 className="text-white text-sm font-semibold tracking-wide uppercase">02 — Designed Around Real Work</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Practical tools built around the everyday demands of planning, creating and managing work.</p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-2 md:pl-8 pt-8 md:pt-0">
            <TrendingUp className="text-success w-6 h-6 mb-2" />
            <h3 className="text-white text-sm font-semibold tracking-wide uppercase">03 — Built to Grow With You</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">A modular platform designed to evolve alongside your needs and ambitions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
