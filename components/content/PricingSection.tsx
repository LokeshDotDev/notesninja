"use client";
import { motion } from "motion/react";
import { Check, Shield, Clock, Download, CreditCard, Lock } from "lucide-react";

export function PricingSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Invest in Your Academic Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get everything you need to score 70%+ at a student-friendly price
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white font-medium">Limited Time Offer</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">MUJ Smart Exam Survival Kit</h3>
              <p className="text-emerald-100">Complete semester exam preparation package</p>
            </div>

            {/* Pricing */}
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-gray-400 line-through text-2xl">₹999</span>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    65% OFF
                  </div>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">₹349</div>
                <p className="text-gray-600">One-time payment, lifetime access</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">All 6 modules included</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Instant download access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Updated for current semester</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Mobile-friendly PDF format</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-gray-900">7-Day Refund</div>
                      <div className="text-sm text-gray-600">100% money-back guarantee</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-gray-900">Secure Payment</div>
                      <div className="text-sm text-gray-600">SSL encrypted checkout</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-emerald-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-emerald-700 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Get Instant Access - ₹349
              </motion.button>

              {/* Payment Icons */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div className="flex gap-2">
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Less than the cost of one private tutoring session
            </p>
            <p className="text-sm text-gray-500 mt-2">
              *Price includes all taxes. No hidden charges.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
