import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PlatformOverview() {
  return (
    <section id="platform" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-3 block">The Klyvor Platform</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Everything You Need to Move Forward.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Professional work involves more than completing individual tasks. It takes planning, organisation, financial clarity and the ability to keep important information within reach.
            KLYVOR brings these essential activities into one coherent environment, helping you spend less energy managing scattered tools and more energy moving your work forward.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Large Feature Area */}
          <div className="lg:col-span-2 bg-card border border-border p-8 md:p-12 rounded-2xl flex flex-col justify-between hover:border-primary/50 transition-colors relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-primary font-mono text-xs tracking-widest mb-4 block">01 / PRODUCTIVITY</span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Bring Your Work Into Focus.</h3>
              <p className="text-muted-foreground mb-6 max-w-md">Give your responsibilities structure. Organise tasks, plan projects and keep important priorities within view.</p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-8">
                <li>• Task management</li>
                <li>• Project planning</li>
                <li>• Calendar and deadline organisation</li>
              </ul>
            </div>
            <Link href="#productivity" className="text-white text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all relative z-10 w-max">
              Explore Productivity <ArrowRight size={16} className="text-primary" />
            </Link>
            {/* Abstract visual background */}
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="w-64 h-64 border-2 border-primary rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>
          </div>

          {/* Smaller Feature Area 1 */}
          <div className="bg-card border border-border p-8 rounded-2xl flex flex-col justify-between hover:border-secondary/50 transition-colors">
            <div>
              <span className="text-secondary font-mono text-xs tracking-widest mb-4 block">02 / DOCUMENTS</span>
              <h3 className="text-xl font-bold text-white mb-4">Keep Your Ideas Within Reach.</h3>
              <p className="text-muted-foreground text-sm mb-6">Create, organise and revisit the information that supports your work. Give important notes and documents a clear place to live.</p>
            </div>
            <Link href="#documents" className="text-white text-sm font-semibold flex items-center gap-2 hover:text-secondary transition-colors w-max">
              Explore Documents <ArrowRight size={16} />
            </Link>
          </div>

          {/* Smaller Feature Area 2 */}
          <div className="lg:col-span-3 bg-card border border-border p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-success/50 transition-colors">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <span className="text-success font-mono text-xs tracking-widest mb-4 block">03 / BUSINESS</span>
              <h3 className="text-xl font-bold text-white mb-2">Make Your Next Decision With Clarity.</h3>
              <p className="text-muted-foreground text-sm max-w-2xl">Bring structure to professional decisions with tools designed to help you estimate costs, understand pricing and plan your next steps.</p>
            </div>
            <Link href="#business" className="text-white text-sm font-semibold flex items-center gap-2 hover:text-success transition-colors w-max">
              Discover Business Tools <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
