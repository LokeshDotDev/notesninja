"use client";
import { motion } from "motion/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtm from "@/lib/gtm";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";


export function PremiumHero() {
  const pathname = usePathname();

  useEffect(() => {
    gtm.pageview(pathname);
  }, [pathname]);

  return (
    <section className="relative min-h-screen sm:min-h-[80vh] md:min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Premium Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={50}
        maxOpacity={0.1}
        duration={4}
        repeatDelay={1}
        className={cn(
          "mask-[radial-gradient(800px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      
      {/* Additional gradient overlay for depth */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20"></div> */}

      <div className="relative z-10 w-full px-4">
        {/* University Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          className="text-center mb-8"
        >
        </motion.div>

        {/* Premium Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent leading-tight mb-6">
            Premium Study Materials for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-500 to-green-800">
              Academic Excellence
            </span>
          </h1>
        </motion.div>

        {/* Video Component - Main Hero Element */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full max-w-6xl mx-auto"
        >
          <video
            autoPlay
            loop
            playsInline
            muted
            controls
            className="w-full h-auto rounded-2xl shadow-2xl"
          >
            <source src={`/assets/videos/success in study.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        {/* Premium CTA buttons - positioned below macbook */}
     
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
    </section>
  );
}
