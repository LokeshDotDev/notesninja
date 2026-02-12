"use client";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";

const universities = [
  {
    logo: "/assets/universitesLogo/1.png"
  },
  {
    logo: "/assets/universitesLogo/2.png"
  },
  {
    logo: "/assets/universitesLogo/3.png"
  },
  {
    logo: "/assets/universitesLogo/4.png"
  },
  {
    logo: "/assets/universitesLogo/5.png"
  }
];

const UniversityCard = ({
  logo,
}: {
  logo: string;
}) => {
  return (
        <Image 
          src={logo} 
          alt="university"
          width={256}
          height={256}
          className="max-w-64 max-h-full object-contain"
        />
  );
};

export function UniversityLogoScroller() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {universities.map((university, index) => (
          <UniversityCard key={index} {...university} />
        ))}
      </Marquee>
      {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
        {universities.map((university, index) => (
          <UniversityCard {...university} />
        ))}
      </Marquee> */}
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  );
}
