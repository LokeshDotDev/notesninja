"use client";
import { motion, AnimatePresence } from "motion/react";

interface PremiumLoaderProps {
  isLoading?: boolean;
  size?: "small" | "medium" | "large" | "xl";
  variant?: "apple" | "skeleton" | "pulse" | "dots";
  className?: string;
  text?: string;
}

export const PremiumLoader = ({ 
  isLoading = true, 
  size = "medium", 
  variant = "apple",
  className = "",
  text
}: PremiumLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {variant === "apple" && <AppleSpinner size={size} />}
      {variant === "skeleton" && <SkeletonLoader />}
      {variant === "pulse" && <PulseLoader size={size} />}
      {variant === "dots" && <DotsLoader size={size} />}
      {text && <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">{text}</span>}
    </div>
  );
};

// Apple-style sophisticated spinner
const AppleSpinner = ({ size }: { size: "small" | "medium" | "large" | "xl" }) => {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8", 
    large: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700"
        style={{ opacity: 0.3 }}
      />
      
      {/* Main spinning ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 dark:border-t-blue-400"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
        }}
      />
      
      {/* Inner accent ring */}
      <motion.div
        className="absolute inset-1 rounded-full border border-transparent border-r-blue-400 dark:border-r-blue-300"
        animate={{ rotate: -360 }}
        transition={{
          duration: 0.7,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          opacity: 0.7,
        }}
      />
      
      {/* Center dot */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full" />
      </motion.div>
    </div>
  );
};

// Elegant skeleton loader
const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-md space-y-3">
      <motion.div
        className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full"
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
      <motion.div
        className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full w-4/5"
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
          delay: 0.2,
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
      <motion.div
        className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full w-3/5"
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
          delay: 0.4,
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
};

// Sophisticated pulse loader
const PulseLoader = ({ size }: { size: "small" | "medium" | "large" | "xl" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-14 h-14",
    xl: "w-20 h-20"
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Outer pulse */}
      <motion.div
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-blue-500/20`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      
      {/* Middle pulse */}
      <motion.div
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-blue-500/40`}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.3,
        }}
      />
      
      {/* Inner core */}
      <motion.div
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500`}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
        }}
      />
    </div>
  );
};

// Professional dots loader
const DotsLoader = ({ size }: { size: "small" | "medium" | "large" | "xl" }) => {
  const dotSizes = {
    small: "w-1.5 h-1.5",
    medium: "w-2.5 h-2.5",
    large: "w-3.5 h-3.5",
    xl: "w-4.5 h-4.5"
  };

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: index * 0.15,
          }}
          style={{
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
          }}
        />
      ))}
    </div>
  );
};

// Premium full-screen loader
export const PremiumPageLoader = ({ 
  isLoading, 
  text = "Loading...",
  subtext 
}: { 
  isLoading: boolean; 
  text?: string; 
  subtext?: string; 
}) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-xl"
        >
          <div className="flex flex-col items-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.1, 
                duration: 0.5, 
                ease: [0.4, 0.0, 0.2, 1] 
              }}
            >
              <AppleSpinner size="xl" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.5, 
                ease: [0.4, 0.0, 0.2, 1] 
              }}
              className="text-center"
            >
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {text}
              </p>
              {subtext && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {subtext}
                </p>
              )}
            </motion.div>
          </div>
          
          {/* Premium background effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Premium progress bar
export const PremiumProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100 dark:bg-gray-900">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
        style={{
          backgroundSize: "200% 100%",
          backgroundPosition: `${progress * 200}% 0`,
        }}
        animate={{
          width: `${progress}%`,
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      />
      <motion.div
        className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};
