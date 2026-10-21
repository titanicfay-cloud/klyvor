import Link from "next/link";

export default function BrandStatement() {
  return (
    <>
      <section className="py-32 bg-[#050812] text-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-white/50 font-bold text-xs tracking-[0.3em] uppercase mb-8 block">The Klyvor Philosophy</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            More Than a Collection of Tools. <br/>
            <span className="text-klyvor-gradient">A Better Way to Work.</span>
          </h2>
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto space-y-6">
            <p>KLYVOR is built around a simple idea: the tools you use should help you move forward, not create more complexity. Your work is connected. Your ideas influence your plans. Your plans shape what you do next.</p>
            <p>We're building a platform designed to bring these activities into a more coherent environment—one that can grow with your needs, your ambitions and the way you work.</p>
          </div>
          <p className="text-white font-semibold mt-12 text-xl">Start with what you need today. Build toward what comes next.</p>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-3 block">Access That Fits Your Needs</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start With What You Need. Grow From There.</h2>
              <p className="text-lg text-muted-foreground mb-8">Different people need different tools. KLYVOR is being designed to support a range of working styles, with access options that make it easier to choose the capabilities that suit you.</p>
              <Link href="#pricing" className="inline-block bg-white text-[#0B1020] px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                Explore Plans
              </Link>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                  <h4 className="text-white font-bold mb-1 text-sm">Start Simply</h4>
                  <p className="text-xs text-muted-foreground">Begin with the tools you need today.</p>
                </div>
                <div className="bg-card border border-primary/30 p-4 rounded-xl text-center shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                  <h4 className="text-primary font-bold mb-1 text-sm">Choose What Fits</h4>
                  <p className="text-xs text-muted-foreground">Select capabilities for your style.</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                  <h4 className="text-white font-bold mb-1 text-sm">Expand Over Time</h4>
                  <p className="text-xs text-muted-foreground">Explore more as your needs evolve.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
