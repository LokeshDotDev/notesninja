"use client";
import { motion } from "motion/react";
import { Star, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Medical Student",
    university: "Harvard Medical School",
    avatar: "SJ",
    initials: "SJ",
    rating: 5,
    content: "NotesNinja completely transformed my study routine. The medical materials are comprehensive and perfectly structured for exam preparation. I scored in the top 5% of my class!",
    achievement: "Top 5% Class Rank",
    subject: "Medicine",
    gradient: "from-blue-500 to-purple-600",
    badge: {
      text: "Top Performer",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Computer Science Major",
    university: "MIT",
    avatar: "MC",
    initials: "MC",
    rating: 5,
    content: "The programming notes and algorithm explanations are crystal clear. I went from struggling with data structures to acing my technical interviews. Worth every penny!",
    achievement: "FAANG Offer",
    subject: "Computer Science",
    gradient: "from-green-500 to-teal-600",
    badge: {
      text: "Tech Success",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Biology Student",
    university: "Stanford University",
    avatar: "ER",
    initials: "ER",
    rating: 5,
    content: "The biology materials are exceptional - from molecular biology to ecology. The diagrams and explanations made complex topics so much easier to understand.",
    achievement: "4.0 GPA",
    subject: "Biology",
    gradient: "from-purple-500 to-pink-600",
    badge: {
      text: "Perfect GPA",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    }
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Engineering Student",
    university: "Caltech",
    avatar: "JW",
    initials: "JW",
    rating: 4,
    content: "Mathematics and physics notes saved me countless hours. The problem-solving approaches and examples are exactly what I needed for my engineering courses.",
    achievement: "Dean's List",
    subject: "Mathematics",
    gradient: "from-orange-500 to-red-600",
    badge: {
      text: "Dean's List",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    }
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Business Student",
    university: "Wharton School",
    avatar: "PP",
    initials: "PP",
    rating: 5,
    content: "The business and economics materials are top-notch. Case studies and analyses helped me secure an internship at a top investment bank.",
    achievement: "Goldman Sachs Intern",
    subject: "Business",
    gradient: "from-yellow-500 to-amber-600",
    badge: {
      text: "Investment Banking",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  },
  {
    id: 6,
    name: "David Kim",
    role: "Literature Major",
    university: "Yale University",
    avatar: "DK",
    initials: "DK",
    rating: 5,
    content: "Literature analysis and critical thinking materials elevated my understanding of classic texts. My essays improved dramatically after using these resources.",
    achievement: "Published Author",
    subject: "Literature",
    gradient: "from-indigo-500 to-blue-600",
    badge: {
      text: "Published",
      color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
    }
  }
];

export function StudentTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
         {/* Testimonial Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          // className="py-24 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800"
        >
          <div className="max-w-7xl mx-auto px-6">
            {/* Modern Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-full mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Student Success Stories</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
                What our students say
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                Real experiences from real students who transformed their academic journey
              </p>
            </motion.div>

            {/* Auto-Rotating Featured Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="relative h-64 md:h-80">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{
                      opacity: index === currentTestimonial ? 1 : 0,
                      x: index === currentTestimonial ? 0 : 100,
                      scale: index === currentTestimonial ? 1 : 0.9
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 ${index === currentTestimonial ? 'z-10' : 'z-0'}`}
                  >
                    <div className={`bg-gradient-to-r ${testimonial.gradient} rounded-3xl p-12 text-white relative overflow-hidden h-full`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="relative z-10 h-full flex flex-col justify-center">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="flex items-start gap-8"
                        >
                          <div className="flex-1">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.6, delay: 0.3 }}
                              className="text-6xl font-bold mb-6 opacity-20"
                            >
                              &quot;
                            </motion.div>
                            <motion.p 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.4 }}
                              className="text-2xl font-medium mb-8 leading-relaxed"
                            >
                              {testimonial.content}
                            </motion.p>
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.5 }}
                              className="flex items-center gap-4"
                            >
                              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                                {testimonial.initials}
                              </div>
                              <div>
                                <p className="text-xl font-semibold">{testimonial.name}</p>
                                <p className="text-white/80">{testimonial.role}</p>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Progress Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'w-8 bg-neutral-900 dark:bg-white' 
                        : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Premium Testimonial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mb-16">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6"
                >
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-800">
                    {/* Star Rating */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Quote Icon */}
                    <div className="text-6xl font-bold text-neutral-200 dark:text-neutral-700 mb-4">&quot;</div>
                    
                    {/* Testimonial Content */}
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 text-sm">
                      {testimonial.content}
                    </p>
                    
                    {/* Badge */}
                    <div className="mb-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${testimonial.badge.color}`}>
                        {testimonial.badge.text}
                      </span>
                    </div>
                    
                    {/* Author Info */}
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white text-base">{testimonial.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{testimonial.university}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">10K+</div>
                <div className="text-neutral-600 dark:text-neutral-400">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">50K+</div>
                <div className="text-neutral-600 dark:text-neutral-400">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">4.9★</div>
                <div className="text-neutral-600 dark:text-neutral-400">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">6</div>
                <div className="text-neutral-600 dark:text-neutral-400">Courses Covered</div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                Join Our Community
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
