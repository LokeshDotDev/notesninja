import { GiantSlider } from "@/components/content/GiantSlider";
import { EducationalFeatures } from "@/components/content/EducationalFeatures";
import { SubjectShowcase } from "@/components/content/SubjectShowcase";
import { RatingsAndReviews } from "@/components/pdp/RatingsAndReviews";
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
      <GiantSlider />
      <UniversitiesShowcase />
      <SubjectShowcase />
      <EducationalFeatures />
      <RatingsAndReviews />
      <HowItWorks />
      {/* <CallToAction /> */}
      <Footer />
    </>
  );
}
