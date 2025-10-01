import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Explore } from "@/components/landing/Explore";
import { Features } from "@/components/landing/Features";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Explore />
      <Features />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
