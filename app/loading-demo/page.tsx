"use client";

import { useState } from "react";
import { PremiumLoader, PremiumPageLoader } from "@/components/ui/premium-loader";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Initializing premium experience..." },
  { text: "Loading beautiful components..." },
  { text: "Optimizing performance..." },
  { text: "Almost ready..." },
  { text: "Welcome to Notes Ninja!" },
];

export default function LoadingDemo() {
  const [showMultiStep, setShowMultiStep] = useState(false);
  const [showPageLoader, setShowPageLoader] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Premium Loading Animations
        </h1>

        {/* Apple Premium Loaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Spinner</h3>
            <div className="flex justify-center">
              <PremiumLoader variant="apple" size="large" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Dots</h3>
            <div className="flex justify-center">
              <PremiumLoader variant="dots" size="large" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Pulse</h3>
            <div className="flex justify-center">
              <PremiumLoader variant="pulse" size="large" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Skeleton</h3>
            <div className="flex justify-center">
              <PremiumLoader variant="skeleton" />
            </div>
          </div>
        </div>

        {/* Interactive Demo Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setShowMultiStep(true)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Show Multi-Step Loader
          </button>
          <button
            onClick={() => setShowPageLoader(true)}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Show Page Loader
          </button>
        </div>

        {/* Size Variations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-12">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Size Variations</h3>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <PremiumLoader variant="apple" size="small" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Small</p>
            </div>
            <div className="text-center">
              <PremiumLoader variant="apple" size="medium" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Medium</p>
            </div>
            <div className="text-center">
              <PremiumLoader variant="apple" size="large" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Large</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Apple-Inspired Design</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Premium animations with smooth easing and elegant transitions inspired by Apple&apos;s design language.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Dark Mode Support</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fully responsive to theme changes with optimized colors for both light and dark modes.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Performance Optimized</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lightweight components with smooth 60fps animations using Framer Motion.
            </p>
          </div>
        </div>
      </div>

      {/* Loaders */}
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={showMultiStep}
        duration={2000}
      />
      <PremiumPageLoader isLoading={showPageLoader} />
    </div>
  );
}
