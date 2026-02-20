"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Headphones, Award, Users, Clock, CheckCircle } from 'lucide-react';

export function TrustSignals() {
  const trustSignals = [
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment processing with industry-standard encryption"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you with any queries"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Expert-verified content with our quality assurance promise"
    },
    {
      icon: Users,
      title: "50,000+ Students",
      description: "Trusted by thousands of students across various universities"
    },
    {
      icon: Clock,
      title: "Instant Access",
      description: "Get immediate access to digital materials upon purchase"
    },
    {
      icon: CheckCircle,
      title: "Satisfaction Guaranteed",
      description: "100% satisfaction guarantee or your money back"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="py-12"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Why Students Trust Us
        </h2>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          Your success is our priority. We&apos;re committed to providing the best learning experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trustSignals.map((signal, index) => (
          <motion.div
            key={signal.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <signal.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {signal.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                {signal.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">50,000+</div>
            <div className="text-green-100">Happy Students</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
            <div className="text-green-100">Study Materials</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">4.8/5</div>
            <div className="text-green-100">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
            <div className="text-green-100">Success Rate</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
