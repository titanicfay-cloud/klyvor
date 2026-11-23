
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [
  { name: "About", href: "/about" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
];

export default function LandingNavStrip() {
  return (
    <section className="relative z-20 border-y border-white/[0.07] bg-[#0E182B]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-5 sm:px-6 md:justify-between lg:px-8">
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative py-1 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#00D4FF] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00AFCF] to-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(0,212,255,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(0,212,255,0.3)]"
        >
          Sign Up
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
