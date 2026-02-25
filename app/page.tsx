import { GiantSlider } from "@/components/content/GiantSlider";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import settings from "@/lib/settings";

// Lazy load below-the-fold components
const UniversitiesShowcase = dynamic(() => import("@/components/content/UniversitiesShowcase").then(mod => ({ default: mod.UniversitiesShowcase })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const SubjectShowcase = dynamic(() => import("@/components/content/SubjectShowcase").then(mod => ({ default: mod.SubjectShowcase })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

// Lazy load heavy components that are below the fold
const SeeInActionSection = dynamic(() => import("@/components/pdp/SeeInActionSection"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const EducationalFeatures = dynamic(() => import("@/components/content/EducationalFeatures").then(mod => ({ default: mod.EducationalFeatures })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const RatingsAndReviews = dynamic(() => import("@/components/pdp/RatingsAndReviews").then(mod => ({ default: mod.RatingsAndReviews })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const HowItWorks = dynamic(() => import("@/components/content/HowItWorks").then(mod => ({ default: mod.HowItWorks })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

export const metadata: Metadata = {
  title: `${settings.site.name} | Premium Digital Academic Materials & Study Resources`,
  description: settings.site.description,
  keywords: settings.site.keywords,
};

const ugcVideos = [
  {
    id: "1",
    thumbnail: "/assets/reviews-thumbnails/student-1.webp",
    embedSrc: "https://play.gumlet.io/embed/699eacf2c051a86ff58d2380",
    aspectRatio: "29/52",
    title: "Student Success Story - Interview Experience",
  },
  {
    id: "2",
    thumbnail: "/assets/reviews-thumbnails/student-2.webp",
    embedSrc: "https://play.gumlet.io/embed/699eacf2f8c697838345aa21",
    aspectRatio: "29/52",
    title: "Academic Achievement Journey",
  },
  {
    id: "3",
    thumbnail: "/assets/reviews-thumbnails/student-3.webp",
    embedSrc: "https://play.gumlet.io/embed/699eacf2f8c697838345aa1b",
    aspectRatio: "9/16",
    title: "Study Techniques That Work",
  },
  {
    id: "4",
    thumbnail: "/assets/reviews-thumbnails/student-4.webp",
    embedSrc: "https://play.gumlet.io/embed/699eacf2f8c697838345aa18",
    aspectRatio: "9/16",
    title: "Exam Preparation Success",
  },
  {
    id: "5",
    thumbnail: "/assets/reviews-thumbnails/student-5.webp",
    embedSrc: "https://play.gumlet.io/embed/699eacf2ba6c1c14db0784f2",
    aspectRatio: "29/52",
    title: "For $35. For everyone. Plus tax.",
  },
];

export default function Home() {
  return (
    <>
      <GiantSlider />
      <UniversitiesShowcase />
      <SubjectShowcase />
      <SeeInActionSection videos={ugcVideos} />
      <EducationalFeatures />
      <RatingsAndReviews />
      <HowItWorks />
      {/* <CallToAction /> */}
    </>
  );
}
