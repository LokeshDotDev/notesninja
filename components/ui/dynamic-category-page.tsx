import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/ui/page-hero";
import { BlurFade } from "@/components/magicui/blur-fade";
import Link from "next/link";

interface Subcategory {
  id: string;
  name: string;
  _count: {
    posts: number;
  };
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  _count: {
    posts: number;
  };
}

interface DynamicCategoryPageProps {
  categoryName: string;
}

export function DynamicCategoryPage({ categoryName }: DynamicCategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        const response = await fetch(`/api/categories/${encodeURIComponent(categoryName)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Category not found");
          } else {
            setError("Failed to load category");
          }
          return;
        }

        const data = await response.json();
        setCategory(data);
      } catch (err) {
        setError("Failed to load category");
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-300">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            {error || "Category not found"}
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center">
      <PageHero
        title={category.name}
        headline={`${category.name} Resources`}
        description={`Explore our comprehensive collection of ${category.name.toLowerCase()} materials organized by topics.`}
      />

      <div className="w-full max-w-6xl mt-12 mb-24 px-4">
        {category.subcategories.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                Choose Your Topic
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300">
                Select from {category.subcategories.length} available topics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.subcategories.map((subcategory, index) => (
                <BlurFade key={subcategory.id} delay={0.25 + index * 0.1} inView>
                  <Link href={`/${encodeURIComponent(categoryName)}/${encodeURIComponent(subcategory.name)}`}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 h-48 flex flex-col justify-between p-6 cursor-pointer"
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {subcategory.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                              {subcategory._count.posts} items
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {subcategory.name}
                        </h3>
                        
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                          Explore {subcategory.name.toLowerCase()} materials and resources
                        </p>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Arrow Icon */}
                      <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.div>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              No Topics Available
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              This category doesn't have any subcategories yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
