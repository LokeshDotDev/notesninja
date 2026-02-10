"use client";
import { motion } from "motion/react";
import { ArrowRight, Download, BookOpen, Star, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function FinalCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          {/* Main Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Academic Journey?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join 50,000+ students who are already excelling with NotesNinja's premium digital materials
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              No Credit Card Required
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Instant Access
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              4.9/5 Rating
            </Badge>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Materials
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">50K+</div>
              <div className="text-blue-100">Happy Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">1000+</div>
              <div className="text-blue-100">Study Materials</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">98%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>

          {/* Final Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20">
            <h3 className="text-xl font-bold mb-4">Your Success Story Starts Here</h3>
            <p className="text-blue-100 mb-6">
              Don't let poor study materials hold you back. Get access to premium, expert-curated content that has helped thousands of students achieve their academic goals.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
              <CheckCircle className="w-4 h-4" />
              <span>7-day free trial</span>
              <span className="mx-2">•</span>
              <CheckCircle className="w-4 h-4" />
              <span>Cancel anytime</span>
              <span className="mx-2">•</span>
              <CheckCircle className="w-4 h-4" />
              <span>No hidden fees</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
