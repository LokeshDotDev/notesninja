"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for trying out our platform",
    price: "$9.99",
    period: "/month",
    features: [
      "Access to 50+ study notes",
      "Basic exam guides",
      "PDF downloads",
      "Email support",
      "Mobile access"
    ],
    notIncluded: [
      "Interactive quizzes",
      "Priority support",
      "Community access",
      "Advanced analytics"
    ],
    badge: null,
    popular: false,
    color: "neutral"
  },
  {
    name: "Student Plus",
    description: "Most popular for active students",
    price: "$19.99",
    period: "/month",
    features: [
      "Access to 500+ study materials",
      "Comprehensive exam guides",
      "Multiple format downloads",
      "Priority email support",
      "Interactive quizzes & flashcards",
      "Community access",
      "Progress tracking"
    ],
    notIncluded: [
      "1-on-1 tutoring",
      "Custom content requests"
    ],
    badge: "Most Popular",
    popular: true,
    color: "blue"
  },
  {
    name: "Academic Pro",
    description: "Ultimate package for top performers",
    price: "$39.99",
    period: "/month",
    features: [
      "Unlimited access to all content",
      "Premium exam preparation",
      "All format downloads",
      "24/7 priority support",
      "Advanced learning tools",
      "Exclusive community access",
      "Detailed analytics & insights",
      "Monthly 1-on-1 tutoring session",
      "Custom content requests"
    ],
    notIncluded: [],
    badge: "Best Value",
    popular: false,
    color: "purple"
  }
];

const subjects = [
  "Mathematics", "Science", "Engineering", "Business", 
  "Computer Science", "Medicine", "Law", "Arts"
];

export function PricingSection() {
  return (
    <section className="py-20 px-4 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8">
            Flexible pricing plans designed to meet every student&apos;s needs. Start with our free trial and upgrade as you grow.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {subjects.map((subject) => (
              <Badge key={subject} variant="outline" className="text-sm">
                {subject}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  {plan.popular ? (
                    <Crown className="w-8 h-8 text-blue-500" />
                  ) : (
                    <Star className="w-8 h-8 text-neutral-400" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-neutral-600 dark:text-neutral-400">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 opacity-50">
                      <X className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <span className="text-sm text-neutral-500 dark:text-neutral-500">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-500 hover:bg-blue-600' : 'bg-neutral-900 hover:bg-neutral-800'} text-white`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.popular ? "Get Started" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="text-neutral-700 dark:text-neutral-300">
              <strong>30-day money-back guarantee</strong> • No questions asked
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
