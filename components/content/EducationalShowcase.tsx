"use client";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Star, Users, Trophy } from "lucide-react";

const educationalCards = [
  {
    category: "Study Materials",
    title: "Comprehensive Notes",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600 dark:text-neutral-400">
          Access expert-curated study materials covering all subjects with detailed explanations and examples.
        </p>
        <div className="flex gap-2">
          <Badge>PDF Downloads</Badge>
          <Badge>Expert Verified</Badge>
          <Badge>Updated Regularly</Badge>
        </div>
        <Button className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download Sample
        </Button>
      </div>
    ),
    src: "/api/placeholder/400/600"
  },
  {
    category: "Exam Preparation",
    title: "Test Success Guides",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600 dark:text-neutral-400">
          Structured preparation materials with practice questions and proven study strategies for academic excellence.
        </p>
        <div className="flex gap-2">
          <Badge>Practice Tests</Badge>
          <Badge>Study Strategies</Badge>
          <Badge>Success Rate 95%</Badge>
        </div>
        <Button className="w-full">
          <BookOpen className="w-4 h-4 mr-2" />
          Start Preparation
        </Button>
      </div>
    ),
    src: "/api/placeholder/400/600"
  },
  {
    category: "Interactive Learning",
    title: "Smart Study Tools",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600 dark:text-neutral-400">
          Engage with quizzes, flashcards, and interactive exercises to enhance retention and make learning enjoyable.
        </p>
        <div className="flex gap-2">
          <Badge>Interactive</Badge>
          <Badge>Gamified Learning</Badge>
          <Badge>Progress Tracking</Badge>
        </div>
        <Button className="w-full">
          <Trophy className="w-4 h-4 mr-2" />
          Try Interactive Tools
        </Button>
      </div>
    ),
    src: "/api/placeholder/400/600"
  },
  {
    category: "Community Support",
    title: "Student Network",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600 dark:text-neutral-400">
          Join thousands of students in our study groups and discussion forums to collaborate and succeed together.
        </p>
        <div className="flex gap-2">
          <Badge>Study Groups</Badge>
          <Badge>Discussion Forums</Badge>
          <Badge>Peer Support</Badge>
        </div>
        <Button className="w-full">
          <Users className="w-4 h-4 mr-2" />
          Join Community
        </Button>
      </div>
    ),
    src: "/api/placeholder/400/600"
  },
  {
    category: "Premium Features",
    title: "Advanced Analytics",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-600 dark:text-neutral-400">
          Track your progress with detailed analytics, identify weak areas, and get personalized recommendations.
        </p>
        <div className="flex gap-2">
          <Badge>Progress Tracking</Badge>
          <Badge>AI Insights</Badge>
          <Badge>Personalized</Badge>
        </div>
        <Button className="w-full">
          <Star className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>
    ),
    src: "/api/placeholder/400/600"
  }
];

export function EducationalShowcase() {
  const cards = educationalCards.map((card, index) => (
    <Card key={index} card={card} index={index} layout={true} />
  ));

  return (
    <section className="py-20 px-4 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Explore Our Educational Resources
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Discover comprehensive study materials, interactive learning tools, and a supportive community designed to help you excel academically.
          </p>
        </div>
        
        <Carousel items={cards} />
      </div>
    </section>
  );
}
