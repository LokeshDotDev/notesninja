"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Download, 
  Users, 
  Award, 
  Clock, 
  Search, 
  Smartphone,
  CheckCircle,
  Brain,
  Target,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Study Notes",
    description: "Expertly crafted notes covering all subjects with detailed explanations and examples.",
    badge: "Popular",
    color: "blue"
  },
  {
    icon: FileText,
    title: "Exam Preparation Guides",
    description: "Structured preparation materials with practice questions and proven study strategies.",
    badge: "Essential",
    color: "green"
  },
  {
    icon: Download,
    title: "Instant Downloads",
    description: "Get immediate access to your purchased materials in multiple formats (PDF, DOC, PPT).",
    badge: null,
    color: "purple"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join thousands of students in our study groups and discussion forums.",
    badge: "New",
    color: "orange"
  },
  {
    icon: Award,
    title: "Expert Verified Content",
    description: "All materials reviewed and approved by qualified educators and subject matter experts.",
    badge: "Quality",
    color: "red"
  },
  {
    icon: Clock,
    title: "24/7 Access",
    description: "Study at your own pace with unlimited access to all purchased content.",
    badge: null,
    color: "indigo"
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Quickly find specific topics and concepts across all your study materials.",
    badge: null,
    color: "yellow"
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Access your study materials on any device - phone, tablet, or computer.",
    badge: null,
    color: "pink"
  },
  {
    icon: Brain,
    title: "Interactive Learning",
    description: "Engage with quizzes, flashcards, and interactive exercises to enhance retention.",
    badge: "Interactive",
    color: "teal"
  }
];

const stats = [
  {
    icon: CheckCircle,
    value: "10,000+",
    label: "Active Students",
    color: "text-green-600"
  },
  {
    icon: BookOpen,
    value: "500+",
    label: "Study Materials",
    color: "text-blue-600"
  },
  {
    icon: Target,
    value: "95%",
    label: "Success Rate",
    color: "text-purple-600"
  },
  {
    icon: TrendingUp,
    value: "4.9/5",
    label: "Average Rating",
    color: "text-orange-600"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and resources you need to achieve academic success. From study notes to exam preparation, we&apos;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900 group-hover:bg-${feature.color}-200 dark:group-hover:bg-${feature.color}-800 transition-colors`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
