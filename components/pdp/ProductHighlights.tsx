"use client";

import React from 'react';
import { motion } from 'motion/react';

export function ProductHighlights() {
  return (
    <div className="py-20 lg:py-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Product Highlights
        </h2>
      </motion.div>

      {/* First Highlight Section - Image Left, Content Right */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="rounded-3xl p-8 lg:p-12 mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Image */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&crop=center"
                alt="Study materials transformation"
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              Transform Your Study Experience
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Watch your academic performance soar with our comprehensive study materials. From confusion to clarity, our resources bridge the gap between struggle and success.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Improved understanding of complex topics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Better exam preparation and confidence</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Higher grades and academic achievement</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Second Highlight Section - Content Left, Image Right */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        className="rounded-3xl p-8 lg:p-12 mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              Expert-Verified Content You Can Trust
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Our study materials are crafted by subject matter experts and experienced educators, ensuring accuracy, relevance, and educational effectiveness.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Regularly updated content</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Aligned with latest curriculum</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Proven student success rate</span>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"
                alt="Expert educators creating study materials"
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Third Highlight Section - Image Left, Content Right */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        className="rounded-3xl p-8 lg:p-12 mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Image */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center"
                alt="Students achieving academic success"
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              Achieve Your Academic Goals
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Join thousands of successful students who have transformed their academic journey with our comprehensive study materials and expert guidance.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Track your progress effectively</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Access anytime, anywhere</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Join a community of learners</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fourth Highlight Section - Content Left, Image Right */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
        className="rounded-3xl p-8 lg:p-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              Start Your Success Journey Today
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Take the first step towards academic excellence. Our comprehensive study materials are designed to help you achieve your goals with confidence.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Instant access to all materials</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">24/7 student support available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Money-back satisfaction guarantee</span>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop&crop=center"
                alt="Students celebrating academic success"
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
