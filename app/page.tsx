import { HeroSection } from "@/components/landing/HeroSection";
import { ProofGrid } from "@/components/landing/ProofGrid";
import { StudentTestimonials } from "@/components/content/StudentTestimonials";
import { StudentExperience } from "@/components/content/StudentExperience";
import { VideoInterviews } from "@/components/landing/VideoInterviews";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { AuthoritySection } from "@/components/landing/AuthoritySection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Metadata } from "next";
import settings from "@/lib/settings";
import Footer from "@/components/content/Footer";

export const metadata: Metadata = {
  title: `${settings.site.name} | Premium Digital Academic Materials & Study Resources`,
  description: settings.site.description,
  keywords: settings.site.keywords,
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProofGrid />
      <StudentTestimonials />
      {/* <VideoInterviews /> */}
      <ServicesSection />
      {/* <StudentExperience /> */}
      <AuthoritySection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </>
  );
}
