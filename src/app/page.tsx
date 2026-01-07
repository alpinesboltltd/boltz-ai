import HeroSection from "@/components/landing/HeroSection";
import ProblemSolutionSection from "@/components/landing/ProblemSolutionSection";
import FeatureGridSection from "@/components/landing/FeatureGridSection";
import ReliabilitySection from "@/components/landing-option/ReliabilitySection"; // Swapped: "Trust Terminal" from Option
import IntegrationsSection from "@/components/landing-option/IntegrationsSection"; // Added: "Orbit" from Option
import UseCaseSliderSection from "@/components/landing/UseCaseSliderSection";
import FooterSection from "@/components/landing/FooterSection";
import { Header } from "@/components/common/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground selection:bg-[#0ea5e9] selection:text-white">
        <HeroSection />
        <ProblemSolutionSection />
        <FeatureGridSection />
        <ReliabilitySection />
        <IntegrationsSection />
        <UseCaseSliderSection />
        <FooterSection />
      </main>
    </>
  );
}
