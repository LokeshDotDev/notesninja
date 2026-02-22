"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getPricingInfo, formatPrice, formatDiscount } from "@/lib/pricing";
import { 
  BookOpen, 
  Download, 
  ArrowRight, 
  Search, 
  Grid3X3,
  List,
  Clock,
  TrendingUp,
  FileText,
  GraduationCap,
  Notebook,
  PenTool,
  Library,
  Brain,
  Coffee,
  Target,
  Award,
  CheckCircle,
  Filter
} from "lucide-react";
import { PremiumLoader } from "@/components/ui/premium-loader";
import Image from "next/image";
import { trackCategoryView } from "@/lib/analytics";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Function to get appropriate icon based on category name
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('notes') || name.includes('note')) return <FileText className="w-7 h-7" />;
  if (name.includes('mock') || name.includes('paper') || name.includes('exam')) return <FileText className="w-7 h-7" />;
  if (name.includes('assignment') || name.includes('homework')) return <PenTool className="w-7 h-7" />;
  if (name.includes('study') || name.includes('learn')) return <BookOpen className="w-7 h-7" />;
  if (name.includes('university') || name.includes('college')) return <GraduationCap className="w-7 h-7" />;
  if (name.includes('library') || name.includes('resource')) return <Library className="w-7 h-7" />;
  if (name.includes('brain') || name.includes('intelligence')) return <Brain className="w-7 h-7" />;
  if (name.includes('coffee') || name.includes('break')) return <Coffee className="w-7 h-7" />;
  if (name.includes('target') || name.includes('goal')) return <Target className="w-7 h-7" />;
  if (name.includes('award') || name.includes('certificate')) return <Award className="w-7 h-7" />;
  if (name.includes('complete') || name.includes('done')) return <CheckCircle className="w-7 h-7" />;
  
  // Default icon
  return <Notebook className="w-7 h-7" />;
};

// Function to get appropriate icon based on post title
const getPostIcon = (postTitle: string) => {
  const title = postTitle.toLowerCase();
  
  if (title.includes('semester') || title.includes('sem')) return <GraduationCap className="w-7 h-7" />;
  if (title.includes('notes') || title.includes('note')) return <FileText className="w-7 h-7" />;
  if (title.includes('mock') || title.includes('paper') || title.includes('exam')) return <FileText className="w-7 h-7" />;
  if (title.includes('assignment') || title.includes('homework')) return <PenTool className="w-7 h-7" />;
  if (title.includes('study') || title.includes('guide')) return <BookOpen className="w-7 h-7" />;
  if (title.includes('syllabus') || title.includes('curriculum')) return <Library className="w-7 h-7" />;
  if (title.includes('question') || title.includes('qb')) return <FileText className="w-7 h-7" />;
  if (title.includes('practical') || title.includes('lab')) return <Target className="w-7 h-7" />;
  
  // Default icon for materials
  return <Download className="w-7 h-7" />;
};

// Apple-inspired design system
const appleDesign = {
  typography: {
    heroTitle: "text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight",
    sectionTitle: "text-3xl md:text-4xl font-semibold tracking-tight",
    cardTitle: "text-xl md:text-2xl font-semibold tracking-tight",
    body: "text-base leading-relaxed",
    caption: "text-sm leading-relaxed"
  },
  spacing: {
    section: "py-2 md:py-2",
    card: "p-8 md:p-10",
    hero: "pt-16 pb-8 md:pt-20 md:pb-1"
  },
  colors: {
    primary: "rgb(0, 122, 255)",
    secondary: "rgb(142, 142, 147)",
    background: "rgb(248, 248, 248)",
    surface: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    textSecondary: "rgb(99, 99, 102)",
    border: "rgb(229, 229, 234)"
  }
};

interface Post {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  fileUrl?: string;
  file_type?: string;
  coverImage?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  cover?: string;
  cloudinaryUrl?: string;
  secure_url?: string;
  url?: string;
  price?: number | null;
  compareAtPrice?: number | null;
  images?: Array<{
    id: string;
    imageUrl: string;
    publicId: string;
    order: number;
    postId: string;
  }>;
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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; path: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

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

