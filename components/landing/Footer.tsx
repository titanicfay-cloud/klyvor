
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-[#080E1C]">
      <div className="mx-auto max-w-7xl px-5 pb-7 pt-12 sm:px-8 md:pt-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Integrated KLYVOR identity */}
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="KLYVOR home"
              className="group inline-flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
            >
              <Image
                src="/klyvor-symbol.png"
                alt=""
                width={100}
                height={100}
                className="h-14 w-14 object-contain drop-shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_18px_rgba(0,212,255,0.28)]"
              />

              <span className="flex flex-col">
                <span className="text-xl font-extrabold tracking-[0.18em] text-white">
                  KLYVOR
                </span>
                <span className="mt-1 text-[9px] font-semibold tracking-[0.2em] text-slate-500">
                  BEYOND WHAT'S POSSIBLE.
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              A connected professional platform for organising work,
              managing information and moving forward with clarity.
            </p>
          </div>

          {/* Essential links */}
          <div className="flex flex-wrap gap-x-16 gap-y-8">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Support
              </h3>
              <Link
                href="/help"
                className="text-sm text-slate-400 transition-colors hover:text-[#00D4FF]"
              >
                Help Centre
              </Link>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Legal
              </h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 transition-colors hover:text-[#00D4FF]"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-slate-400 transition-colors hover:text-[#00D4FF]"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {currentYear} KLYVOR. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Built for the way you work.
          </p>
        </div>
      </div>
    </footer>
  );
}
