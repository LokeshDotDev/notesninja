"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Star, Users, Check } from "lucide-react";
import { motion } from "motion/react";
import settings from "@/lib/settings";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtm from "@/lib/gtm";

export function ModernHero() {
  const pathname = usePathname();

  useEffect(() => {
    gtm.pageview(pathname);
  }, [pathname]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 py-20 md:py-32 flex items-center justify-center min-h-[70vh]">
      {/* Moving Background Shader Effect */}
      <motion.div
        className="absolute inset-0 z-0 opacity-30 dark:opacity-20"
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{ backgroundPosition: "100% 100%" }}
        transition={{
          ease: "linear",
          duration: 60,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: `radial-gradient(at 10% 10%, hsl(210, 90%, 70%) 0, transparent 50%),
                          radial-gradient(at 90% 20%, hsl(260, 80%, 70%) 0, transparent 50%),
                          radial-gradient(at 30% 90%, hsl(200, 90%, 80%) 0, transparent 50%),
                          radial-gradient(at 70% 70%, hsl(280, 70%, 60%) 0, transparent 50%)`,
          backgroundSize: "200% 200%",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-full p-2 pr-4 shadow-md mb-8"
        >
          <span className="flex items-center text-yellow-500 font-semibold text-sm">
            <Star className="w-4 h-4 mr-1" /> 4.9/5 Rating
          </span>
          <span className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
            <Users className="w-4 h-4 mr-1" /> 50,000+ Students
          </span>
          <span className="flex items-center text-green-600 dark:text-green-400 font-semibold text-sm">
            <Check className="w-4 h-4 mr-1" /> Instant Download
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-7xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6"
        >
          Premium Study Materials for <br className="hidden sm:inline" />
          <span className="text-indigo-600 dark:text-indigo-400">Academic Excellence</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
        >
          Access expert-curated notes, study guides, and exam preparation materials. Pay once,
          download instantly, study anywhere.
        </motion.p>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-8 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <span className="flex items-center">
            <Check className="w-4 h-4 mr-1 text-green-500" />
            Expert Verified Content
          </span>
          <span className="flex items-center">
            <Check className="w-4 h-4 mr-1 text-green-500" />
            Instant PDF Downloads
          </span>
          <span className="flex items-center">
            <Check className="w-4 h-4 mr-1 text-green-500" />
            One-Time Payment
          </span>
          <span className="flex items-center">
            <Check className="w-4 h-4 mr-1 text-green-500" />
            Lifetime Access
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => window.open(settings.whatsapp.url(), '_blank')}
          >
            <Download className="w-5 h-5 mr-2" />
            Browse & Download Materials
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-4 text-lg font-semibold transition-all duration-200"
          >
            View Sample Materials
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">1,000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Study Materials</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">50+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Subjects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">98%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">$2.99</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Starting Price</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
