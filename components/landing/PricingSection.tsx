"use client";
import { motion } from "motion/react";
import { Check, Shield, Clock, Download, CreditCard, Lock, ArrowRight, Star, Sparkles } from "lucide-react";

export function PricingSection() {
  return (
    <section className="relative bg-white text-gray-900 overflow-hidden py-16 lg:py-20">
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full border border-gray-200 mb-6">
            <span className="text-sm font-medium text-gray-600">Simple Pricing</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Invest in Your
            </span>
            <br />
            <span className="text-gray-900">Academic Success</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to excel in your MUJ exams. One price, lifetime access.
          </p>
        </motion.div>

        {/* Main Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10"></div>
              <div className="relative p-6 sm:p-8 text-center border-b border-gray-200">
                <div className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full mb-6 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-medium text-sm">Most Popular</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Smart Exam Survival Kit
                </h3>
                <p className="text-gray-600">
                  Complete semester preparation package
                </p>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-6 sm:p-8">
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-gray-400 line-through text-xl">₹999</span>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    65% OFF
                  </div>
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">₹349</div>
                <p className="text-gray-600">One-time payment, lifetime access</p>
              </div>

              {/* Features */}
              <div className="mb-10">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 text-center">What's included</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1 text-sm">Complete Module Access</h5>
                      <p className="text-gray-600 text-xs">All 4 comprehensive modules with detailed notes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Download className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1 text-sm">Instant Download</h5>
                      <p className="text-gray-600 text-xs">Get immediate access after purchase</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1 text-sm">Always Updated</h5>
                      <p className="text-gray-600 text-xs">Content updated for current semester</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1 text-sm">Mobile Friendly</h5>
                      <p className="text-gray-600 text-xs">Study anywhere with PDF format</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Section */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">7-Day Refund Policy</div>
                      <div className="text-gray-600 text-xs">100% money-back guarantee</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Secure Payment</div>
                      <div className="text-gray-600 text-xs">SSL encrypted checkout</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-6"
              >
                <Download className="w-5 h-5" />
                Get Instant Access - ₹349
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Payment Methods */}
              <div className="flex items-center justify-center gap-4">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div className="flex gap-2">
                  <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200"></div>
                  <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200"></div>
                  <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200"></div>
                  <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 mb-4">
              Less than the cost of one private tutoring session
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium">Instant access</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium">No hidden charges</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium">7-day guarantee</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
