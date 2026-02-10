"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Computer Science Student",
    content: "NotesNinja saved me during finals week. The materials are comprehensive and easy to understand. Worth every penny!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Business Administration",
    content: "I love that there are no subscriptions. I pay once for what I need and get lifetime access. The quality is outstanding.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Pre-Med Student",
    content: "The instant download feature is amazing. I got my study materials immediately after payment and aced my exams.",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Engineering Student",
    content: "Finally, a platform that doesn't force subscriptions! The one-time payment model is perfect for students on a budget.",
    rating: 5
  },
  {
    name: "Jessica Taylor",
    role: "Psychology Major",
    content: "The quality of these study materials is exceptional. Expert-verified content that actually helps me understand complex topics.",
    rating: 5
  },
  {
    name: "Ryan Martinez",
    role: "Economics Student",
    content: "Simple, transparent pricing with no hidden fees. I appreciate the honesty and quality of the materials.",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Students Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of students who have transformed their academic journey with NotesNinja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-blue-500 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-medium">4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <div className="flex items-center">
              <span className="font-medium">50,000+ Happy Students</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <div className="flex items-center">
              <span className="font-medium">98% Success Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
