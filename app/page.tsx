import { HeroSection } from "@/components/content/HeroSection";
import TrustSection from "@/components/content/TrustSection";
import settings from "@/lib/settings";

export const metadata = {
  title: `${settings.site.name} | Premium Hospitality Products & Hotel Supplies`,
  description: settings.site.description,
  keywords: settings.site.keywords,
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustSection />
    </>
  );
}
