"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Star, Users, Check } from "lucide-react";
import { motion } from "motion/react";
import settings from "@/lib/settings";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtm from "@/lib/gtm";
import { cn } from "@/lib/utils";

export function PremiumHeroV2() {
  const pathname = usePathname();

  useEffect(() => {
    gtm.pageview(pathname);
  }, [pathname]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Custom Premium Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgba(99, 102, 241, 0.05)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Animated Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Radial Gradient Overlay for Premium Feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.4)_40%,rgba(99,102,241,0.1)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.8)_0%,rgba(15,23,42,0.6)_40%,rgba(99,102,241,0.2)_100%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Premium Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full px-8 py-4 shadow-xl border border-white/20 dark:border-slate-700/20 mb-12"
        >
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-gray-900 dark:text-white">4.9/5 Rating</span>
          </div>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900 dark:text-white">50,000+ Students</span>
          </div>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-900 dark:text-white">Instant Download</span>
          </div>
        </motion.div>

        {/* Premium Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-8 tracking-tight"
        >
          Premium Study Materials for
          <br />
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Academic Excellence
            </span>
            {/* Premium Underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 1 }}
            />
          </span>
        </motion.h1>

        {/* Premium Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
        >
          Access expert-curated notes, study guides, and exam preparation materials from top educators. 
          <span className="block mt-2 font-semibold text-gray-900 dark:text-white">
            Pay once, download instantly, study forever.
          </span>
        </motion.p>

        {/* Premium Features Grid */}
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
            <div key={index} className="flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30 dark:border-slate-700/30 shadow-lg">
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Premium CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-full"
            onClick={() => window.open(settings.whatsapp.url(), '_blank')}
          >
            <Download className="w-5 h-5 mr-2" />
            Browse & Download Materials
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 rounded-full shadow-lg"
          >
            View Sample Materials
          </Button>
        </motion.div>

        {/* Premium Stats */}
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

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
    </section>
  );
}
