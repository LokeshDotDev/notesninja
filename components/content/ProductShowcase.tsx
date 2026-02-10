"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Star, FileText, ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Complete Mathematics Notes",
    category: "Mathematics",
    description: "Comprehensive notes covering algebra, calculus, and statistics with solved examples.",
    price: "$4.99",
    rating: 4.9,
    pages: 245,
    format: "PDF",
    level: "University",
    features: ["245 Pages", "Solved Examples", "Practice Questions", "Formula Sheets"]
  },
  {
    id: 2,
    title: "Physics Study Guide",
    category: "Science",
    description: "Detailed physics concepts with diagrams, formulas, and problem-solving techniques.",
    price: "$5.99",
    rating: 4.8,
    pages: 180,
    format: "PDF",
    level: "College",
    features: ["180 Pages", "Diagrams", "Formulas", "Problem Sets"]
  },
  {
    id: 3,
    title: "Chemistry Lab Manual",
    category: "Science",
    description: "Complete laboratory procedures, safety guidelines, and experiment reports.",
    price: "$3.99",
    rating: 4.7,
    pages: 120,
    format: "PDF",
    level: "High School",
    features: ["120 Pages", "Lab Procedures", "Safety Guide", "Report Templates"]
  },
  {
    id: 4,
    title: "Business Economics Notes",
    category: "Business",
    description: "In-depth analysis of economic principles, market dynamics, and business strategies.",
    price: "$6.99",
    rating: 4.9,
    pages: 320,
    format: "PDF",
    level: "University",
    features: ["320 Pages", "Case Studies", "Analysis", "Charts"]
  },
  {
    id: 5,
    title: "Programming Fundamentals",
    category: "Computer Science",
    description: "Learn programming basics with code examples, exercises, and best practices.",
    price: "$7.99",
    rating: 4.8,
    pages: 280,
    format: "PDF",
    level: "Beginner",
    features: ["280 Pages", "Code Examples", "Exercises", "Best Practices"]
  },
  {
    id: 6,
    title: "English Literature Guide",
    category: "Arts",
    description: "Comprehensive analysis of classic literature with themes and character studies.",
    price: "$4.49",
    rating: 4.6,
    pages: 200,
    format: "PDF",
    level: "College",
    features: ["200 Pages", "Analysis", "Themes", "Character Studies"]
  }
];

export function ProductShowcase() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Study Materials
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose from our curated collection of high-quality study materials. 
            Pay once, download instantly, study forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    {product.rating}
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {product.price}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 space-x-3">
                    <span className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {product.pages} pages
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {product.level}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3 mb-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Buy & Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookOpen className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-gray-300 dark:border-gray-600">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
