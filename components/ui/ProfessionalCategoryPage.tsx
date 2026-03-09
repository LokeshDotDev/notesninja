import React from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryClientView } from "./CategoryClientView";
import prisma from "@/lib/prisma";
import { calculateDiscountPercentage } from "@/lib/pricing-utils";
import { trackCategoryView, trackError } from "@/lib/analytics";

// We have defined these interfaces in CategoryClientView as well, sharing them
export interface Post {
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
  createdAt?: string | Date;
  images?: Array<{
    id: string;
    imageUrl: string;
    publicId: string;
    order: number;
    postId: string;
    isCover?: boolean;
  }>;
}

export interface Category {
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

// Helper function to build breadcrumb trail from category path
const buildBreadcrumbs = (categoryPath: string) => {
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

// Main Server Component
export async function ProfessionalCategoryPage({ categoryName }: ProfessionalCategoryPageProps) {
  let category: Category | null = null;
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const decodedName = decodeURIComponent(categoryName);

    // First try finding category by path
    let dbCategory = await prisma.category.findFirst({
      where: { path: decodedName },
      include: {
        parent: { select: { id: true, name: true } },
        children: {
          include: {
            parent: { select: { id: true, name: true } },
            _count: { select: { posts: true } },
            children: {
              include: {
                _count: { select: { posts: true } },
                children: true,
              },
            },
          },
          orderBy: { name: "asc" },
        },
        _count: { select: { posts: true } },
      },
    });

    // If not found by path, try by id or slug
    if (!dbCategory) {
      dbCategory = await prisma.category.findFirst({
        where: { OR: [{ id: decodedName }, { slug: decodedName }] },
        include: {
          parent: { select: { id: true, name: true } },
          children: {
            include: {
              parent: { select: { id: true, name: true } },
              _count: { select: { posts: true } },
              children: {
                include: {
                  _count: { select: { posts: true } },
                  children: true,
                },
              },
            },
            orderBy: { name: "asc" },
          },
          _count: { select: { posts: true } },
        },
      });
    }

    if (!dbCategory) {
      error = "Category not found";
      try { trackError("Category not found", "category_view"); } catch (e) { } // ignore server track error
    } else {
      category = dbCategory as unknown as Category; // Safely cast matching fields
      try { trackCategoryView(dbCategory.name); } catch (e) { }

      // Fetch posts for this category
      const dbPosts = await prisma.post.findMany({
        where: { categoryId: dbCategory.id },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          imageUrl: true,
          publicId: true,
          price: true,
          compareAtPrice: true,
          isDigital: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          subcategoryId: true,
          productTypeId: true,
          images: {
            select: {
              id: true,
              imageUrl: true,
              publicId: true,
              order: true,
              isCover: true,
            },
            orderBy: { order: "asc" },
          },
          digitalFiles: {
            select: {
              id: true,
              fileName: true,
              fileUrl: true,
              publicId: true,
              fileSize: true,
              fileType: true,
              postId: true,
              createdAt: true,
            }
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Calculate discount percentage
      posts = dbPosts.map(post => {
        const discountPercentage = calculateDiscountPercentage(post.price, post.compareAtPrice);

        return {
          ...post,
          id: post.id,
          title: post.title,
          discountPercentage,
          price: post.price ? Number(post.price) : null,
          compareAtPrice: post.compareAtPrice ? Number(post.compareAtPrice) : null,
          description: post.description || undefined,
          slug: post.slug || undefined,
          imageUrl: post.imageUrl || undefined,
          images: post.images ? post.images.map(img => ({
            ...img,
            postId: post.id
          })) : undefined,
        } as Post;
      });
    }
  } catch (err) {
    console.error("Error fetching category:", err);
    error = "Failed to load category";
    try { trackError("Failed to load category", "category_view"); } catch (e) { }
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

  const breadcrumbs = buildBreadcrumbs(category.path || categoryName);

  return (
    <CategoryClientView
      category={category}
      posts={posts}
      categoryName={categoryName}
      breadcrumbs={breadcrumbs}
    />
  );
}
