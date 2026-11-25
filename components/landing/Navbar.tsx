
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#0B1020]/90 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between md:h-24">
          <Link
            href="/"
            aria-label="KLYVOR home"
            className="group inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
          >
            <Image
              src="/klyvor-symbol.png"
              alt="KLYVOR"
              width={120}
              height={120}
              priority
              className="h-16 w-16 object-contain drop-shadow-[0_0_12px_rgba(0,212,255,0.16)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(0,212,255,0.3)] md:h-[76px] md:w-[76px]"
            />
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-[#C7D0E0] transition-all duration-300 hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
