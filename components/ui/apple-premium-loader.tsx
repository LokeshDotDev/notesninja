"use client";
import { motion, AnimatePresence } from "motion/react";

interface AppleLoaderProps {
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  className?: string;
}

export const ApplePremiumLoader = ({ 
  isLoading = true, 
  size = "medium", 
  variant = "spinner",
  className = "" 
}: AppleLoaderProps) => {
  if (!isLoading) return null;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.4, 0.0, 0.2, 1] 
          }}
          className={`flex items-center justify-center ${className}`}
        >
          {variant === "spinner" && <AppleSpinner size={size} />}
          {variant === "dots" && <AppleDots size={size} />}
          {variant === "pulse" && <ApplePulse size={size} />}
          {variant === "skeleton" && <AppleSkeleton />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AppleSpinner = ({ size }: { size: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-14 h-14"
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700"
        style={{ opacity: 0.3 }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 dark:border-t-blue-400"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.2,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-transparent border-r-blue-400 dark:border-r-blue-300"
        animate={{ rotate: -360 }}
        transition={{
          duration: 0.8,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          opacity: 0.6,
          boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)",
        }}
      />
    </div>
  );
};

const AppleDots = ({ size }: { size: "small" | "medium" | "large" }) => {
  const dotSizes = {
    small: "w-1.5 h-1.5",
    medium: "w-2 h-2",
    large: "w-3 h-3"
  };

  const spacing = {
    small: "gap-1.5",
    medium: "gap-2",
    large: "gap-3"
  };

  return (
    <div className={`flex items-center ${spacing[size]}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: index * 0.15,
          }}
          style={{
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
          }}
        />
      ))}
    </div>
  );
};

const ApplePulse = ({ size }: { size: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <motion.div
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 0.3, 0.8],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
        }}
      />
      <motion.div
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-300 dark:to-blue-400`}
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
};

const AppleSkeleton = () => {
  return (
    <div className="w-full max-w-md space-y-3">
      <motion.div
        className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full"
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5"
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.2,
        }}
      />
      <motion.div
        className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/5"
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.4,
        }}
      />
    </div>
  );
};

// Premium full-screen loader for page transitions
export const ApplePageLoader = ({ isLoading }: { isLoading: boolean }) => {
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
              <AppleSpinner size="large" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.5, 
                ease: [0.4, 0.0, 0.2, 1] 
              }}
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Premium progress bar for navigation
export const AppleProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gray-100 dark:bg-gray-900">
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
        className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
