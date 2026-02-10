"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const testimonials = [
  {
    quote: "NotesNinja completely transformed my study routine. The comprehensive notes and exam guides helped me improve my grades from C's to A's in just one semester!",
    name: "Sarah Johnson",
    designation: "Computer Science Major",
    src: "/api/placeholder/100/100",
    rating: 5
  },
  {
    quote: "As a working student, I needed flexible study materials. NotesNinja's instant downloads and mobile-friendly content allowed me to study during my commute and lunch breaks.",
    name: "Michael Chen",
    designation: "Business Administration",
    src: "/api/placeholder/100/100",
    rating: 5
  },
  {
    quote: "The quality of content is exceptional. Every concept is explained clearly with examples that actually make sense. Worth every penny!",
    name: "Emily Rodriguez",
    designation: "Pre-Med Student",
    src: "/api/placeholder/100/100",
    rating: 5
  },
  {
    quote: "I've tried many study resources, but NotesNinja stands out. The expert-verified content gives me confidence that I'm learning accurate information.",
    name: "David Kim",
    designation: "Engineering Student",
    src: "/api/placeholder/100/100",
    rating: 5
  },
  {
    quote: "The interactive learning features are amazing! Quizzes and flashcards make studying so much more engaging than just reading textbooks.",
    name: "Jessica Taylor",
    designation: "Psychology Major",
    src: "/api/placeholder/100/100",
    rating: 5
  },
  {
    quote: "NotesNinja saved me during finals week. The exam preparation guides were exactly what I needed to ace my tests. Highly recommend!",
    name: "Ryan Martinez",
    designation: "Economics Student",
    src: "/api/placeholder/100/100",
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            What Students Are Saying
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Join thousands of successful students who have transformed their academic journey with NotesNinja&apos;s premium study materials.
          </p>
        </div>

        <div className="mb-16">
          <AnimatedTestimonials testimonials={testimonials} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6 border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">4.9/5</div>
              <div className="text-neutral-600 dark:text-neutral-400">Average Rating</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <Quote className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">10,000+</div>
              <div className="text-neutral-600 dark:text-neutral-400">Happy Students</div>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <Star className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">95%</div>
              <div className="text-neutral-600 dark:text-neutral-400">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
