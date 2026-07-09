import { FaqSection } from "@/features/landing/components/faq-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { Footer } from "@/features/landing/components/footer";
import { Hero } from "@/features/landing/components/hero";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { Navbar } from "@/features/landing/components/navbar";
import { StylesSection } from "@/features/landing/components/styles-section";

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <HowItWorksSection />
        <StylesSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
