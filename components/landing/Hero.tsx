import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-4 block">One Platform. More Possibilities.</span>
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.15] mb-6">
              Your Work. Your Ideas. <br className="hidden lg:block" />
              Your World. <span className="text-klyvor-gradient">One Platform.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              KLYVOR brings your projects, clients, documents, and financial planning into one intelligent workspace. Manage what matters, work with greater clarity, and make room for what's next.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
              <Link href="/signup" className="w-full sm:w-auto bg-klyvor-gradient text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity text-center">Get Started Free</Link>
              <Link href="#platform" className="w-full sm:w-auto border border-border bg-card/50 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-muted transition-colors text-center">Explore the Platform</Link>
            </div>
            <p className="text-xs text-muted-foreground">Built for independent professionals, ambitious creators and growing businesses.</p>
          </div>
          <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-primary/10 blur-[80px] rounded-full"></div>
              <div className="absolute top-10 right-10 w-40 h-28 bg-card border border-border rounded-xl shadow-2xl p-4 transform rotate-6 hover:rotate-0 transition-transform duration-500"><div className="w-8 h-8 rounded bg-success/20 mb-3"></div><div className="w-full h-2 bg-muted rounded mb-2"></div><div className="w-2/3 h-2 bg-muted rounded"></div></div>
              <div className="absolute bottom-16 left-4 w-48 h-32 bg-[#111A2E] border border-primary/30 rounded-xl shadow-2xl p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10"><div className="flex gap-2 mb-3"><div className="w-2.5 h-2.5 rounded-full bg-destructive"></div><div className="w-2.5 h-2.5 rounded-full bg-warning"></div><div className="w-2.5 h-2.5 rounded-full bg-success"></div></div><div className="w-full h-2 bg-primary/50 rounded mb-2"></div><div className="w-5/6 h-2 bg-muted rounded mb-2"></div><div className="w-4/6 h-2 bg-muted rounded"></div></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-40 bg-card border border-secondary/30 rounded-xl shadow-2xl p-5 transform hover:scale-105 transition-transform duration-500 z-20 backdrop-blur-sm"><div className="flex items-center gap-3 mb-4"><div className="w-8 h-8 rounded-full bg-klyvor-gradient"></div><div><div className="w-20 h-2 bg-white/80 rounded mb-1.5"></div><div className="w-12 h-2 bg-muted rounded"></div></div></div><div className="space-y-2"><div className="w-full h-7 bg-muted/50 rounded flex items-center px-3"><div className="w-1/2 h-1.5 bg-white/40 rounded"></div></div><div className="w-full h-7 bg-muted/50 rounded flex items-center px-3"><div className="w-2/3 h-1.5 bg-white/40 rounded"></div></div></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
