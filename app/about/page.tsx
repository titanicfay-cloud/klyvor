import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { Layers, Target, TrendingUp, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020]">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        
        {/* Unique Hero for About */}
        <div className="text-center mb-20">
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase mb-4 block">Our Mission</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            We believe your work <br className="hidden md:block"/> should flow, not scatter.
          </h1>
          <p className="text-xl text-[#C7D0E0] max-w-2xl mx-auto">
            KLYVOR was born out of a simple frustration: managing professional life requires too many disconnected tools. We are building the unified workspace we always wanted.
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-[#111A2E] border border-[#27344B] p-8 md:p-12 rounded-3xl mb-20">
          <h2 className="text-2xl font-bold text-white mb-6">The Fragmentation Problem</h2>
          <p className="text-[#C7D0E0] mb-6 leading-relaxed">
            Your tasks live in one app. Your documents in another. Your client details in a spreadsheet, and your pricing calculations in a notebook. 
          </p>
          <p className="text-[#C7D0E0] leading-relaxed">
            This fragmentation costs you time, energy, and focus. Every time you switch apps, you lose momentum. KLYVOR solves this by bringing your entire professional operating system into one secure, intelligent platform.
          </p>
        </div>

        {/* Core Principles */}
        <div className="space-y-8 mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0B1020] border border-[#27344B] p-6 rounded-2xl text-center">
              <Layers className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Connected by Default</h3>
              <p className="text-sm text-[#64748B]">Tools shouldn't be silos. Your projects, clients, and tasks should seamlessly talk to each other.</p>
            </div>
            <div className="bg-[#0B1020] border border-[#27344B] p-6 rounded-2xl text-center">
              <Target className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Built for Focus</h3>
              <p className="text-sm text-[#64748B]">We strip away the noise. KLYVOR is designed to help you do deep work, not just manage it.</p>
            </div>
            <div className="bg-[#0B1020] border border-[#27344B] p-6 rounded-2xl text-center">
              <TrendingUp className="w-10 h-10 text-success mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Scale Without Friction</h3>
              <p className="text-sm text-[#64748B]">Whether you're a solo freelancer or a growing agency, the platform grows seamlessly with you.</p>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
