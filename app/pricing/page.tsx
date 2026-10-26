import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import BrandStatement from "@/components/landing/BrandStatement";
import FinalCTA from "@/components/landing/FinalCTA";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020]">
      <Navbar />
      <main className="flex-grow pt-20">
        <BrandStatement />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
