"use client";
import { motion } from "motion/react";
import { Play } from "lucide-react";

const interviews = [
  {
    title: "From 58% to 76% in Data Structures",
    student: "Rahul Sharma • CSE 4th Semester",
    thumbnail: "/api/placeholder/400/225",
    duration: "4:32"
  },
  {
    title: "How 3-Day Plan Saved My Semester",
    student: "Priya Patel • ECE 6th Semester", 
    thumbnail: "/api/placeholder/400/225",
    duration: "3:45"
  },
  {
    title: "Mock Test Strategy That Actually Works",
    student: "Amit Kumar • ME 2nd Semester",
    thumbnail: "/api/placeholder/400/225",
    duration: "5:18"
  }
];

export function VideoInterviews() {
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
            Student Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            In-depth conversations with MUJ students about their preparation journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {interviews.map((interview, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                  {/* Thumbnail placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <p className="text-white text-sm font-medium">Click to watch</p>
                    </div>
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {interview.duration}
                  </div>
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {interview.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {interview.student}
                  </p>
                  
                  {/* Interview style indicator */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Interview-style conversation</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional context */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Real Conversations, Real Results
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              These are not scripted testimonials. We sat down with actual MUJ students to discuss their exam preparation challenges, how they used Smart Revision Kits, and their actual score improvements.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-gray-50 px-4 py-2 rounded-full text-sm text-gray-700">
                🎥 Unscripted conversations
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-full text-sm text-gray-700">
                📊 Real score improvements
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-full text-sm text-gray-700">
                🎓 MUJ students only
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
