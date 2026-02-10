"use client";
import { motion } from "motion/react";
import { 
  Calculator, 
  FlaskConical, 
  BookOpen, 
  Globe, 
  Palette, 
  Music,
  Dna,
  Code,
  Brain,
  History,
  Stethoscope,
  Briefcase,
  ChevronRight,
  Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const subjects = [
  {
    icon: Calculator,
    title: "Mathematics",
    description: "Algebra, Calculus, Statistics & More",
    materials: 245,
    rating: 4.8,
    gradient: "from-blue-500 to-cyan-500",
    popular: true
  },
  {
    icon: FlaskConical,
    title: "Science",
    description: "Physics, Chemistry, Biology Comprehensive",
    materials: 189,
    rating: 4.9,
    gradient: "from-green-500 to-emerald-500",
    popular: true
  },
  {
    icon: BookOpen,
    title: "Literature",
    description: "Classic & Contemporary Works Analysis",
    materials: 156,
    rating: 4.7,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Globe,
    title: "Geography",
    description: "Physical, Human & Environmental Geography",
    materials: 98,
    rating: 4.6,
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Palette,
    title: "Arts & Design",
    description: "Visual Arts, Design Theory & History",
    materials: 67,
    rating: 4.8,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Music,
    title: "Music",
    description: "Theory, History & Performance Studies",
    materials: 45,
    rating: 4.7,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Dna,
    title: "Biology",
    description: "Molecular, Cellular & Organismal Biology",
    materials: 134,
    rating: 4.9,
    gradient: "from-green-500 to-teal-500"
  },
  {
    icon: Code,
    title: "Computer Science",
    description: "Programming, Algorithms & Data Structures",
    materials: 178,
    rating: 4.8,
    gradient: "from-blue-500 to-indigo-500",
    popular: true
  },
  {
    icon: Brain,
    title: "Psychology",
    description: "Cognitive, Social & Clinical Psychology",
    materials: 89,
    rating: 4.7,
    gradient: "from-purple-500 to-blue-500"
  },
  {
    icon: History,
    title: "History",
    description: "World History, Civilizations & Events",
    materials: 112,
    rating: 4.6,
    gradient: "from-amber-500 to-orange-500"
  },
  {
    icon: Stethoscope,
    title: "Medicine",
    description: "Anatomy, Physiology & Medical Sciences",
    materials: 203,
    rating: 4.9,
    gradient: "from-red-500 to-pink-500",
    popular: true
  },
  {
    icon: Briefcase,
    title: "Business",
    description: "Management, Economics & Finance",
    materials: 145,
    rating: 4.7,
    gradient: "from-gray-500 to-slate-500"
  }
];

export function SubjectShowcase() {
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
            Explore Every Subject
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-4">
            Comprehensive study materials covering all major academic disciplines
          </p>
          <div className="flex justify-center gap-2">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              12+ Categories
            </span>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              1000+ Materials
            </span>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Expert Curated
            </span>
          </div>
        </motion.div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 relative overflow-hidden">
                {subject.popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <subject.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                    {subject.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                    {subject.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {subject.rating}
                      </span>
                    </div>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {subject.materials} materials
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Explore
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl font-bold mb-4">
                Can&apos;t find your subject?
              </h3>
              <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
                We&apos;re constantly adding new subjects and materials. Request your subject and we&apos;ll prioritize it for our next update!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Request a Subject
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  View All Materials
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
