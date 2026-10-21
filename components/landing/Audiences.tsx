import { Briefcase, Building2, PenTool, GraduationCap } from "lucide-react";

export default function Audiences() {
  return (
    <section id="solutions" className="py-24 bg-card/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-secondary font-bold text-xs tracking-[0.2em] uppercase mb-3 block">Built For Different Working Styles</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">One Platform. Different Ways to Work.</h2>
          <p className="text-lg text-muted-foreground">Whether you're building a business, working independently, creating something new or developing your career, the way you organise your work matters.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Large Feature */}
          <div className="md:col-span-2 bg-gradient-to-br from-card to-[#111A2E] border border-border p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <Briefcase className="text-primary w-8 h-8 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Make Independent Work More Organised.</h3>
              <p className="text-muted-foreground">Manage your responsibilities, organise important documents and bring greater structure to the work you do for yourself and your clients.</p>
            </div>
            <div className="md:w-1/2 flex justify-center">
               <div className="w-full max-w-xs h-40 bg-background border border-border rounded-xl p-4 shadow-xl transform rotate-2">
                  <div className="w-full h-2 bg-primary/40 rounded mb-3"></div>
                  <div className="w-3/4 h-2 bg-muted rounded"></div>
               </div>
            </div>
          </div>

          {/* Smaller Cards */}
          <div className="bg-card border border-border p-8 rounded-3xl">
            <Building2 className="text-primary w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Build With Greater Clarity.</h3>
            <p className="text-muted-foreground text-sm">Bring essential planning and organisation tools into one environment as you manage the moving parts of your business.</p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl">
            <PenTool className="text-primary w-8 h-8 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Give Your Ideas a Structure.</h3>
            <p className="text-muted-foreground text-sm">Organise ideas, manage responsibilities and create a more consistent way to move from planning to execution.</p>
          </div>

          <div className="md:col-span-2 bg-card border border-border p-8 rounded-3xl flex items-center gap-6">
            <GraduationCap className="text-primary w-8 h-8 shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Make Space for Your Next Step.</h3>
              <p className="text-muted-foreground text-sm">Create a more organised environment for planning goals, managing responsibilities and developing your professional direction.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
