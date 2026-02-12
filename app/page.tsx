import { PremiumHero } from "@/components/content/PremiumHero";
import { EducationalFeatures } from "@/components/content/EducationalFeatures";
import { SubjectShowcase } from "@/components/content/SubjectShowcase";
import { StudentTestimonials } from "@/components/content/StudentTestimonials";
import { HowItWorks } from "@/components/content/HowItWorks";
import { UniversitiesShowcase } from "@/components/content/UniversitiesShowcase";
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
      <PremiumHero />
      <UniversitiesShowcase />
      <SubjectShowcase />
      <EducationalFeatures />
      <StudentTestimonials />
      <HowItWorks />
      {/* <CallToAction /> */}
      <Footer />
    </>
  );
}
