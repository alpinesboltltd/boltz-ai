import HeroSection from "@/components/landing-option/HeroSection";
import ProblemSection from "@/components/landing-option/ProblemSection";
import SolutionSection from "@/components/landing-option/SolutionSection";
import ReliabilitySection from "@/components/landing/ReliabilitySection"; // Swapped: "Parameters" from Main
import IntegrationsSection from "@/components/landing-option/IntegrationsSection";
import FooterSection from "@/components/landing-option/FooterSection";

export default function LandingOptionPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500 selection:text-black">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ReliabilitySection />
      <IntegrationsSection />
      <FooterSection />
    </main>
  );
}
