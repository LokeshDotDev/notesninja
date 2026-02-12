"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Star, 
  ArrowRight, 
  Filter,
  Grid3X3,
  List,
  FileText,
  Eye,
  Heart,
  AlertCircle
} from "lucide-react";
import { PremiumLoader } from "@/components/ui/premium-loader";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  compareAtPrice?: number;
  isDigital?: boolean;
  width?: number;
  height?: number;
  categoryId: string;
  subcategoryId?: string;
  productTypeId?: string;
  images?: Array<{
    id: string;
    imageUrl: string;
    publicId: string;
    order: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface ProductType {
  id: string;
  name: string;
  _count?: { posts: number; featured: number };
}

interface ProfessionalSubcategoryPageProps {
  categoryName: string;
  subcategoryName: string;
}

export function ProfessionalSubcategoryPage({ categoryName, subcategoryName }: ProfessionalSubcategoryPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price-low" | "price-high" | "name">("newest");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch subcategory info
        const subcategoryResponse = await fetch(
          `/api/subcategories/${encodeURIComponent(subcategoryName)}`
        );
        
        if (!subcategoryResponse.ok) {
          if (subcategoryResponse.status === 404) {
            setError("Subcategory not found");
          } else {
            setError("Failed to load subcategory");
          }
          return;
        }

        const subcategoryData = await subcategoryResponse.json();
        setSubcategory(subcategoryData);

        // Fetch posts for this subcategory
        const postsResponse = await fetch(
          `/api/posts?subcategory=${subcategoryData.id}`
        );
        
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setAllPosts(postsData);
          setPosts(postsData);
        } else {
          setAllPosts([]);
          setPosts([]);
        }

        // Fetch product types
        const productTypesResponse = await fetch('/api/product-types');
        if (productTypesResponse.ok) {
          const productTypesData = await productTypesResponse.json();
          setProductTypes(productTypesData);
        }
      } catch (err) {
        setError("Failed to load content");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryName, subcategoryName]);

  // Filter posts based on selected product type
  useEffect(() => {
    if (selectedProductType) {
      const filtered = allPosts.filter(post => post.productTypeId === selectedProductType);
      setPosts(filtered);
    } else {
      setPosts(allPosts);
    }
  }, [selectedProductType, allPosts]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
        case "oldest":
          return new Date(a.updatedAt || a.createdAt || 0).getTime() - new Date(b.updatedAt || b.createdAt || 0).getTime();
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [posts, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        {/* Professional Loading State */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <PremiumLoader variant="apple" size="large" />
            <p className="mt-6 text-lg font-medium text-neutral-700 dark:text-neutral-300">
              Loading {subcategoryName} materials...
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Preparing your study resources
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subcategory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              {error || "Subcategory Not Found"}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              The topic you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href={`/${encodeURIComponent(categoryName)}`}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Back to {categoryName}
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
              className="flex items-center justify-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6"
            >
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/${encodeURIComponent(categoryName)}`} className="hover:text-blue-600 transition-colors">
                {categoryName}
              </Link>
              <span>/</span>
              <span className="text-blue-600 font-medium">{subcategory.name}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6"
            >
              {subcategory.name}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8"
            >
              Comprehensive {subcategory.name.toLowerCase()} study materials and resources for academic excellence
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-8"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {posts.length} Materials
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-neutral-900 dark:text-white">
                  Instant Download
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
                Filter Results
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Results Count */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                Study Materials
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Showing {posts.length} of {allPosts.length} materials
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Product Type Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-neutral-500" />
                <select
                  value={selectedProductType || ""}
                  onChange={(e) => setSelectedProductType(e.target.value || null)}
                  className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-neutral-500 rotate-90" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "price-low" | "price-high" | "name")}
                  className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 border border-neutral-300 dark:border-neutral-600 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Products Grid/List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedPosts.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {sortedPosts.map((post, index) => (
              <BlurFade key={post.id} delay={0.25 + index * 0.05} inView>
                {viewMode === "grid" ? (
                  /* Grid View Card */
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                        
                        {post.price && (
                          <div className="flex flex-col gap-2">
                            {post.compareAtPrice && post.compareAtPrice > post.price && (
                              <div className="flex flex-col items-start">
                                <span className="bg-red-600 text-white px-3 py-2 rounded text-sm font-bold">
                                  Limited Time Deal
                                </span>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-lg font-bold text-red-600">
                                    -{Math.round(((post.compareAtPrice - post.price) / post.compareAtPrice) * 100)}%
                                  </span>
                                  <span className="text-base font-normal text-black dark:text-white">
                                    ₹{post.price.toFixed(2)}
                                  </span>
                                </div>
                                <span className="text-base text-neutral-500 dark:text-neutral-400">
                                  M.R.P.: <span className="line-through">₹{post.compareAtPrice.toFixed(2)}</span>
                                </span>
                              </div>
                            )}
                            {!post.compareAtPrice && (
                              <span className="text-xl font-normal text-black dark:text-white">
                                ₹{post.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">
                        {post.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          <Link href={`/product/${post.id}`}>
                            <Download className="w-4 h-4 mr-1" />
                            View Details
                          </Link>
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="p-2" asChild>
                            <Link href={`/product/${post.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* List View Card */
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {post.imageUrl ? (
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                          
                          {post.price && (
                            <div className="flex items-center gap-1">
                              {post.compareAtPrice && post.compareAtPrice > post.price && (
                                <span className="text-sm text-neutral-500 line-through">
                                  ₹{post.compareAtPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="font-bold text-green-600 dark:text-green-400">
                                ₹{post.price.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                          {post.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                              <Link href={`/product/${post.id}`}>
                                <Download className="w-4 h-4 mr-1" />
                                View Details
                              </Link>
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="p-2" asChild>
                              <Link href={`/product/${post.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="p-2">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </BlurFade>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <FileText className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              No Materials Available Yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
              We&apos;re working on adding {subcategory.name.toLowerCase()} materials. Check back soon for new study resources!
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href={`/${encodeURIComponent(categoryName)}`}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Explore Other Topics
              </Link>
            </Button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
