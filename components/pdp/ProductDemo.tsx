"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, Maximize, Eye } from 'lucide-react';

export function ProductDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const demoFeatures = [
    {
      title: "Interactive Content",
      description: "Engaging and interactive study materials that make learning fun and effective",
      preview: "See how our interactive diagrams and animations help you understand complex concepts easily"
    },
    {
      title: "Practice Questions",
      description: "Extensive question bank with detailed solutions and explanations",
      preview: "Try our practice questions with instant feedback and performance tracking"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning progress and identify areas for improvement",
      preview: "Track your study sessions, quiz scores, and overall performance"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          See It in Action
        </h2>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          Experience our study materials with this interactive demo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Demo Video Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl aspect-video">
            {/* Placeholder for demo video */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Play className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Product Demo</h3>
                <p className="text-white/80">Click to play interactive demo</p>
              </div>
            </div>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Demo Features */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {demoFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                    {feature.description}
                  </p>
                  <button className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
                    Try Demo
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
      >
        <h3 className="text-2xl font-bold mb-4">
          Ready to Transform Your Learning Experience?
        </h3>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Join thousands of students who have improved their grades with our comprehensive study materials
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg">
            Start Free Trial
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
            View Samples
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
