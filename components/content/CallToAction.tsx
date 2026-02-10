"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import settings from "@/lib/settings";

export function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2">
          No Subscription Required
        </Badge>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Excel in Your Studies?
        </h2>
        
        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Join thousands of students who have already discovered the better way to study. 
          Pay once, download instantly, study forever.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <CheckCircle className="w-8 h-8 mb-4 mx-auto text-green-300" />
            <h3 className="font-semibold mb-2">One-Time Payment</h3>
            <p className="text-sm text-white/80">
              No recurring subscriptions or hidden fees
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Download className="w-8 h-8 mb-4 mx-auto text-blue-300" />
            <h3 className="font-semibold mb-2">Instant Download</h3>
            <p className="text-sm text-white/80">
              Get your materials immediately after payment
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <BookOpen className="w-8 h-8 mb-4 mx-auto text-purple-300" />
            <h3 className="font-semibold mb-2">Lifetime Access</h3>
            <p className="text-sm text-white/80">
              Study your materials anytime, anywhere
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => window.open(settings.whatsapp.url(), '_blank')}
          >
            <Download className="w-5 h-5 mr-2" />
            Browse & Download Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-200"
          >
            View Sample Materials
          </Button>
        </div>

        <div className="mt-12 text-sm text-white/70">
          <p>Secure payment • Instant access • No subscription • 24/7 support</p>
        </div>
      </div>
    </section>
  );
}
