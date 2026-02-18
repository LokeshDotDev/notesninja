"use client";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Target, Award } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white font-medium">Join 5000+ Successful MUJ Students</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Prepare Smart.
            <br />
            Write Confident.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400">
              Score Higher.
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Stop guessing what's important and start preparing strategically. 
            Your MUJ semester success story starts here.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-700 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl"
            >
              Get Instant Access
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">70%+</div>
              <div className="text-emerald-200 text-sm">Average Score</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">5000+</div>
              <div className="text-emerald-200 text-sm">MUJ Students</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">4.8/5</div>
              <div className="text-emerald-200 text-sm">Student Rating</div>
            </div>
          </motion.div>

          {/* Final Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-emerald-200 text-sm">
              🎯 Limited time offer: Get the complete Smart Exam Survival Kit for just ₹349
            </p>
            <p className="text-emerald-300 text-xs mt-2">
              *7-day money-back guarantee • Instant download • Updated for current semester
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
