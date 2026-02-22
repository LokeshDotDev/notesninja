"use client";
import { motion } from "motion/react";
import { Search, Download, CreditCard, Sparkles, Shield, BookOpen, Library, ShoppingCart, Wallet, CloudDownload, Smartphone, FileDown, Headphones, RefreshCw, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

// Aceternity Card Components
export const AceternityCard = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const AceternityCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-800 dark:text-white py-2",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const AceternityCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export const AceternityCardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-[15rem] md:h-[20rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

// Sparkles animation component
const SparklesAnimation = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        ></motion.span>
      ))}
    </div>
  );
};

// Custom skeleton for each step
const BrowseSkeleton = () => {
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
          className="h-8 w-8 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        >
          <Search className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.7 }}
          className="h-12 w-12 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        >
          <Library className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.9 }}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        >
          <BookOpen className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </motion.div>
      </div>
      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <SparklesAnimation />
        </div>
      </div>
    </div>
  );
};

const PaymentSkeleton = () => {
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        >
          <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.7 }}
          className="h-12 w-12 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        >
          <CreditCard className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.9 }}
          className="h-8 w-8 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        >
          <Wallet className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </motion.div>
      </div>
      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <SparklesAnimation />
        </div>
      </div>
    </div>
  );
};

const DownloadSkeleton = () => {
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
          className="h-8 w-8 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        >
          <CloudDownload className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.7 }}
          className="h-12 w-12 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        >
          <FileDown className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.9 }}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]"
        >
          <Smartphone className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </motion.div>
      </div>
      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 absolute -left-10">
          <SparklesAnimation />
        </div>
      </div>
    </div>
  );
};

const steps = [
  {
    title: "Browse Materials",
    description: "Explore our collection of premium study materials across various subjects and academic levels.",
    skeleton: <BrowseSkeleton />,
    color: "blue"
  },
  {
    title: "Pay Once",
    description: "Make a secure one-time payment for your selected materials. No subscriptions, no hidden fees.",
    skeleton: <PaymentSkeleton />,
    color: "emerald"
  },
  {
    title: "Download Instantly",
    description: "Get immediate access to your purchased materials in PDF format. Study anytime, anywhere.",
    skeleton: <DownloadSkeleton />,
    color: "purple"
  }
];

export function HowItWorks() {
  const [, setHoveredStep] = useState<number | null>(null);
  
  return (
    <section className="relative py-32 px-6 bg-white dark:bg-black overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/20 dark:to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0_/_0.02)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgb(255_255_255_/_0.02)_0%,transparent_70%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-12">
            <Sparkles className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 tracking-wide uppercase">Simple Process</span>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-semibold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
            How It Works
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-normal">
            Get premium study materials in three simple steps. 
            <span className="font-semibold text-gray-900 dark:text-white"> No subscriptions, just one-time payments.</span>
          </p>
        </motion.div>

        {/* Premium Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
              className="relative group"
            >
              {/* Connection Line Removed */}
              
              <AceternityCard className="h-full cursor-pointer group-hover:shadow-lg transition-all duration-300">
                {/* Step Number */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  {index + 1}
                </motion.div>
                
                <AceternityCardSkeletonContainer>
                  {step.skeleton}
                </AceternityCardSkeletonContainer>
                
                <AceternityCardTitle>{step.title}</AceternityCardTitle>
                <AceternityCardDescription>{step.description}</AceternityCardDescription>
              </AceternityCard>
            </motion.div>
          ))}
        </div>

         {/* Premium Why Choose Section */}
         <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-6 sm:p-10 md:p-16 lg:p-24 relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
          
            
            <div className="relative z-10 max-w-4xl mx-auto">
              {/* Clean icon */}
              <div className="flex justify-center mb-10">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                  <Download className="w-7 h-7 text-slate-700 dark:text-slate-300" />
                </div>
              </div>
              
              {/* Clean typography */}
              <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 leading-tight">
                Can&apos;t find what you&apos;re looking for?
              </h3>
              
              <p className="text-base sm:text-lg md:text-xl text-center text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 leading-relaxed">
                We&apos;re constantly adding new study materials for different courses. Request specific materials and we&apos;ll prioritize them for our next update!
              </p>
              
              {/* Clean button layout */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-16">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <a
                    href="https://wa.me/6378990158"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Request Resources
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                {/* <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium px-8 py-4 rounded-2xl transition-all duration-300">
                  <a
                    href={`${settings.site.url}/online-manipal-university/notes-and-mockpaper`}
                    className="flex items-center"
                  >
                    View All Products
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </a>
                </Button> */}
              </div>
              
              {/* Clean feature indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">Expert Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium">Regular Updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium">Active Support</span>
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
