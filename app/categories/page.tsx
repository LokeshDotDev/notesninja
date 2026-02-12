"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PremiumLoader } from "@/components/ui/premium-loader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  level: number;
  path: string;
  parentId: string | null;
  children: Category[];
  _count?: {
    posts: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Fallback categories
        setCategories([
          { id: "1", name: "Mathematics", slug: "mathematics", level: 0, path: "mathematics", parentId: null, children: [] },
          { id: "2", name: "Science", slug: "science", level: 0, path: "science", parentId: null, children: [] },
          { id: "3", name: "Computer Science", slug: "computer-science", level: 0, path: "computer-science", parentId: null, children: [] },
          { id: "4", name: "Medicine", slug: "medicine", level: 0, path: "medicine", parentId: null, children: [] },
          { id: "5", name: "Business", slug: "business", level: 0, path: "business", parentId: null, children: [] },
          { id: "6", name: "Literature", slug: "literature", level: 0, path: "literature", parentId: null, children: [] },
          { id: "7", name: "Engineering", slug: "engineering", level: 0, path: "engineering", parentId: null, children: [] },
          { id: "8", name: "Arts & Design", slug: "arts-design", level: 0, path: "arts-design", parentId: null, children: [] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderNestedCategories = (categories: Category[], depth = 0) => {
    return categories.map((category) => (
      <div key={category.id} className={`${depth > 0 ? 'ml-6' : ''}`}>
        <Link href={`/${category.path || category.slug}`}>
          <Card className="hover:shadow-lg transition-shadow duration-300 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    {category._count && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category._count.posts} study materials
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              {category.children && category.children.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {category.children.slice(0, 3).map((child) => (
                      <Badge key={child.id} variant="secondary" className="text-xs">
                        {child.name}
                      </Badge>
                    ))}
                    {category.children.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.children.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
        
        {category.children && category.children.length > 0 && (
          <div className="mt-2">
            {renderNestedCategories(category.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Study Categories
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our comprehensive collection of study materials organized by subject and discipline.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <PremiumLoader variant="apple" size="large" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-6">
            {renderNestedCategories(categories)}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No categories available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new study materials and categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
