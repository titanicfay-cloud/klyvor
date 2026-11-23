
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-[#080E1C]">
      <div className="mx-auto max-w-7xl px-5 pb-7 pt-12 sm:px-8 md:pt-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="KLYVOR"
                width={150}
                height={42}
                className="h-9 w-auto object-contain object-left"
                priority={false}
              />
            </Link>

            <p className="mt-3 text-sm font-medium text-[#00D4FF]">
              Beyond What's Possible.
            </p>

            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
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
