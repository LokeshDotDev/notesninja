"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, BookOpen, Users, Gift } from "lucide-react";
import settings from "@/lib/settings";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2">
          <Gift className="w-4 h-4 mr-2" />
          Limited Time Offer
        </Badge>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Start Your Academic Journey Today
        </h2>
        
        <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Join thousands of successful students who have transformed their grades with NotesNinja. 
          Get instant access to premium study materials and start seeing results immediately.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Download className="w-8 h-8 mb-4 mx-auto text-white" />
            <h3 className="font-semibold mb-2">Free Sample Notes</h3>
            <p className="text-sm text-white/80">
              Download 5 free study notes to experience our quality
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <BookOpen className="w-8 h-8 mb-4 mx-auto text-white" />
            <h3 className="font-semibold mb-2">7-Day Free Trial</h3>
            <p className="text-sm text-white/80">
              Full access to all features, no credit card required
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Users className="w-8 h-8 mb-4 mx-auto text-white" />
            <h3 className="font-semibold mb-2">Student Community</h3>
            <p className="text-sm text-white/80">
              Connect with peers and share study strategies
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-white/90 px-8 py-4 text-lg font-semibold"
            onClick={() => window.open(settings.whatsapp.url(), '_blank')}
          >
            <Download className="w-5 h-5 mr-2" />
            Get Free Samples
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
          >
            Browse Collection
          </Button>
        </div>

        <div className="mt-12 text-sm text-white/70">
          <p>No credit card required • Cancel anytime • Instant access</p>
        </div>
      </div>
    </section>
  );
}
