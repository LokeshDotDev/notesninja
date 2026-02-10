"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  BookOpen, 
  Download, 
  Star, 
  ArrowRight, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Clock,
  TrendingUp
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  file_type?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
  level: number;
  parentId: string | null;
  children: Category[];
  posts?: Post[];
  _count: {
    posts: number;
  };
}

interface ProfessionalCategoryPageProps {
  categoryName: string; // This can now be a full path like "computer-science/notes/bca"
}

export function ProfessionalCategoryPage({ categoryName }: ProfessionalCategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; path: string }[]>([]);

  // Helper function to build breadcrumb trail from category path
  const buildBreadcrumbs = (categoryPath: string) => {
    // Decode the category path first
    const decodedPath = decodeURIComponent(categoryPath);
    const parts = decodedPath.split('/').filter(Boolean);
    const breadcrumbTrail: { name: string; path: string }[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      const path = parts.slice(0, i + 1).join('/');
      breadcrumbTrail.push({
        name: parts[i]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        path: `/${path}`,
      });
    }
    
    return breadcrumbTrail;
  };

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);
        
        // Try to find category by path (for nested categories) or by slug/name (for backwards compatibility)
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
        // Build breadcrumbs from the actual category path returned from API
        // This ensures we always have the correct full path, even for nested categories
        setBreadcrumbs(buildBreadcrumbs(data.path || categoryName));

        // Fetch posts for this category
        if (data.id) {
          try {
            const postsResponse = await fetch(`/api/posts?category=${data.id}`);
            if (postsResponse.ok) {
              const postsData = await postsResponse.json();
              setPosts(Array.isArray(postsData) ? postsData : postsData.posts || []);
            }
          } catch (err) {
            console.error("Error fetching posts:", err);
            setPosts([]);
          }
        }
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        {/* Professional Loading State */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-lg font-medium text-neutral-700 dark:text-neutral-300">
              Loading {categoryName} materials...
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Preparing your study resources
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Search className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              {error || "Category Not Found"}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              The category you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/">
                <ArrowRight className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      {/* Professional Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-neutral-900 dark:to-purple-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6 flex-wrap"
            >
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  <span>/</span>
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-blue-600 font-medium">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.path} className="hover:text-blue-600 transition-colors">
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6"
            >
              {category.name}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8"
            >
              Comprehensive study materials and resources for {category.name.toLowerCase()}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-8"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {category._count.posts} Materials
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {category.children?.length || 0} Topics
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-neutral-900 dark:text-white">
                  Expert Verified
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Download className="w-5 h-5 mr-2" />
                Browse All Materials
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-neutral-300 dark:border-neutral-600 px-8 py-3 rounded-full font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300">
                <Filter className="w-5 h-5 mr-2" />
                Filter Topics
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Materials Section */}
        {posts && posts.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Study Materials
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Access {posts.length} {posts.length === 1 ? 'material' : 'materials'} in this category
              </p>
            </motion.div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {posts.map((post, index) => (
                <BlurFade key={post.id} delay={0.25 + index * 0.1} inView>
                  <Link href={`/product/${post.id}`}>
                    <motion.div
                      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 h-64 flex flex-col justify-between p-6 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Download className="w-6 h-6" />
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300">
                            {post.file_type || 'PDF'}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        {post.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                            {post.description}
                          </p>
                        )}
                      </div>

                      {/* Download Icon */}
                      <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300 shadow-lg">
                        <Download className="w-5 h-5" />
                      </div>
                    </motion.div>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </>
        )}

        {/* Topics Section */}
        {category.children && category.children.length > 0 ? (
          <>
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                  Explore Topics
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Choose from {category.children.length} specialized topics
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Topics Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {category.children.map((subcategory, index) => (
                <BlurFade key={subcategory.id} delay={0.25 + index * 0.1} inView>
                  <Link href={`/${encodeURIComponent(subcategory.path || subcategory.slug)}`}>
                    {viewMode === "grid" ? (
                      /* Grid View */
                      <motion.div
                        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="group relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 h-64 flex flex-col justify-between p-6 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                      >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                              {subcategory.name.charAt(0).toUpperCase()}
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
                              {subcategory._count.posts} items
                            </Badge>
                          </div>

                          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {subcategory.name}
                          </h3>
                          
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            Access comprehensive {subcategory.name.toLowerCase()} study materials
                          </p>

                          <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Updated recently</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>Popular</span>
                            </div>
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300 shadow-lg">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </motion.div>
                    ) : (
                      /* List View */
                      <motion.div
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="group bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                              {subcategory.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {subcategory.name}
                              </h3>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {subcategory._count.posts} study materials available
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
                              {subcategory._count.posts}
                            </Badge>
                            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Link>
                </BlurFade>
              ))}
            </div>
          </>
        ) : (
          /* Empty State - No Topics */
          !posts || posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                No Content Available Yet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
                We&apos;re working on adding {category.name.toLowerCase()} materials and topics. Check back soon for new study materials!
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Explore Other Categories
                </Link>
              </Button>
            </motion.div>
          ) : null
        )}
      </section>
    </div>
  );
}
