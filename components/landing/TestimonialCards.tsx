"use client";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    course: "CSE • 4th Semester",
    image: "/api/placeholder/60/60",
    testimonial: "The expected questions were exactly what came in the exam. Scored 76% in Data Structures, up from 58% last semester.",
    improvement: "58% → 76%",
    rating: 5
  },
  {
    name: "Priya Patel",
    course: "ECE • 6th Semester",
    image: "/api/placeholder/60/60",
    testimonial: "The 3-day study plan helped me cover everything without panic. Much more organized than random PDFs.",
    improvement: "62% → 79%",
    rating: 5
  },
  {
    name: "Amit Kumar",
    course: "ME • 2nd Semester",
    image: "/api/placeholder/60/60",
    testimonial: "Mock tests gave me real exam experience. Finally understood how to manage time and write proper answers.",
    improvement: "55% → 71%",
    rating: 5
  },
  {
    name: "Neha Gupta",
    course: "CE • 4th Semester",
    image: "/api/placeholder/60/60",
    testimonial: "PYQ analysis was spot on. Knew exactly which chapters to focus on. Saved so much time.",
    improvement: "60% → 75%",
    rating: 5
  },
  {
    name: "Karan Singh",
    course: "CSE • 6th Semester",
    image: "/api/placeholder/60/60",
    testimonial: "Model answers helped me understand evaluation pattern. Writing style improved significantly.",
    improvement: "59% → 73%",
    rating: 5
  },
  {
    name: "Anjali Reddy",
    course: "ECE • 2nd Semester",
    image: "/api/placeholder/60/60",
    testimonial: "Everything in one place. No more searching for random notes. Very systematic approach.",
    improvement: "57% → 72%",
    rating: 5
  }
];

export function TestimonialCards() {
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
            What MUJ Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real experiences from students who improved their scores
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-700 leading-relaxed">
                  {testimonial.testimonial}
                </p>
              </div>

              {/* Student Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.course}</div>
                  </div>
                </div>
                
                {/* Improvement Badge */}
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {testimonial.improvement}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional credibility */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Verified Results from 5000+ MUJ Students
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">4.8/5</div>
                <div className="text-gray-600 text-sm">Average Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">15%</div>
                <div className="text-gray-600 text-sm">Average Score Improvement</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">95%</div>
                <div className="text-gray-600 text-sm">Would Recommend</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
