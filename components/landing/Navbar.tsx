
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.07] bg-[#0B1020]/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="KLYVOR"
              width={220}
              height={70}
              className="h-14 w-auto object-contain md:h-16"
              priority
            />
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-[#C7D0E0] transition-all hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/[0.07] hover:text-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
