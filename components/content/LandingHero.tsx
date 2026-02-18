"use client";
import { motion } from "motion/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtm from "@/lib/gtm";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { ArrowRight, Download, BookOpen, Sparkles } from "lucide-react";

export function LandingHero() {
  const pathname = usePathname();

  useEffect(() => {
    gtm.pageview(pathname);
  }, [pathname]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Premium Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.05}
        duration={4}
        repeatDelay={1}
        className={cn(
          "mask-[radial-gradient(800px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-emerald-50/30"></div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Trusted by 5000+ MUJ Students</span>
            </div>
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Score 70%+ in MUJ Semester Exams
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700">
                Using Smart Revision Kits
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Structured Expected Questions, PYQ Analysis & Mock Tests Designed for Manipal University Jaipur Students.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Download className="w-5 h-5" />
              Download Free Sample
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
              <BookOpen className="w-5 h-5" />
              Explore Smart Kits
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="bg-white rounded-2xl p-6 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature Cards */}
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Expected Questions</h3>
                    <p className="text-sm text-gray-600">70%+ exam coverage with pattern analysis</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">PYQ Analysis</h3>
                    <p className="text-sm text-gray-600">5-year pattern breakdown</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mock Tests</h3>
                    <p className="text-sm text-gray-600">2 full-length practice papers</p>
                  </div>
                </div>
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
