"use client";
import { motion } from "motion/react";
import { CheckCircle, Target, TrendingUp, FileCheck, Calendar, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Target,
    title: "70%+ Expected Question Coverage",
    description: "Carefully curated questions based on 5-year MUJ exam patterns and faculty preferences",
    color: "emerald"
  },
  {
    icon: TrendingUp,
    title: "5-Year Pattern Analysis",
    description: "Deep insights into question types, marking schemes, and frequently asked topics",
    color: "blue"
  },
  {
    icon: FileCheck,
    title: "2 Full-Length Mock Tests",
    description: "Simulated exam experience with detailed solutions and time management strategies",
    color: "purple"
  },
  {
    icon: BookOpen,
    title: "Ready-to-Write Model Answers",
    description: "Structured answers that match MUJ evaluation standards and marking criteria",
    color: "orange"
  },
  {
    icon: Calendar,
    title: "3-Day Study Plan",
    description: "Strategic revision schedule covering all important topics in the final days",
    color: "red"
  }
];

export function SolutionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Introducing the MUJ Smart Exam Survival Kit
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to score 70%+ in one comprehensive, structured package
          </p>
        </motion.div>

        <div className="space-y-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "flex flex-col lg:flex-row items-center gap-8 lg:gap-12",
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              {/* Icon and Content */}
              <div className="flex-1">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                  {
                    "bg-emerald-50": feature.color === "emerald",
                    "bg-blue-50": feature.color === "blue",
                    "bg-purple-50": feature.color === "purple",
                    "bg-orange-50": feature.color === "orange",
                    "bg-red-50": feature.color === "red"
                  }
                )}>
                  <feature.icon className={cn(
                    "w-8 h-8",
                    {
                      "text-emerald-600": feature.color === "emerald",
                      "text-blue-600": feature.color === "blue",
                      "text-purple-600": feature.color === "purple",
                      "text-orange-600": feature.color === "orange",
                      "text-red-600": feature.color === "red"
                    }
                  )} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Visual Element */}
              <div className="flex-1">
                <div className={cn(
                  "rounded-2xl p-8 border-2",
                  {
                    "bg-emerald-50 border-emerald-200": feature.color === "emerald",
                    "bg-blue-50 border-blue-200": feature.color === "blue",
                    "bg-purple-50 border-purple-200": feature.color === "purple",
                    "bg-orange-50 border-orange-200": feature.color === "orange",
                    "bg-red-50 border-red-200": feature.color === "red"
                  }
                )}>
                  <div className="flex items-center justify-center">
                    <CheckCircle className={cn(
                      "w-24 h-24",
                      {
                        "text-emerald-600": feature.color === "emerald",
                        "text-blue-600": feature.color === "blue",
                        "text-purple-600": feature.color === "purple",
                        "text-orange-600": feature.color === "orange",
                        "text-red-600": feature.color === "red"
                      }
                    )} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
