"use client";
import { motion } from "motion/react";
import { Star, ChevronRight, ThumbsUp, ThumbsDown, MessageCircle, Share2, TrendingUp, Award, Users, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    username: "@rahul_muj_cse",
    role: "CSE Student",
    semester: "4th Semester",
    avatar: "RS",
    initials: "RS",
    rating: 5,
    content: "NotesNinja helped me score 76% in Data Structures! The expected questions were spot on. Went from 58% last semester to 76% now. Can't believe the difference! 🚀",
    achievement: "+18% Improvement",
    subject: "Data Structures",
    timestamp: "2 hours ago",
    likes: 234,
    comments: 45,
    shares: 12,
    verified: true,
    hasImage: true,
    badge: {
      text: "Top Performer",
      color: "bg-blue-100 text-blue-800"
    }
  },
  {
    id: 2,
    name: "Priya Patel",
    username: "@priya_ece_muj",
    role: "ECE Student",
    semester: "6th Semester",
    avatar: "PP",
    initials: "PP",
    rating: 5,
    content: "The 3-day study plan was a lifesaver for my ECE exams. Covered everything important without panic. Scored 79% in Computer Networks! Thank you NotesNinja team! 💯",
    achievement: "79% Score",
    subject: "Computer Networks",
    timestamp: "5 hours ago",
    likes: 189,
    comments: 32,
    shares: 8,
    verified: true,
    hasImage: true,
    badge: {
      text: "High Achiever",
      color: "bg-green-100 text-green-800"
    }
  },
  {
    id: 3,
    name: "Amit Kumar",
    username: "@amit_mech_muj",
    role: "ME Student",
    semester: "2nd Semester",
    avatar: "AK",
    initials: "AK",
    rating: 5,
    content: "Mock tests helped me understand the exam pattern perfectly. Much more confident now. Scored 71% in Engineering Mathematics. This platform is game-changing! 🎯",
    achievement: "71% Score",
    subject: "Engineering Mathematics",
    timestamp: "1 day ago",
    likes: 156,
    comments: 28,
    shares: 6,
    verified: true,
    hasImage: true,
    badge: {
      text: "Rising Star",
      color: "bg-purple-100 text-purple-800"
    }
  },
  {
    id: 4,
    name: "Neha Gupta",
    username: "@neha_it_muj",
    role: "IT Student",
    semester: "3rd Semester",
    avatar: "NG",
    initials: "NG",
    rating: 4,
    content: "The PYQ analysis is incredible! 5-year pattern breakdown helped me prepare strategically. Scored 82% in Database Management Systems. Highly recommended! 📚",
    achievement: "82% Score",
    subject: "Database Management",
    timestamp: "2 days ago",
    likes: 298,
    comments: 67,
    shares: 23,
    verified: true,
    hasImage: true,
    badge: {
      text: "Expert Analyst",
      color: "bg-orange-100 text-orange-800"
    }
  },
  {
    id: 5,
    name: "Karan Singh",
    username: "@karan_ee_muj",
    role: "EE Student",
    semester: "4th Semester",
    avatar: "KS",
    initials: "KS",
    rating: 5,
    content: "Study time reduced by 40% but results improved! The smart revision kits are amazing. Scored 75% in Electrical Machines. Best investment ever! ⚡",
    achievement: "40% Time Saved",
    subject: "Electrical Machines",
    timestamp: "3 days ago",
    likes: 412,
    comments: 89,
    shares: 34,
    verified: true,
    hasImage: true,
    badge: {
      text: "Time Master",
      color: "bg-yellow-100 text-yellow-800"
    }
  },
  {
    id: 6,
    name: "Sneha Reddy",
    username: "@sneha_cv_muj",
    role: "CV Student",
    semester: "5th Semester",
    avatar: "SR",
    initials: "SR",
    rating: 5,
    content: "70%+ expected questions matched in actual exam! Unbelievable accuracy. Scored 77% in Thermodynamics. NotesNinja is the real deal! 🔥",
    achievement: "77% Score",
    subject: "Thermodynamics",
    timestamp: "4 days ago",
    likes: 523,
    comments: 102,
    shares: 45,
    verified: true,
    hasImage: true,
    badge: {
      text: "Prediction Pro",
      color: "bg-red-100 text-red-800"
    }
  },
  {
    id: 7,
    name: "Arjun Verma",
    username: "@arjun_ce_muj",
    role: "CE Student",
    semester: "3rd Semester",
    avatar: "AV",
    initials: "AV",
    rating: 5,
    content: "The civil engineering notes saved my semester! Construction management and structural analysis became so much easier. Scored 74% in Building Materials! 🏗️",
    achievement: "74% Score",
    subject: "Building Materials",
    timestamp: "5 days ago",
    likes: 167,
    comments: 41,
    shares: 15,
    verified: true,
    hasImage: true,
    badge: {
      text: "Structural Pro",
      color: "bg-indigo-100 text-indigo-800"
    }
  },
  {
    id: 8,
    name: "Divya Mehta",
    username: "@divya_chem_muj",
    role: "Chemical Student",
    semester: "4th Semester",
    avatar: "DM",
    initials: "DM",
    rating: 5,
    content: "Organic chemistry made simple! The reaction mechanisms and diagrams helped me score 78% in Organic Chemistry. NotesNinja is a lifesaver! ⚗️",
    achievement: "78% Score",
    subject: "Organic Chemistry",
    timestamp: "6 days ago",
    likes: 289,
    comments: 56,
    shares: 21,
    verified: true,
    hasImage: true,
    badge: {
      text: "Chemistry Expert",
      color: "bg-pink-100 text-pink-800"
    }
  },
  {
    id: 9,
    name: "Rohit Jain",
    username: "@rohit_pharma_muj",
    role: "Pharmacy Student",
    semester: "2nd Semester",
    avatar: "RJ",
    initials: "RJ",
    rating: 4,
    content: "Pharmacology notes are comprehensive and easy to understand. Scored 73% in Pharmaceutical Chemistry. Great platform for pharmacy students! 💊",
    achievement: "73% Score",
    subject: "Pharmaceutical Chemistry",
    timestamp: "1 week ago",
    likes: 198,
    comments: 38,
    shares: 17,
    verified: true,
    hasImage: true,
    badge: {
      text: "Pharma Pro",
      color: "bg-teal-100 text-teal-800"
    }
  }
];

