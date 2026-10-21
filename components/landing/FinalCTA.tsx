import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-32 bg-[#0B1020] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Make Room for What's Next.</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Bring greater structure to your work, keep your priorities in view and discover a more connected way to manage your professional life.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="w-full sm:w-auto bg-klyvor-gradient text-white px-8 py-4 rounded-full font-semibold text-base hover:opacity-90 transition-opacity">
            Get Started Free
          </Link>
          <Link href="#platform" className="w-full sm:w-auto border border-border bg-transparent text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/5 transition-colors">
            Explore KLYVOR
          </Link>
        </div>
      </div>
    </section>
  );
}
