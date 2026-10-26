import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-[#0B1020] border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Make Room for What's Next.</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
            Bring greater structure to your work, keep your priorities in view and discover a more connected way to manage your professional life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/signup" className="w-full sm:w-auto bg-klyvor-gradient text-white px-8 py-4 rounded-full font-semibold text-base hover:opacity-90 transition-opacity">
              Get Started Free
            </Link>
            {/* FIXED: Changed href from #platform to /about */}
            <Link href="/about" className="w-full sm:w-auto border border-border bg-background text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-muted transition-colors">
              Explore KLYVOR
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
