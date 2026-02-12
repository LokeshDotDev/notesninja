"use client";
import { Download } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtm from "@/lib/gtm";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { MacbookScroll } from "@/components/ui/macbook-scroll";


export function PremiumHero() {
  const pathname = usePathname();

  useEffect(() => {
    gtm.pageview(pathname);
  }, [pathname]);

  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden">
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

      <div className="relative z-10 w-full">
        {/* Premium headline - positioned above macbook */}
       

        {/* Integrated Macbook Scroll Component - Main Hero Element */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          // className="relative"
        >
          <MacbookScroll
            title={
              <span className="text-gray-900 dark:text-white text-7xl">
                 Premium Study Materials for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">
                  Academic Excellence
                </span>
              </span>
            }
            badge={
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                <Download className="h-6 w-6 text-white" />
              </div>
            }
            src={`/assets/courses logo/WhatsApp Image 2026-02-12 at 01.48.32.jpeg`}
            showGradient={false}
          />
        </motion.div>

        {/* Premium CTA buttons - positioned below macbook */}
     
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
    </section>
  );
}
