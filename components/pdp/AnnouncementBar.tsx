"use client";

import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 relative"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <p className="text-sm font-medium">
          🎉 Limited Time Offer: Get 20% off on all study materials! Use code: STUDY20
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
