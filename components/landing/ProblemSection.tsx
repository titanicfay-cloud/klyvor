export default function ProblemSection() {
  return (
    <section className="py-24 bg-[#0B1020] border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <span className="text-destructive font-bold text-xs tracking-[0.2em] uppercase mb-3 block">The Problem We're Solving</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Your Work Shouldn't Be Scattered Everywhere.</h2>
            <div className="space-y-4 text-base text-muted-foreground">
              <p>Important tasks live in one place. Documents sit somewhere else. Plans, calculations and ideas are spread across different tools.</p>
              <p>Before meaningful work can move forward, you often have to spend time finding, organising and reconnecting everything. That fragmentation can make professional life feel more complicated than it needs to be.</p>
              <p className="text-white font-medium border-l-2 border-primary pl-4 py-1">KLYVOR is being built around a simpler idea: bring useful tools together in one coherent environment, so managing your work becomes a more organised part of doing it.</p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative h-[400px] flex items-center justify-center">
             {/* Scattered side */}
             <div className="absolute top-0 left-0 w-40 h-24 bg-muted/20 border border-border/50 rounded-lg p-3 transform -rotate-12 opacity-50">
                <div className="w-full h-1.5 bg-muted-foreground/30 rounded mb-2"></div>
                <div className="w-3/4 h-1.5 bg-muted-foreground/30 rounded"></div>
             </div>
             <div className="absolute bottom-10 left-10 w-40 h-24 bg-muted/20 border border-border/50 rounded-lg p-3 transform rotate-6 opacity-50">
                <div className="w-full h-1.5 bg-muted-foreground/30 rounded mb-2"></div>
                <div className="w-1/2 h-1.5 bg-muted-foreground/30 rounded"></div>
             </div>
             <div className="absolute top-10 right-0 w-40 h-24 bg-muted/20 border border-border/50 rounded-lg p-3 transform rotate-12 opacity-50">
                <div className="w-full h-1.5 bg-muted-foreground/30 rounded mb-2"></div>
                <div className="w-2/3 h-1.5 bg-muted-foreground/30 rounded"></div>
             </div>
             
             {/* Organized side (Klyvor) */}
             <div className="relative w-64 h-64 bg-card border border-primary/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,212,255,0.1)] z-10 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-klyvor-gradient mb-4 flex items-center justify-center">
                   <span className="text-white font-bold text-xl">K</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Coherent Workspace</h4>
                <p className="text-xs text-muted-foreground">Clearer structure.<br/>Useful tools.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
