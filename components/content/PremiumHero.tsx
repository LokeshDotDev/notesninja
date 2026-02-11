"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Star, Users, Check } from "lucide-react";
import { motion } from "motion/react";
import settings from "@/lib/settings";
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
    <section className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Premium headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-8 tracking-tight"
        >
          Premium Study Materials for
          <br />
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Academic Excellence
            </span>
            {/* Underline effect */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 1 }}
            />
          </span>
        </motion.h1>

        {/* Premium description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
        >
          {/* Access expert-curated notes, study guides, and exam preparation materials from top educators.  */}
          <span className="block mt-2 font-semibold text-gray-900 dark:text-white">
            Pay once, download instantly, study forever.
          </span>
        </motion.p>

        {/* Premium features grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
        >
          {[
            { icon: Check, text: "Expert Verified Content", color: "text-green-600" },
            { icon: Download, text: "Instant PDF Downloads", color: "text-blue-600" },
            { icon: Star, text: "One-Time Payment", color: "text-purple-600" },
            { icon: Users, text: "Lifetime Access", color: "text-orange-600" }
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 dark:border-slate-700/20">
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Premium CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full"
            onClick={() => window.open(settings.whatsapp.url(), '_blank')}
          >
            <Download className="w-5 h-5 mr-2" />
            Browse & Download Materials
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 rounded-full"
          >
            View Sample Materials
          </Button>
        </motion.div>

        {/* Premium stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {[
            { value: "1,000+", label: "Study Materials", color: "text-blue-600" },
            { value: "50+", label: "Subjects", color: "text-purple-600" },
            { value: "98%", label: "Success Rate", color: "text-green-600" },
            { value: "$2.99", label: "Starting Price", color: "text-orange-600" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
    </section>
  );
}
