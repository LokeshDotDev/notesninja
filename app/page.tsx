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
    thumbnail: "/assets/reviews-thumbnails/student2.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73e8",
    aspectRatio: "9/16",
    title: "Student Success Story - Interview Experience",
  },
  {
    id: "2",
    thumbnail: "/assets/reviews-thumbnails/student3.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d98dac99517915c0a",
    aspectRatio: "9/16",
    title: "Academic Achievement Journey",
  },
  {
    id: "3",
    thumbnail: "/assets/reviews-thumbnails/student7.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73ea",
    aspectRatio: "9/16",
    title: "Study Techniques That Work",
  },
  {
    id: "4",
    thumbnail: "/assets/reviews-thumbnails/student6.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73e6",
    aspectRatio: "9/16",
    title: "Exam Preparation Success",
  },
  {
    id: "5",
    thumbnail: "/assets/reviews-thumbnails/student1.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6de9610ba04ec142aa",
    aspectRatio: "9/16",
    title: "Real Results from Real Students",
  },
  {
    id: "6",
    thumbnail: "/assets/reviews-thumbnails/student5.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73df",
    aspectRatio: "9/16",
    title: "Student Achievement Showcase",
  },
  {
    id: "7",
    thumbnail: "/assets/reviews-thumbnails/student8.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6de9610ba04ec142b1",
    aspectRatio: "9/16",
    title: "Learning Success Stories",
  },
  {
    id: "8",
    thumbnail: "/assets/reviews-thumbnails/student4.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d98dac99517915c0d",
    aspectRatio: "9/16",
    title: "Academic Excellence Journey",
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
