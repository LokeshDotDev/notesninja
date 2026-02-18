"use client";
import { motion } from "motion/react";
import { TrendingUp, DollarSign, Award, Target } from "lucide-react";

export function AuthoritySection() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-900 text-white overflow-hidden py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="lg:pr-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-10">
              ACHIEVE YOUR GOALS
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              <strong className="text-white">Exam success is a skill.</strong> Like every other skill it can be learned, and
              the speed at which it's learned depends on your coaches and the
              learning environment you're taught in.
            </p>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              <strong className="text-white">Our experts know the exam patterns they teach,</strong> they know
              what it takes to score top marks, and they are the first to identify and
              utilize new question trends and strategies whenever they
              appear.
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              <strong className="text-white">NOTES NINJA</strong> is the ultimate all-in-one learning platform
              guiding you from acing your first exam to <strong className="text-white">mastering every subject
              with confidence.</strong>
            </p>
            <p className="text-lg text-yellow-400 font-semibold leading-relaxed">
              There is no better place to prepare for MUJ exams today.
            </p>
          </motion.div>

          {/* Right Column - Image Grid with Fade Effect */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Fade Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-emerald-900/80 z-10 pointer-events-none"></div>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Large Image 1: Dashboard - Top Left */}
              <div className="col-span-2 bg-gray-800 rounded-2xl aspect-video flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">$66,580.43</div>
                    <div className="text-green-400 text-xs">↑ 24% (+$12,696.25)</div>
                  </div>
                </div>
                <div className="absolute top-3 left-3 text-white text-xs font-medium">Dashboard</div>
              </div>

              {/* Small Image 2: Social Post - Top Right */}
              <div className="bg-gray-800 rounded-2xl aspect-square flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                <div className="absolute inset-0 flex flex-col justify-between p-3">
                  <div className="text-white text-xs font-medium">@Hulk</div>
                  <div className="flex gap-2 text-white text-xs">
                    <span>❤️ 2.4K</span>
                    <span>💬 89</span>
                  </div>
                </div>
              </div>

              {/* Image 3: Social Post - Middle Left */}
              <div className="bg-gray-800 rounded-2xl aspect-square flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                <div className="absolute inset-0 flex flex-col justify-between p-3">
                  <div className="text-white text-xs">"I remember Prof. Adam saying..."</div>
                  <div className="flex gap-2 text-white text-xs">
                    <span>❤️ 1.2K</span>
                    <span>💬 34</span>
                  </div>
                </div>
              </div>

              {/* Image 4: Watch - Middle Center */}
              <div className="bg-gray-800 rounded-2xl aspect-square flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-full mb-1"></div>
                    <div className="text-white text-xs">Watch</div>
                  </div>
                </div>
              </div>

              {/* Image 5: Ferrari - Middle Right */}
              <div className="bg-gray-800 rounded-2xl aspect-square flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-600 rounded-full mb-1 flex items-center justify-center">
                      <span className="text-black font-bold text-xs">SF</span>
                    </div>
                    <div className="text-white text-xs">Ferrari</div>
                  </div>
                </div>
              </div>

              {/* Additional Images for More Density */}
              <div className="bg-gray-800 rounded-2xl aspect-video flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">98.5%</div>
                    <div className="text-green-400 text-xs">Score Rate</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl aspect-video flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">500+</div>
                    <div className="text-blue-400 text-xs">Success Stories</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl aspect-video flex items-center justify-center text-gray-400 text-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">50K+</div>
                    <div className="text-purple-400 text-xs">Hours Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
