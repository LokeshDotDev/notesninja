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
    src: "/assets/student reviews videos/NOTESNINJA_INTERVIEW_1_17_FEB_2026.mp4",
    thumbnail: "",
    poster: "",
    title: "Student Success Story - Interview Experience",
  },
  {
    id: "2",
    src: "/assets/student reviews videos/NOTESNINJA_INTERVIEW_2_17_FEB_2026.mp4",
    thumbnail: "",
    poster: "",
    title: "Academic Achievement Journey",
  },
  {
    id: "3",
    src: "/assets/student reviews videos/Notes_Ninja_shot_Video01.mp4",
    thumbnail: "",
    poster: "",
    title: "Study Techniques That Work",
  },
  {
    id: "4",
    src: "/assets/student reviews videos/Notes_ninja_03.mp4",
    thumbnail: "",
    poster: "",
    title: "Exam Preparation Success",
  },
  {
    id: "5",
    src: "/assets/student reviews videos/Notes_ninja_shoot_video02_1.mp4",
    thumbnail: "",
    poster: "",
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
