"use client";
import { motion } from "motion/react";
import { BookOpen, Clock, FileText, AlertCircle } from "lucide-react";

const problems = [
  {
    icon: BookOpen,
    title: "Too Much Syllabus",
    description: "Hundreds of pages to cover with limited time and no clear priority on what's important"
  },
  {
    icon: FileText,
    title: "No Clarity on Important Questions",
    description: "Random PDFs and notes everywhere, but no structured approach to exam preparation"
  },
  {
    icon: Clock,
    title: "Last-Minute Panic",
    description: "Starting revision too late and struggling to complete the syllabus effectively"
  },
  {
    icon: AlertCircle,
    title: "Exam Pattern Confusion",
    description: "Unsure about question types, marking schemes, and important topics"
  }
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Most MUJ Students Struggle Before Exams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The academic pressure is real, but the right preparation strategy makes all the difference
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                <problem.icon className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {problem.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
