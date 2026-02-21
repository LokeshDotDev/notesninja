import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryGridCombined } from "@/components/ui/gallery-grid";
import ProductTypeFilter from "@/components/custom/ProductTypeFilter";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
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
    isCover: boolean;
  }>;
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

interface DynamicSubcategoryPageProps {
  categoryName: string;
  subcategoryName: string;
}

export function DynamicSubcategoryPage({ categoryName, subcategoryName }: DynamicSubcategoryPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]); // Store all posts for filtering
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          console.log("Fetched posts:", postsData.length, postsData.map((p: Post) => ({ id: p.id, title: p.title, productTypeId: p.productTypeId })));
          setAllPosts(postsData); // Store all posts
          setPosts(postsData); // Initially show all posts
        } else {
          console.log("Failed to fetch posts:", postsResponse.status);
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
    console.log("Filtering posts:", {
      selectedProductType,
      allPostsCount: allPosts.length,
      allPosts: allPosts.map(p => ({ id: p.id, title: p.title, productTypeId: p.productTypeId }))
    });
    
    if (selectedProductType) {
      const filtered = allPosts.filter(post => post.productTypeId === selectedProductType);
      console.log("Filtered posts:", filtered.length, filtered.map(p => ({ id: p.id, title: p.title, productTypeId: p.productTypeId })));
      setPosts(filtered);
    } else {
      console.log("Showing all posts:", allPosts.length);
      setPosts(allPosts);
    }
  }, [selectedProductType, allPosts]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-300">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !subcategory) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            {error || "Subcategory not found"}
          </h1>
          <a href={`/${encodeURIComponent(categoryName)}`} className="text-blue-600 hover:text-blue-800 underline">
            Back to {categoryName}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center">
      <PageHero
        title={`${subcategory.name}`}
        headline={`${subcategory.name} Resources`}
        description={`Discover comprehensive ${subcategory.name.toLowerCase()} materials including mock papers, assignments, and study resources.`}
      />

      {/* Breadcrumb */}
      <div className="w-full max-w-6xl px-4 mt-8">
        <nav className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <span className="text-neutral-400">/</span>
          <a 
            href={`/${encodeURIComponent(categoryName)}`} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {categoryName}
          </a>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-900 dark:text-white font-medium">
            {subcategory.name}
          </span>
        </nav>
      </div>

      {/* Content Stats */}
      <div className="w-full max-w-6xl px-4 mt-8">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Available Resources
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                {posts.length} {posts.length === 1 ? 'item' : 'items'} available
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Product Type Filter */}
              <ProductTypeFilter
                productTypes={productTypes}
                selectedProductType={selectedProductType}
                onProductTypeChange={setSelectedProductType}
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {posts.length}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-300">
                  Total Items
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="w-full max-w-6xl mt-12 mb-24 px-4">
        {posts.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Debug: Showing {posts.length} posts
            </div>
            <GalleryGridCombined items={posts} />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              No Resources Available
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              There are currently no resources available in this topic. Check back later!
            </p>
            <div className="mb-4 text-sm text-gray-500">
              Debug: allPosts={allPosts.length}, selectedProductType={selectedProductType}
            </div>
            <a 
              href={`/${encodeURIComponent(categoryName)}`} 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {categoryName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
