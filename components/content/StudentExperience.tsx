"use client";
import { motion } from "motion/react";
import { Check } from "lucide-react";

export function StudentExperience() {
  return (
    <section className="py-16 lg:py-24 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Section: Image/Mockup Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-xl border border-gray-300 flex items-center justify-center p-8">
              <p className="text-gray-500 text-lg">Student success stories</p>
            </div>
            {/* Floating elements for depth */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-10 blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-purple-400 rounded-full opacity-10 blur-xl"></div>
          </motion.div>

          {/* Right Section: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight uppercase tracking-wide">
              An Exclusive Community with <span className="text-blue-600">50K+</span> Like-Minded Students
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our online community is a supportive, high-focus environment. Everyone is on the same mission: 
              acquiring an abundance of wealth through proven strategies and mentorship.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">
                  <span className="font-bold text-gray-900">Daily live sessions</span> with millionaire coaches
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">
                  <span className="font-bold text-gray-900">Proven wealth-building strategies</span> that actually work
                </p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
