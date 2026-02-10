"use client";
import { motion } from "motion/react";
import { Star, Quote, GraduationCap, Award, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Medical Student",
    university: "Harvard Medical School",
    avatar: "SJ",
    rating: 5,
    content: "NotesNinja completely transformed my study routine. The medical materials are comprehensive and perfectly structured for exam preparation. I scored in the top 5% of my class!",
    achievement: "Top 5% Class Rank",
    subject: "Medicine"
  },
  {
    name: "Michael Chen",
    role: "Computer Science Major",
    university: "MIT",
    avatar: "MC",
    rating: 5,
    content: "The programming notes and algorithm explanations are crystal clear. I went from struggling with data structures to acing my technical interviews. Worth every penny!",
    achievement: "FAANG Offer",
    subject: "Computer Science"
  },
  {
    name: "Emily Rodriguez",
    role: "Biology Student",
    university: "Stanford University",
    avatar: "ER",
    rating: 5,
    content: "The biology materials are exceptional - from molecular biology to ecology. The diagrams and explanations made complex topics so much easier to understand.",
    achievement: "4.0 GPA",
    subject: "Biology"
  },
  {
    name: "James Wilson",
    role: "Engineering Student",
    university: "Caltech",
    avatar: "JW",
    rating: 4,
    content: "Mathematics and physics notes saved me countless hours. The problem-solving approaches and examples are exactly what I needed for my engineering courses.",
    achievement: "Dean's List",
    subject: "Mathematics"
  },
  {
    name: "Priya Patel",
    role: "Business Student",
    university: "Wharton School",
    avatar: "PP",
    rating: 5,
    content: "The business and economics materials are top-notch. Case studies and analyses helped me secure an internship at a top investment bank.",
    achievement: "Goldman Sachs Intern",
    subject: "Business"
  },
  {
    name: "David Kim",
    role: "Literature Major",
    university: "Yale University",
    avatar: "DK",
    rating: 5,
    content: "Literature analysis and critical thinking materials elevated my understanding of classic texts. My essays improved dramatically after using these resources.",
    achievement: "Published Author",
    subject: "Literature"
  }
];

const stats = [
  {
    icon: GraduationCap,
    value: "50,000+",
    label: "Active Students",
    description: "From top universities worldwide"
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "Average Rating",
    description: "Based on 10,000+ reviews"
  },
  {
    icon: TrendingUp,
    value: "87%",
    label: "Grade Improvement",
    description: "Students report better grades"
  }
];

export function StudentTestimonials() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Student Success Stories
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Hear from students who transformed their academic journey with NotesNinja
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-neutral-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {testimonial.rating < 5 && (
                      <Star className="w-4 h-4 text-gray-300 dark:text-neutral-600" />
                    )}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed pl-6">
                      {testimonial.content}
                    </p>
                  </div>

                  {/* Achievement Badge */}
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200">
                      <Award className="w-3 h-3 mr-1" />
                      {testimonial.achievement}
                    </Badge>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500">
                        {testimonial.university} • {testimonial.subject}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Social Proof CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Join Thousands of Successful Students
            </h3>
            <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
              Start your journey to academic excellence today. See why students from top universities trust NotesNinja for their success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Get Started Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-colors">
                Read More Reviews
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
