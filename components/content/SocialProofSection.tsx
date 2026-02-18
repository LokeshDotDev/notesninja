"use client";
import { motion } from "motion/react";
import { Quote, Star, TrendingUp, Users } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "CSE Student",
    semester: "4th Semester",
    content: "The expected questions were spot on! Scored 76% in Data Structures, up from 58% last semester.",
    rating: 5,
    improvement: "58% → 76%"
  },
  {
    name: "Priya Patel",
    role: "ECE Student", 
    semester: "6th Semester",
    content: "The 3-day study plan was a lifesaver. Covered everything important without panic.",
    rating: 5,
    improvement: "62% → 79%"
  },
  {
    name: "Amit Kumar",
    role: "ME Student",
    semester: "2nd Semester", 
    content: "Mock tests helped me understand the exam pattern. Much more confident now.",
    rating: 5,
    improvement: "55% → 71%"
  }
];

const stats = [
  {
    icon: Users,
    value: "5000+",
    label: "MUJ Students Helped"
  },
  {
    icon: TrendingUp,
    value: "15%",
    label: "Average Score Improvement"
  },
  {
    icon: Star,
    value: "4.8/5",
    label: "Student Rating"
  }
];

export function SocialProofSection() {
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
            Real Results from MUJ Students
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students who improved their scores with Smart Revision Kits
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <p className="text-gray-700 leading-relaxed italic">
                  {testimonial.content}
                </p>
              </div>

              {/* Student Info */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.semester}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {testimonial.improvement}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Testimonial Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Quote className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Testimonials</h3>
                <p className="text-gray-600">Hear directly from MUJ students who scored 70%+</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
