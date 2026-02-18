"use client";
import { motion } from "motion/react";
import { FileText, Clock, CheckSquare, BookOpen, Target, Award } from "lucide-react";

const kitComponents = [
  {
    icon: FileText,
    title: "Revision Notes",
    description: "Concise, exam-focused notes covering all important concepts",
    features: [
      "Chapter-wise summary",
      "Important formulas highlighted",
      "Easy-to-understand diagrams"
    ],
    color: "blue",
    pages: "120+ pages"
  },
  {
    icon: CheckSquare,
    title: "Mock Papers",
    description: "2 full-length practice papers with detailed solutions",
    features: [
      "Exact exam pattern",
      "Step-by-step solutions",
      "Time management tips"
    ],
    color: "purple",
    pages: "2 papers + solutions"
  },
  {
    icon: Target,
    title: "Expected Questions",
    description: "70%+ likely questions based on pattern analysis",
    features: [
      "5-year trend analysis",
      "Mark-wise distribution",
      "Model answers included"
    ],
    color: "emerald",
    pages: "200+ questions"
  },
  {
    icon: Clock,
    title: "3-Day Study Plan",
    description: "Strategic revision schedule for final exam preparation",
    features: [
      "Day-wise breakdown",
      "Priority topics first",
      "Revision checkpoints"
    ],
    color: "orange",
    pages: "Detailed schedule"
  },
  {
    icon: BookOpen,
    title: "Quick Revision Sheet",
    description: "Last-minute formula sheet and important points",
    features: [
      "All formulas in one place",
      "Key definitions",
      "Exam day checklist"
    ],
    color: "red",
    pages: "20+ pages"
  },
  {
    icon: Award,
    title: "Exam Survival Guide",
    description: "Pro tips to maximize your score in the exam",
    features: [
      "Answer writing tips",
      "Time allocation strategy",
      "Common mistakes to avoid"
    ],
    color: "indigo",
    pages: "15+ pages"
  }
];

export function KitBreakdownSection() {
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
            Everything You Need in One Smart Kit
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Structured modules designed for systematic exam preparation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kitComponents.map((component, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden h-full">
                {/* Header */}
                <div className={`p-6 bg-gradient-to-br ${
                  component.color === "blue" ? "from-blue-50 to-blue-100 border-blue-200" :
                  component.color === "purple" ? "from-purple-50 to-purple-100 border-purple-200" :
                  component.color === "emerald" ? "from-emerald-50 to-emerald-100 border-emerald-200" :
                  component.color === "orange" ? "from-orange-50 to-orange-100 border-orange-200" :
                  component.color === "red" ? "from-red-50 to-red-100 border-red-200" :
                  "from-indigo-50 to-indigo-100 border-indigo-200"
                } border-b`}>
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      component.color === "blue" ? "bg-blue-600" :
                      component.color === "purple" ? "bg-purple-600" :
                      component.color === "emerald" ? "bg-emerald-600" :
                      component.color === "orange" ? "bg-orange-600" :
                      component.color === "red" ? "bg-red-600" :
                      "bg-indigo-600"
                    }`}>
                      <component.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                      {component.pages}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                    {component.title}
                  </h3>
                  <p className="text-gray-600">
                    {component.description}
                  </p>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {component.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          component.color === "blue" ? "bg-blue-100" :
                          component.color === "purple" ? "bg-purple-100" :
                          component.color === "emerald" ? "bg-emerald-100" :
                          component.color === "orange" ? "bg-orange-100" :
                          component.color === "red" ? "bg-red-100" :
                          "bg-indigo-100"
                        }`}>
                          <CheckSquare className={`w-3 h-3 ${
                            component.color === "blue" ? "text-blue-600" :
                            component.color === "purple" ? "text-purple-600" :
                            component.color === "emerald" ? "text-emerald-600" :
                            component.color === "orange" ? "text-orange-600" :
                            component.color === "red" ? "text-red-600" :
                            "text-indigo-600"
                          }`} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-8 border border-emerald-200"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Exam Preparation System
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              All modules work together to create a comprehensive study experience that covers every aspect of your MUJ semester exam preparation.
            </p>
            {/* <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-6 py-3 rounded-full border border-gray-200">
                <span className="font-semibold text-gray-900">400+ Pages</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-full border border-gray-200">
                <span className="font-semibold text-gray-900">6 Complete Modules</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-full border border-gray-200">
                <span className="font-semibold text-gray-900">Instant Download</span>
              </div>
            </div> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
