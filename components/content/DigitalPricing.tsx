"use client";
import { motion } from "motion/react";
import { Check, Star, Download, Users, Zap, Crown, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    description: "Perfect for trying out our platform",
    price: "$0",
    period: "Free forever",
    icon: Download,
    gradient: "from-gray-500 to-gray-600",
    features: [
      "Access to 50+ free materials",
      "Basic study guides",
      "Community support",
      "Mobile app access",
      "Weekly updates"
    ],
    limitations: [
      "Limited downloads per month",
      "Basic materials only",
      "No priority support"
    ],
    popular: false,
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const
  },
  {
    name: "Student",
    description: "Most popular for serious students",
    price: "$9.99",
    period: "per month",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "Access to 500+ premium materials",
      "Advanced study guides & notes",
      "Exam preparation materials",
      "Priority email support",
      "Offline downloads",
      "Progress tracking",
      "Study group access"
    ],
    limitations: [],
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const
  },
  {
    name: "Scholar",
    description: "Ultimate academic excellence package",
    price: "$19.99",
    period: "per month",
    icon: Crown,
    gradient: "from-purple-500 to-pink-500",
    features: [
      "Unlimited access to all materials",
      "Premium study guides & notes",
      "1-on-1 tutoring sessions",
      "Personalized study plans",
      "24/7 priority support",
      "Advanced analytics",
      "Exclusive workshops",
      "Certificate of completion",
      "Early access to new materials"
    ],
    limitations: [],
    popular: false,
    buttonText: "Go Premium",
    buttonVariant: "default" as const
  }
];

const additionalFeatures = [
  {
    title: "Subject-Specific Packs",
    description: "Focused materials for individual subjects",
    price: "$4.99",
    items: ["Math Complete Pack", "Science Bundle", "Literature Collection"]
  },
  {
    title: "Exam Prep Packages",
    description: "Comprehensive exam preparation materials",
    price: "$14.99",
    items: ["SAT/ACT Prep", "GRE/GMAT Bundle", "Final Exam Kits"]
  },
  {
    title: "Study Tools",
    description: "Productivity and learning enhancement tools",
    price: "$2.99",
    items: ["Flashcard Maker", "Study Planner", "Focus Timer"]
  }
];

export function DigitalPricing() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your academic journey. All plans include instant access and no hidden fees.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <Check className="w-3 h-3 mr-1" />
              7-day free trial
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <Zap className="w-3 h-3 mr-1" />
              Cancel anytime
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
              <Star className="w-3 h-3 mr-1" />
              Satisfaction guaranteed
            </Badge>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card className={`h-full group hover:shadow-2xl transition-all duration-300 border-0 ${plan.popular ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 scale-105' : 'bg-white dark:bg-neutral-800'}`}>
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400 ml-2">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start gap-3 opacity-60">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5"></div>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center text-neutral-900 dark:text-white mb-8">
            Add-On Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-0 bg-neutral-50 dark:bg-neutral-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-neutral-900 dark:text-white">
                        {feature.title}
                      </h4>
                      <span className="text-lg font-bold text-primary">
                        {feature.price}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm text-neutral-700 dark:text-neutral-300">
                          • {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-8 md:p-12 text-white">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              30-Day Money Back Guarantee
            </h3>
            <p className="text-lg mb-8 text-green-50 max-w-2xl mx-auto">
              Try NotesNinja risk-free. If you&apos;re not completely satisfied with your purchase, we&apos;ll refund your payment in full, no questions asked.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Start Your Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Compare Plans
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
