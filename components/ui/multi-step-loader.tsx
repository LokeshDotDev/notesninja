"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);
        const isActive = index === value;
        const isCompleted = index < value;

        return (
          <motion.div
            key={index}
            className={cn("text-left flex gap-3 mb-6", isActive && "scale-105")}
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ 
              opacity: opacity, 
              y: -(value * 40),
              x: isActive ? 0 : isCompleted ? -10 : 10,
              scale: isActive ? 1.02 : 1
            }}
            transition={{ 
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1]
            }}
          >
            <div className="relative">
              {/* Background circle */}
              <motion.div
                className="absolute inset-0 w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-700"
                animate={{
                  borderColor: isActive ? "#3b82f6" : isCompleted ? "#10b981" : "#e5e7eb",
                }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Progress ring for active state */}
              {isActive && (
                <motion.svg
                  className="absolute inset-0 w-6 h-6"
                  viewBox="0 0 24 24"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 270 }}
                  transition={{
                    duration: 1.5,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 8}`}
                    strokeDashoffset={`${2 * Math.PI * 8 * 0.25}`}
                    strokeLinecap="round"
                  />
                </motion.svg>
              )}
              
              {/* Check or icon */}
              <div className="relative flex items-center justify-center w-6 h-6">
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.4, 0.0, 0.2, 1]
                    }}
                  >
                    <CheckFilled className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                )}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </motion.div>
                )}
                {!isActive && !isCompleted && (
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <motion.span
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : isCompleted 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-gray-500 dark:text-gray-400"
                )}
                animate={{
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {loadingState.text}
              </motion.span>
              
              {/* Subtle underline for active state */}
              {isActive && (
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-blue-500 to-transparent mt-1"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                  }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);
  
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(20px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xl"
        >
          <div className="relative">
            {/* Premium background effect */}
            <motion.div
              className="absolute inset-0 -z-10"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{
                filter: "blur(100px)",
                width: "600px",
                height: "600px",
                transform: "translate(-50%, -50%)",
                left: "50%",
                top: "50%",
              }}
            />
            
            <div className="relative h-96">
              <LoaderCore value={currentState} loadingStates={loadingStates} />
            </div>
          </div>

          {/* Premium gradient overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-white/80 via-white/40 to-transparent dark:from-black/80 dark:via-black/40"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
