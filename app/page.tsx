
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import PlatformOverview from "@/components/landing/PlatformOverview";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Audiences from "@/components/landing/Audiences";
import BrandStatement from "@/components/landing/BrandStatement";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-[#0B1020]">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TrustStrip />
        <PlatformOverview />
        <ProblemSection />
        <HowItWorks />
        <Audiences />
        <BrandStatement />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
