"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, CreditCard, BookOpen, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Materials",
    description: "Explore our collection of premium study materials across various subjects and academic levels.",
    color: "blue"
  },
  {
    icon: CreditCard,
    title: "Pay Once",
    description: "Make a secure one-time payment for your selected materials. No subscriptions, no hidden fees.",
    color: "green"
  },
  {
    icon: Download,
    title: "Download Instantly",
    description: "Get immediate access to your purchased materials in PDF format. Study anytime, anywhere.",
    color: "purple"
  }
];

const benefits = [
  "No recurring subscriptions",
  "Lifetime access to purchased materials",
  "Instant download after payment",
  "Secure payment processing",
  "High-quality, expert-verified content",
  "Multiple subjects and levels available"
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get premium study materials in three simple steps. No subscriptions, just one-time payments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center p-8 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900 flex items-center justify-center`}>
                      <step.icon className={`w-8 h-8 text-${step.color}-600 dark:text-${step.color}-400`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose NotesNinja?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simple, transparent pricing with no hidden fees or subscriptions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