export function StudentTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Real MUJ Students</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            OUR STUDENTS ARE
            <span className="block text-green-600">WINNING</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-7xl mx-auto">
            Real success stories from Manipal University Jaipur students who transformed their academic journey
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-6 h-6 text-green-400" />
              <div className="text-3xl font-bold text-black">5000+</div>
            </div>
            <div className="text-gray-400">MUJ Students Helped</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <div className="text-3xl font-bold text-black">15%</div>
            </div>
            <div className="text-gray-400">Avg Score Improvement</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-green-400" />
              <div className="text-3xl font-bold text-black">4.8/5</div>
            </div>
            <div className="text-gray-400">Student Rating</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-6 h-6 text-green-400" />
              <div className="text-3xl font-bold text-black">70%+</div>
            </div>
            <div className="text-gray-400">Questions Matched</div>
          </div>
        </motion.div>

        {/* X-Style Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* X-Style Header */}
              <div className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                        {testimonial.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="text-white text-xs">✓</div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{testimonial.username}</span>
                        <span>·</span>
                        <span>{testimonial.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
                  </button>
                </div>
              </div>

              {/* X-Style Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-900 text-sm leading-normal whitespace-pre-wrap">
                  {testimonial.content}
                </p>
              </div>

              {/* X-Style Image */}
              <div className="px-4 pb-3">
                <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-300 rounded-lg mb-3 mx-auto"></div>
                      <p className="text-sm text-gray-500">Result Screenshot</p>
                      <p className="text-xs text-gray-400 mt-1">Click to view full size</p>
                    </div>
                  </div>
                </div>
              </div>

              </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            Start Winning Too
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-gray-600 text-sm mt-4">
            Join 5000+ MUJ students who are already winning with NotesNinja
          </p>
        </motion.div>
      </div>
    </section>
  );
}
