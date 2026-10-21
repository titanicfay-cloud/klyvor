import { UserPlus, Search, Zap } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-3 block">Simple By Design</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">A Clearer Way to Get Things Done.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Start with the work that matters to you. Choose the tools you need, establish your own way of working and build from there.</p>
        </div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-primary via-secondary to-success opacity-30"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#0B1020] border-2 border-primary rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,212,255,0.15)]">
              <UserPlus className="text-primary w-6 h-6" />
            </div>
            <span className="text-primary font-mono text-xs mb-2">STEP 01</span>
            <h3 className="text-lg font-bold text-white mb-2">Start With Your Work.</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">Create your account and establish a workspace for the activities, responsibilities and goals that matter to you.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#0B1020] border-2 border-secondary rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(124,92,252,0.15)]">
              <Search className="text-secondary w-6 h-6" />
            </div>
            <span className="text-secondary font-mono text-xs mb-2">STEP 02</span>
            <h3 className="text-lg font-bold text-white mb-2">Make It Your Own.</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">Explore the available tools and choose the ones that fit your current needs, from organising tasks to managing documents and planning your work.</p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#0B1020] border-2 border-success rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <Zap className="text-success w-6 h-6" />
            </div>
            <span className="text-success font-mono text-xs mb-2">STEP 03</span>
            <h3 className="text-lg font-bold text-white mb-2">Move Forward With Clarity.</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">Use your workspace to keep important activities organised and develop a working routine that suits you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
