"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Star, Users, CheckCircle, ArrowRight } from "lucide-react";
import settings from "@/lib/settings";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtm from "@/lib/gtm";

export function ProfessionalHero() {
  const pathname = usePathname();

  useEffect(() => {
    gtm.pageview(pathname);
  }, [pathname]);

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Trust indicators */}
          <div className="flex justify-center items-center space-x-6 mb-8">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4 mr-1 text-blue-500" />
              <span className="font-medium">50,000+ Students</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              <span className="font-medium">Instant Download</span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Premium Study Materials for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Academic Excellence
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Access expert-curated notes, study guides, and exam preparation materials. 
            Pay once, download instantly, study anywhere.
          </p>

          {/* Key benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              ✓ Expert Verified Content
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              ✓ Instant PDF Downloads
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              ✓ One-Time Payment
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              ✓ Lifetime Access
            </Badge>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => window.open(settings.whatsapp.url(), '_blank')}
            >
              <Download className="w-5 h-5 mr-2" />
              Browse & Download Materials
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 dark:border-gray-600 px-8 py-4 text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View Sample Materials
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">1,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Study Materials</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">$2.99</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Starting Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
    </div>
  );
}
