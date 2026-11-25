
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#0B1020]/90 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between md:h-[84px]">
          <Link
            href="/"
            aria-label="KLYVOR home"
            className="group relative inline-flex items-center outline-none"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-5 -inset-y-3 rounded-full bg-gradient-to-r from-[#00D4FF]/[0.07] via-[#7C5CFC]/[0.06] to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />

            <Image
              src="/logo.png"
              alt="KLYVOR"
              width={220}
              height={70}
              priority
              className="relative h-12 w-auto object-contain mix-blend-lighten drop-shadow-[0_0_12px_rgba(0,212,255,0.12)] transition-all duration-300 group-hover:drop-shadow-[0_0_17px_rgba(0,212,255,0.24)] md:h-[58px]"
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
