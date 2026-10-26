import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PlatformOverview from "@/components/landing/PlatformOverview";
import ProblemSection from "@/components/landing/ProblemSection";
import BrandStatement from "@/components/landing/BrandStatement";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020]">
      <Navbar />
      <main className="flex-grow pt-10">
        <PlatformOverview />
        <ProblemSection />
        <BrandStatement />
      </main>
      <Footer />
    </div>
  );
}
