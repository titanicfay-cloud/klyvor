import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { UserPlus, Search, Zap, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020]">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        
        {/* Unique Hero for How It Works */}
        <div className="text-center mb-20">
          <span className="text-secondary font-bold text-xs tracking-[0.2em] uppercase mb-4 block">The Workflow</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            From chaos to clarity in three steps.
          </h1>
          <p className="text-xl text-[#C7D0E0] max-w-2xl mx-auto">
            KLYVOR is designed to get out of your way. Here is how you can set up your professional operating system in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 mb-24">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-[#111A2E] border border-[#27344B] p-8 rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center shrink-0">
              <UserPlus className="text-primary w-8 h-8" />
            </div>
            <div>
              <span className="text-primary font-mono text-sm mb-2 block">STEP 01</span>
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Workspace</h2>
              <p className="text-[#C7D0E0]">Sign up and tell KLYVOR what you do. Whether you are a freelancer, a creator, or a small business, your dashboard immediately adapts to your needs.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 bg-[#111A2E] border border-[#27344B] p-8 rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center shrink-0">
              <Search className="text-secondary w-8 h-8" />
            </div>
            <div>
              <span className="text-secondary font-mono text-sm mb-2 block">STEP 02</span>
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Tools</h2>
              <p className="text-[#C7D0E0]">Head to the Tool Directory. You can pin your favorite tools (like the Pricing Calculator or Task Manager) to your sidebar for instant access.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 bg-[#111A2E] border border-[#27344B] p-8 rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-[#0B1020] border border-[#27344B] flex items-center justify-center shrink-0">
              <Zap className="text-success w-8 h-8" />
            </div>
            <div>
              <span className="text-success font-mono text-sm mb-2 block">STEP 03</span>
              <h2 className="text-2xl font-bold text-white mb-2">Run Your Business</h2>
              <p className="text-[#C7D0E0]">Link your tasks to projects, attach documents to clients, and calculate your rates—all without ever leaving KLYVOR.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/signup">
            <button className="bg-klyvor-gradient text-white px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
              Start Building Your Workflow
            </button>
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
