import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HowItWorks from "@/components/landing/HowItWorks";
import Audiences from "@/components/landing/Audiences";
import FinalCTA from "@/components/landing/FinalCTA";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020]">
      <Navbar />
      <main className="flex-grow pt-10">
        <HowItWorks />
        <Audiences />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
