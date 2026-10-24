import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({ 
  title, 
  lastUpdated, 
  children 
}: { 
  title: string, 
  lastUpdated: string, 
  children: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-[#0B1020] text-[#C7D0E0]">
      {/* Header */}
      <header className="border-b border-[#27344B] bg-[#0B1020]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="KLYVOR" width={140} height={40} className="object-contain w-auto h-8" />
          </Link>
          <Link href="/" className="text-sm font-medium text-primary hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-sm text-[#64748B]">Last updated: {lastUpdated}</p>
        </div>
        
        <div className="prose prose-invert prose-cyan max-w-none prose-headings:text-white prose-p:leading-relaxed prose-li:leading-relaxed">
          {children}
        </div>

        {/* Footer links */}
        <div className="mt-20 pt-8 border-t border-[#27344B] flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-[#64748B]">© {new Date().getFullYear()} KLYVOR. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-primary hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-primary hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/help" className="text-primary hover:text-white transition-colors">Help & Support</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