  // Extract unique semesters from posts
  const getUniqueSemesters = (posts: Post[]) => {
    const semesters = new Set<string>();
    posts.forEach(post => {
      const title = post.title.toLowerCase();
      const semesterMatch = title.match(/semester\s*(\d+)|sem\s*(\d+)/);
      if (semesterMatch) {
        const semesterNum = semesterMatch[1] || semesterMatch[2];
        semesters.add(`Semester ${semesterNum}`);
      }
    });
    return Array.from(semesters).sort((a, b) => {
      const numA = parseInt(a.split(' ')[1]);
      const numB = parseInt(b.split(' ')[1]);
      return numA - numB;
    });
  };

  // Filter posts based on search query and semester
  const filterPosts = (posts: Post[], query: string, semester: string) => {
    let filtered = posts;
    
    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        (post.description && post.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    // Filter by semester
    if (semester !== "all") {
      filtered = filtered.filter(post => {
        const title = post.title.toLowerCase();
        const semesterNum = semester.split(' ')[1];
        return title.includes(`semester ${semesterNum}`) || title.includes(`sem ${semesterNum}`);
      });
    }
    
    return filtered;
  };

  // Update filtered posts when posts, search query, or semester changes
  useEffect(() => {
    setFilteredPosts(filterPosts(posts, searchQuery, selectedSemester));
  }, [posts, searchQuery, selectedSemester]);

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
        // Track category view
        trackCategoryView(data.name || categoryName);
        // Build breadcrumbs from actual category path returned from API
        // This ensures we always have the correct full path, even for nested categories
        setBreadcrumbs(buildBreadcrumbs(data.path || categoryName));

        // Fetch posts for this category
        if (data.id) {
          try {
            const postsResponse = await fetch(`/api/posts?category=${data.id}`);
            if (postsResponse.ok) {
              const postsData = await postsResponse.json();
              const postsArray = Array.isArray(postsData) ? postsData : postsData.posts || [];
              setPosts(postsArray);
              setFilteredPosts(postsArray);
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
            <PremiumLoader variant="apple" size="large" />
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
    <div className="min-h-screen bg-[rgb(248, 248, 248)] dark:bg-neutral-900">
      {/* Premium Apple-style Hero Section */}
      <section className="relative overflow-hidden pt-4">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(248, 248, 248)] via-white to-white dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"></div>
        
        {/* Ambient light effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-100/20 via-purple-100/10 to-pink-100/20 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/10 rounded-full blur-3xl"></div>
        
        <div className={`relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 ${appleDesign.spacing.hero}`}>
          <div className="text-center max-w-7xl mx-auto">
            {/* Apple-style breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center justify-center space-x-2 text-sm text-[rgb(99, 99, 102)] dark:text-neutral-500 mb-8 flex-wrap font-medium"
            >
              <Link href="/" className="hover:text-[rgb(0, 122, 255)] transition-colors duration-200">Home</Link>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  <span className="text-[rgb(199, 199, 204)]">/</span>
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-[rgb(0, 122, 255)] font-semibold">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.path} className="hover:text-[rgb(0, 122, 255)] transition-colors duration-200">
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </motion.div>

            {/* Apple-style hero title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`${appleDesign.typography.heroTitle} text-[rgb(28, 28, 30)] dark:text-white mb-6 leading-[1.1]`}
            >
              {category.name}
            </motion.h1>

            {/* Apple-style subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`${appleDesign.typography.body} text-[rgb(99, 99, 102)] dark:text-neutral-400 max-w-2xl mx-auto mb-12 text-xl`}
            >
              Comprehensive study materials and resources for {category.name.toLowerCase()}
            </motion.p>

            
                      </div>
        </div>
      </section>

      {/* Content Section */}
      <section className={`max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 ${appleDesign.spacing.section}`}>
        {/* Materials Section */}
        {posts && posts.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-16"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div>
                  <h2 className={`${appleDesign.typography.sectionTitle} text-[rgb(28, 28, 30)] dark:text-white mb-4`}>
                    Study Materials
                  </h2>
                  <p className={`${appleDesign.typography.body} text-[rgb(99, 99, 102)] dark:text-neutral-400`}>
                    Access {filteredPosts.length} {filteredPosts.length === 1 ? 'material' : 'materials'} in this category
                    {searchQuery && ` matching "${searchQuery}"`}
                    {selectedSemester !== "all" && ` in ${selectedSemester}`}
                  </p>
                </div>
              </div>
              
              {/* Search and Filter Section */}
              <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[rgb(142, 142, 147)] dark:text-neutral-500 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="search your elective"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 rounded-2xl border border-[rgb(229, 229, 234)] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[rgb(28, 28, 30)] dark:text-white placeholder:text-[rgb(142, 142, 147)] dark:placeholder:text-neutral-500 focus:border-[rgb(0, 122, 255)] focus:ring-2 focus:ring-[rgb(0, 122, 255)]/20 transition-all duration-200"
                  />
                </div>
                
                {/* Semester Filter */}
                <div className="relative min-w-[180px]">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[rgb(142, 142, 147)] dark:text-neutral-500 w-5 h-5 pointer-events-none" />
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="pl-12 pr-8 py-3 rounded-2xl border border-[rgb(229, 229, 234)] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[rgb(28, 28, 30)] dark:text-white focus:border-[rgb(0, 122, 255)] focus:ring-2 focus:ring-[rgb(0, 122, 255)]/20 transition-all duration-200 w-full">
                      <SelectValue placeholder="All Semesters" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-[rgb(229, 229, 234)] dark:border-neutral-700 bg-white dark:bg-neutral-800">
                      <SelectItem value="all" className="rounded-xl">All Semesters</SelectItem>
                      {getUniqueSemesters(posts).map((semester) => (
                        <SelectItem key={semester} value={semester} className="rounded-xl">
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Apple-style Materials Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                {filteredPosts.map((post, index) => {
                console.log('Post data:', JSON.stringify(post, null, 2)); // Detailed log with formatting
                console.log('Available image fields:', {
                  cloudinaryUrl: post.cloudinaryUrl,
                  secure_url: post.secure_url,
                  url: post.url,
                  coverImage: post.coverImage,
                  image: post.image,
                  imageUrl: post.imageUrl,
                  thumbnail: post.thumbnail,
                  cover: post.cover
                });
                return (
                <BlurFade key={post.id} delay={0.25 + index * 0.1} inView>
                  {/* <Link href={`/product/${post.id}`}> */}
                  <Link href={`/${categoryName}/${post.slug}`}>
                    <motion.div
                      whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      viewport={{ once: true }}
                      className="group relative overflow-hidden rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-800/80 backdrop-blur-xl h-full"
                    >
                      {/* Image Section */}
                      <div className="relative h-56 overflow-hidden rounded-t-3xl bg-neutral-100 dark:bg-neutral-900">
                        {post.images && post.images.length > 0 && post.images[0].imageUrl ? (
                          <Image
                            src={post.images[0].imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[rgb(0, 122, 255)]/20 to-purple-500/20 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgb(0, 122, 255)] to-[rgb(0, 94, 198)] flex items-center justify-center text-black shadow-lg">
                              {getPostIcon(post.title)}
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-8 space-y-4">
                        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-[rgb(0, 122, 255)] dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        
                        {post.description && (
                          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                            {post.description}
                          </p>
                        )}
                        
                        {/* Price Section - Amazon Style */}
                        {(post.price !== null && post.price !== undefined) && (
                          <div className="flex flex-col gap-3 mb-6">
                            {post.price && (
                              <div className="flex flex-col gap-2">
                                {(() => {
                                  const pricingInfo = getPricingInfo(post.price, post.compareAtPrice);
                                  return pricingInfo.hasDiscount ? (
                                    <div className="flex flex-col items-start">
                                      <span className="bg-red-600 text-white px-3 py-2 rounded text-sm font-bold">
                                        Limited Time Deal
                                      </span>
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-red-600">
                                          {formatDiscount(pricingInfo.discountPercentage!)}
                                        </span>
                                        <span className="text-base font-normal text-black dark:text-white">
                                          {formatPrice(pricingInfo.price)}
                                        </span>
                                      </div>
                                      <span className="text-base text-neutral-500 dark:text-neutral-400">
                                        M.R.P.: <span className="line-through">{formatPrice(pricingInfo.compareAtPrice!)}</span>
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xl font-normal text-black dark:text-white">
                                      {formatPrice(pricingInfo.price)}
                                    </span>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            Instant download
                          </span>
                        </div>
                        
                        <Button 
                          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-700"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </motion.div>
                  </Link>
                </BlurFade>
                );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center py-24"
              >
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-[rgb(248, 248, 248)] dark:bg-neutral-800 flex items-center justify-center border border-[rgb(229, 229, 234)] dark:border-neutral-700">
                  <Search className="w-16 h-16 text-[rgb(142, 142, 147)] dark:text-neutral-500" />
                </div>
                <h3 className={`${appleDesign.typography.sectionTitle} text-[rgb(28, 28, 30)] dark:text-white mb-6`}>
                  No Materials Found
                </h3>
                <p className={`${appleDesign.typography.body} text-[rgb(99, 99, 102)] dark:text-neutral-400 max-w-lg mx-auto mb-8 leading-relaxed`}>
                  {searchQuery && selectedSemester !== "all"
                    ? `No materials found matching "${searchQuery}" in ${selectedSemester}. Try adjusting your search or filter.`
                    : searchQuery
                    ? `No materials found matching "${searchQuery}". Try different keywords.`
                    : selectedSemester !== "all"
                    ? `No materials found in ${selectedSemester}. Try selecting a different semester.`
                    : "No materials available in this category."}
                </p>
                <div className="flex gap-4 justify-center">
                  {searchQuery && (
                    <Button 
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="border-[rgb(229, 229, 234)] dark:border-neutral-700 text-[rgb(28, 28, 30)] dark:text-white hover:bg-[rgb(248, 248, 248)] dark:hover:bg-neutral-800 px-6 py-3 rounded-2xl"
                    >
                      Clear Search
                    </Button>
                  )}
                  {selectedSemester !== "all" && (
                    <Button 
                      onClick={() => setSelectedSemester("all")}
                      variant="outline"
                      className="border-[rgb(229, 229, 234)] dark:border-neutral-700 text-[rgb(28, 28, 30)] dark:text-white hover:bg-[rgb(248, 248, 248)] dark:hover:bg-neutral-800 px-6 py-3 rounded-2xl"
                    >
                      Clear Filter
                    </Button>
                  )}
                  {(searchQuery || selectedSemester !== "all") && (
                    <Button 
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedSemester("all");
                      }}
                      className="bg-[rgb(0, 122, 255)] hover:bg-[rgb(0, 105, 217)] text-white px-6 py-3 rounded-2xl"
                    >
                      Reset All
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
        

        {/* Topics Section */}
        {category.children && category.children.length > 0 ? (
          <>
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12"
            >
              <div>
                <h2 className={`${appleDesign.typography.sectionTitle} text-[rgb(28, 28, 30)] dark:text-white mb-4`}>
                  Explore Topics
                </h2>
                <p className={`${appleDesign.typography.body} text-[rgb(99, 99, 102)] dark:text-neutral-400`}>
                  Choose from {category.children.length} specialized topics
                </p>
              </div>
              
              {/* Apple-style View Toggle */}
              <div className="flex items-center gap-1 mt-6 sm:mt-0 p-1 bg-[rgb(248, 248, 248)] dark:bg-neutral-800 rounded-2xl border border-[rgb(229, 229, 234)] dark:border-neutral-700">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all duration-200 ${viewMode === "grid" ? "bg-white dark:bg-neutral-700 shadow-sm" : "hover:bg-[rgb(0, 122, 255)]/10"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-all duration-200 ${viewMode === "list" ? "bg-white dark:bg-neutral-700 shadow-sm" : "hover:bg-[rgb(0, 122, 255)]/10"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            

            {/* Apple-style Topics Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
              {category.children.map((subcategory, index) => (
                <BlurFade key={subcategory.id} delay={0.25 + index * 0.1} inView>
                  <Link href={`/${encodeURIComponent(subcategory.path || subcategory.slug)}`}>
                    {viewMode === "grid" ? (
                      /* Apple-style Grid View */
                      <motion.div
                        whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="group relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 border border-[rgb(229, 229, 234)] dark:border-neutral-700 h-96 flex flex-col justify-between cursor-pointer hover:border-[rgb(0, 122, 255)]/50 transition-all duration-300 shadow-sm hover:shadow-xl"
                      >
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(0, 122, 255)]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Content */}
                        <div className={`relative z-10 ${appleDesign.spacing.card} flex-1 flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-start justify-between mb-6">
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgb(0, 122, 255)] to-[rgb(0, 94, 198)] flex items-center justify-center text-black font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {getCategoryIcon(subcategory.name)}
                              </div>
                            </div>

                            <h3 className={`${appleDesign.typography.cardTitle} text-[rgb(28, 28, 30)] dark:text-white mb-4 group-hover:text-[rgb(0, 122, 255)] dark:group-hover:text-blue-400 transition-colors duration-300`}>
                              {subcategory.name}
                            </h3>
                            
                            <p className={`${appleDesign.typography.body} text-[rgb(99, 99, 102)] dark:text-neutral-400 mb-6 leading-relaxed`}>
                              Access comprehensive {subcategory.name.toLowerCase()} study materials
                            </p>

                            <div className="flex items-center gap-6 text-[rgb(142, 142, 147)] dark:text-neutral-500">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[rgb(99, 99, 102)] dark:text-neutral-400" />
                                <span className={`${appleDesign.typography.caption}`}>Updated recently</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[rgb(99, 99, 102)] dark:text-neutral-400" />
                                <span className={`${appleDesign.typography.caption}`}>Popular</span>
                              </div>
                            </div>
                          </div>

                          {/* Arrow indicator */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="text-[rgb(142, 142, 147)] dark:text-neutral-500">
                              <span className={`${appleDesign.typography.caption}`}>{subcategory._count.posts} materials</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[rgb(0, 122, 255)] text-black flex items-center justify-center transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* Apple-style List View */
                      <motion.div
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="group bg-white dark:bg-neutral-800 border border-[rgb(229, 229, 234)] dark:border-neutral-700 rounded-2xl p-6 cursor-pointer hover:border-[rgb(0, 122, 255)]/50 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(0, 122, 255)] to-[rgb(0, 94, 198)] flex items-center justify-center text-black font-bold text-xl shadow-md">
                              {getCategoryIcon(subcategory.name)}
                            </div>
                            <div>
                              <h3 className={`${appleDesign.typography.cardTitle} text-[rgb(28, 28, 30)] dark:text-white group-hover:text-[rgb(0, 122, 255)] dark:group-hover:text-blue-400 transition-colors duration-300`}>
                                {subcategory.name}
                              </h3>
                              <p className={`${appleDesign.typography.body} text-[rgb(99, 99, 102)] dark:text-neutral-400 mt-1`}>
                                {subcategory._count.posts} study materials available
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="bg-[rgb(0, 122, 255)]/10 text-[rgb(0, 122, 255)] border-[rgb(0, 122, 255)]/20 dark:bg-[rgb(0, 122, 255)]/20 dark:text-blue-300 font-medium">
                              {subcategory._count.posts}
                            </Badge>
                            <div className="w-10 h-10 rounded-full bg-[rgb(0, 122, 255)]/10 text-[rgb(0, 122, 255)] flex items-center justify-center group-hover:bg-[rgb(0, 122, 255)] group-hover:text-white transition-all duration-300">
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Link>
                </BlurFade>
              ))}
            </div>
          </>
        ) : null}

        {/* Empty State */}
        {!posts || posts.length === 0 ? (
          !category.children || category.children.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center py-24"
            >
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-[rgb(248, 248, 248)] dark:bg-neutral-800 flex items-center justify-center border border-[rgb(229, 229, 234)] dark:border-neutral-700">
                <BookOpen className="w-16 h-16 text-[rgb(142, 142, 147)] dark:text-neutral-500" />
              </div>
              <h3 className={`${appleDesign.typography.sectionTitle} text-[rgb(28, 28, 30)] dark:text-white mb-6`}>
                No Content Available Yet
              </h3>
              <p className={`${appleDesign.typography.body} text-[rgb(99, 99, 102)] dark:text-neutral-400 max-w-lg mx-auto mb-12 leading-relaxed`}>
                We&apos;re working on adding {category.name.toLowerCase()} materials and topics. Check back soon for new study materials!
              </p>
              <Button 
                asChild 
                className="bg-[rgb(0, 122, 255)] hover:bg-[rgb(0, 105, 217)] text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-0"
              >
                <Link href="/">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Explore Other Categories
                </Link>
              </Button>
            </motion.div>
          ) : null
        ) : null}
      </section>
    </div>
  );
}
