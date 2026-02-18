"use client";
import { ProfessionalProductDetail } from "@/components/ui/ProfessionalProductDetail";
import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // The last segment should be the product ID
  const productId = slug[slug.length - 1];
  
  useEffect(() => {
    async function checkAndRedirect() {
      try {
        // Fetch product to get correct category path
        const response = await fetch(`/api/posts/${productId}`);
        
        if (!response.ok) {
          setIsLoading(false);
          return;
        }
        
        const product = await response.json();
        
        if (product.category?.path) {
          const expectedPath = product.category.path.split('/').filter(Boolean);
          const currentPath = slug.slice(0, -1); // All segments except product ID
          
          // Check if current URL matches expected path
          const isCorrectPath = expectedPath.length === currentPath.length && 
            expectedPath.every((segment: string, index: number) => segment === currentPath[index]);
          
          if (!isCorrectPath) {
            // Redirect to correct SEO-friendly URL
            const correctUrl = `/${product.category.path}/${productId}`;
            router.replace(correctUrl);
            return;
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking URL:", error);
        setIsLoading(false);
      }
    }
    
    if (productId) {
      checkAndRedirect();
    } else {
      setIsLoading(false);
    }
  }, [productId, slug, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neutral-900"></div>
      </div>
    );
  }
  
  return <ProfessionalProductDetail productId={productId} />;
}
