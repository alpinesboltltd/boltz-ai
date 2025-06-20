import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";
import { Highlights } from "@/components/landing/Highlights";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FeaturesTable } from "@/components/landing/FeaturesTable";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Explore } from "@/components/landing/Explore";
import { Benefits } from "@/components/landing/Benefits";
import { Advantages } from "@/components/landing/Advantages";
import { Testimonials } from "@/components/landing/Testimonials";
import { Securitys } from "@/components/landing/Securitys";
import { Experience } from "@/components/landing/Experience";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="w-11/12 lg:w-9/12  mx-auto">
        <HeroSection />
        <Highlights />
        <HowItWorks />
        <Features />
        <Explore />
        <Benefits />
        <Advantages />
        <Testimonials />
        <Securitys />
        <Experience />
        <FeaturesSection />
        <FeaturesTable />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
