"use client";
import { motion } from "motion/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtm from "@/lib/gtm";
import { Play, Download, BookOpen } from "lucide-react";

export function HeroSection() {
  const pathname = usePathname();

  useEffect(() => {
    gtm.pageview(pathname);
  }, [pathname]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-emerald-50/20"></div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8 mt-24">
              Score 70%+ in MUJ Semester Exams
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700">
                Using Smart Revision Kits
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Structured Expected Questions + PYQ Analysis + Mock Tests Designed for Manipal University Jaipur Students
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                Download Free Sample
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <BookOpen className="w-5 h-5" />
                Explore Smart Kits
              </motion.button>
            </div>
          </motion.div>

          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
              {/* Video Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:bg-white/30 transition-colors">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">
                      Founder Explaining the System
                    </h3>
                    <p className="text-gray-300">
                      Exam strategy + Smart Revision methodology
                    </p>
                  </div>
                </div>
                
                {/* Video overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
