import { GiantSlider } from "@/components/content/GiantSlider";
import { EducationalFeatures } from "@/components/content/EducationalFeatures";
import { SubjectShowcase } from "@/components/content/SubjectShowcase";
import { RatingsAndReviews } from "@/components/pdp/RatingsAndReviews";
import SeeInActionSection from "@/components/pdp/SeeInActionSection";
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
      <Footer />
    </>
  );
}
