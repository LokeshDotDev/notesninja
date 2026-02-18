"use client";
import { motion } from "motion/react";
import { ChevronRight, Check } from "lucide-react";

const kitSteps = [
  {
    title: "Deep Research",
    subtitle: "5-Year Analysis",
    description: "We analyze 5 years of MUJ exam patterns, faculty preferences, and question trends to identify exactly what matters most.",
    detail: "Our research team studies over 10,000 past questions and faculty patterns to predict with 70%+ accuracy what will appear in your next exam.",
    features: ["Pattern Recognition", "Faculty Preferences", "Question Trend Analysis", "Success Rate Mapping"],
    imageNumber: "01"
  },
  {
    title: "Smart Content",
    subtitle: "Precision-Crafted Notes",
    description: "Every concept is simplified and structured for maximum retention with visual learning aids and memory techniques.",
    detail: "Our content experts transform complex topics into bite-sized, easy-to-digest modules with proven learning science principles.",
    features: ["Visual Learning", "Memory Techniques", "Concept Mapping", "Quick Revision"],
    imageNumber: "02"
  },
  {
    title: "Rigorous Testing",
    subtitle: "Exam-Ready Practice",
    description: "Practice with exactly patterned mock tests and real-time feedback to build confidence and perfect time management.",
    detail: "Each mock test is calibrated to match the exact difficulty level and time pressure of actual MUJ examinations.",
    features: ["Real Exam Pattern", "Time Management", "Performance Analytics", "Confidence Building"],
    imageNumber: "03"
  },
  {
    title: "Strategic Planning",
    subtitle: "3-Day Success Path",
    description: "A scientifically designed study schedule that prioritizes high-impact topics for maximum score improvement.",
    detail: "Our 3-day plan is optimized using cognitive science principles to ensure peak performance on exam day.",
    features: ["Priority Topics", "Cognitive Optimization", "Peak Performance", "Last-Minute Mastery"],
    imageNumber: "04"
  }
];

export function ServicesSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Apple-style Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl lg:text-7xl font-semibold text-gray-900 mb-6 leading-tight tracking-tight">
            How We Build
          </h2>
          <h3 className="text-3xl lg:text-5xl font-semibold text-gray-900 mb-8 leading-tight tracking-tight">
            Every Smart Kit
          </h3>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            A meticulous process that transforms complex academic material into your pathway to excellence
          </p>
        </motion.div>

        {/* Apple-style Step Cards */}
        <div className="space-y-32 lg:space-y-48">
          {kitSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
            >
              {/* Content Side */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} space-y-8`}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl lg:text-5xl font-light text-gray-400">
                      {step.imageNumber}
                    </span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
                      {step.title}
                    </h4>
                    <p className="text-xl lg:text-2xl text-gray-600 font-medium">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Side */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Premium Card Design */}
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-12">
                        <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-gray-200">
                          <span className="text-5xl lg:text-6xl font-light text-gray-900">
                            {step.imageNumber}
                          </span>
                        </div>
                        <h5 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
                          {step.title}
                        </h5>
                        <p className="text-lg lg:text-xl text-gray-600 font-medium">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Apple-style Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                    className="absolute -top-8 -right-8 w-16 h-16 bg-gray-900 rounded-full opacity-10 blur-xl"
                  />
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 + 2 }}
                    className="absolute -bottom-8 -left-8 w-20 h-20 bg-gray-900 rounded-full opacity-10 blur-xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-32 lg:mt-48"
        >
          <div className="bg-gray-50 rounded-3xl p-12 lg:p-16 border border-gray-200">
            <div className="text-center space-y-8">
              <h3 className="text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight tracking-tight">
                The Result: Excellence Delivered
              </h3>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
                Every Smart Kit is the culmination of deep research, expert content creation, rigorous testing, and strategic planning—designed to transform your academic journey.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 pt-8">
                <div className="bg-white px-8 py-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-lg font-semibold text-gray-900">70%+ Accuracy</span>
                </div>
                <div className="bg-white px-8 py-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-lg font-semibold text-gray-900">400+ Pages</span>
                </div>
                <div className="bg-white px-8 py-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-lg font-semibold text-gray-900">Proven Results</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
