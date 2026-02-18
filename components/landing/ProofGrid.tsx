"use client";
import { motion } from "motion/react";
import { FileText, TrendingUp, Award, BarChart3, CheckCircle, Calendar, Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const proofItems = [
  {
    type: "marksheet",
    title: "Student Marksheet",
    subtitle: "Data Structures - 76%",
    description: "Final exam result with detailed marks",
    icon: Award,
    trend: "+18%",
    date: "Dec 2024",
    verified: true
  },
  {
    type: "screenshot",
    title: "Study Dashboard",
    subtitle: "Progress tracking view",
    description: "Real-time learning analytics",
    icon: BarChart3,
    trend: "Active",
    date: "Jan 2025",
    verified: true
  },
  {
    type: "mocktest",
    title: "Mock Test Result",
    subtitle: "82% in practice paper",
    description: "Comprehensive assessment score",
    icon: FileText,
    trend: "+24%",
    date: "Feb 2025",
    verified: true
  },
  {
    type: "improvement",
    title: "Score Improvement",
    subtitle: "58% → 74% in 2 months",
    description: "Consistent academic growth",
    icon: TrendingUp,
    trend: "+16%",
    date: "Mar 2025",
    verified: true
  },
  {
    type: "marksheet",
    title: "Final Exam Result",
    subtitle: "Computer Networks - 79%",
    description: "Semester-end achievement",
    icon: Award,
    trend: "+21%",
    date: "Apr 2025",
    verified: true
  },
  {
    type: "screenshot",
    title: "PYQ Analysis",
    subtitle: "5-year pattern breakdown",
    description: "Strategic exam preparation",
    icon: BarChart3,
    trend: "95%",
    date: "May 2025",
    verified: true
  },
  {
    type: "mocktest",
    title: "Question Coverage",
    subtitle: "70%+ expected questions matched",
    description: "High accuracy predictions",
    icon: FileText,
    trend: "70%+",
    date: "Jun 2025",
    verified: true
  },
  {
    type: "improvement",
    title: "Study Time Reduced",
    subtitle: "40% less time, better results",
    description: "Optimized learning efficiency",
    icon: TrendingUp,
    trend: "-40%",
    date: "Jul 2025",
    verified: true
  }
];

export function ProofGrid() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const timeline = document.getElementById('timeline-container');
      if (timeline) {
        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const timelineTop = rect.top + window.scrollY;
        const timelineHeight = rect.height;
        const scrollPosition = window.scrollY + windowHeight / 2; // Use center of viewport
        
        let progress = 0;
        if (scrollPosition > timelineTop) {
          progress = Math.min((scrollPosition - timelineTop) / timelineHeight, 1);
        }
        
        setScrollProgress(Math.max(0, progress));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
            Real Results From MUJ Students
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Timeline of academic achievements and score improvements
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div id="timeline-container" className="relative max-w-6xl mx-auto">
          {/* Vertical Timeline Line with scroll fill effect */}
          <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gray-200">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-green-500 origin-top"
              style={{ scaleY: scrollProgress }}
              initial={{ scaleY: 0 }}
            />
          </div>
          
          <div className="space-y-12">
            {proofItems.map((item, index) => (
              <div key={index} className="relative flex items-center min-h-[200px]">
                {/* Timeline Dot - Centered with content */}
                <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-10"></div>
                
                {/* Mobile Layout - Image on top, text below */}
                <div className="md:hidden w-full pl-12">
                  {/* Mobile Image */}
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="mb-6"
                  >
                    <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg mb-3 mx-auto"></div>
                        <p className="text-sm text-gray-500 font-medium">Image Preview</p>
                        <p className="text-xs text-gray-400 mt-1">Click to view full size</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Mobile Text Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                      {/* Date Badge */}
                      <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </div>
                      
                      {/* Icon and Title */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {item.title}
                        </h3>
                      </div>
                      
                      {/* Subtitle */}
                      <p className="text-gray-700 font-medium mb-3">
                        {item.subtitle}
                      </p>
                      
                      {/* Description - More space for content */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Additional Details Section */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Details</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Verified academic record</li>
                          <li>• Official MUJ documentation</li>
                          <li>• Student privacy protected</li>
                        </ul>
                      </div>

                      {/* Trend and Verification */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600 text-sm font-semibold">
                            {item.trend}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Verified Result</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Desktop Layout - Image left, text right */}
                <div className="hidden md:flex w-full justify-between items-center">
                  {/* Left Image - Always visible on desktop */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="w-5/12 pr-8 flex items-center justify-center"
                  >
                    {/* Image Placeholder */}
                    <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg mb-3 mx-auto"></div>
                        <p className="text-sm text-gray-500 font-medium">Image Preview</p>
                        <p className="text-xs text-gray-400 mt-1">Click to view full size</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Center Spacer - Optimized for mobile */}
                  <div className="w-12 md:w-2/12"></div>

                  {/* Right Text Card - Always visible on desktop */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="w-5/12 pl-8 block"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                      {/* Date Badge */}
                      <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </div>
                      
                      {/* Icon and Title */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {item.title}
                        </h3>
                      </div>
                      
                      {/* Subtitle */}
                      <p className="text-gray-700 font-medium mb-3">
                        {item.subtitle}
                      </p>
                      
                      {/* Description - More space for content */}
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Additional Details Section */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Details</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Verified academic record</li>
                          <li>• Official MUJ documentation</li>
                          <li>• Student privacy protected</li>
                        </ul>
                      </div>

                      {/* Trend and Verification */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600 text-sm font-semibold">
                            {item.trend}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Verified Result</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional credibility note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-full text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            All results verified from MUJ academic records
          </div>
        </motion.div>
      </div>
    </section>
  );
}
