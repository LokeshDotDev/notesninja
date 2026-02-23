"use client";

import React, { useEffect, useState } from 'react';
import { AnnouncementBar } from '@/components/pdp/AnnouncementBar';
import { MediaGallery } from '@/components/pdp/MediaGallery';
import { ProductInfo } from '@/components/pdp/ProductInfo';
import { ProductHighlights } from '@/components/pdp/ProductHighlights';
import { AccordionSection } from '@/components/pdp/AccordionSection';
import { RatingsAndReviews } from '@/components/pdp/RatingsAndReviews';
import { TrustScreenshots } from '@/components/pdp/TrustScreenshots';
import SeeInActionSection from '@/components/pdp/SeeInActionSection';
import { PremiumPageLoader } from '@/components/ui/premium-loader';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { trackViewItem } from '@/lib/analytics';

interface PostImage {
  id: string;
  imageUrl: string;
  publicId: string;
  order: number;
  isCover: boolean;
}

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  compareAtPrice?: number;
  isDigital?: boolean;
  categoryId: string;
  subcategoryId?: string;
  productTypeId?: string;
  images?: PostImage[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
  productType?: {
    id: string;
    name: string;
  };
}

const ugcVideos = [
  {
    id: "1",
    src: "/assets/student reviews videos/NOTESNINJA_INTERVIEW_1_17_FEB_2026.mp4",
    thumbnail: "",
    poster: "",
    title: "Student Success Story - Interview Experience",
  },
  {
    id: "2",
    src: "/assets/student reviews videos/NOTESNINJA_INTERVIEW_2_17_FEB_2026.mp4",
    thumbnail: "",
    poster: "",
    title: "Academic Achievement Journey",
  },
  {
    id: "3",
    src: "/assets/student reviews videos/Notes_Ninja_shot_Video01.mp4",
    thumbnail: "",
    poster: "",
    title: "Study Techniques That Work",
  },
  {
    id: "4",
    src: "/assets/student reviews videos/Notes_ninja_03.mp4",
    thumbnail: "",
    poster: "",
    title: "Exam Preparation Success",
  },
  {
    id: "5",
    src: "/assets/student reviews videos/Notes_ninja_shoot_video02_1.mp4",
    thumbnail: "",
    poster: "",
    title: "Real Results from Real Students",
  },
];

export function ProductPageClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      left: 0
    });
  }, [productId]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        
        // Check cache first for instant loading
        const cachedData = sessionStorage.getItem(`product_${productId}`);
        const cacheTimestamp = sessionStorage.getItem(`product_${productId}_timestamp`);
        const now = Date.now();
        
        // Use cache if less than 5 minutes old
        if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 300000) {
          const productData = JSON.parse(cachedData);
          setProduct(productData);
          setLoading(false);
          
          // Track product view from cache
          trackViewItem({
            id: productData.id,
            title: productData.title,
            price: productData.price,
            category: productData.category?.name,
            subcategory: productData.subcategory?.name,
            imageUrl: productData.imageUrl
          });
          return;
        }
        
        const response = await fetch(`/api/posts/${productId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Product not found");
          } else {
            setError("Failed to load product");
          }
          return;
        }

        const productData = await response.json();
        setProduct(productData);
        
        // Track product view when loaded
        trackViewItem({
          id: productData.id,
          title: productData.title,
          price: productData.price,
          category: productData.category?.name,
          subcategory: productData.subcategory?.name,
          imageUrl: productData.imageUrl
        });
        
        // Cache product data for faster subsequent loads
        try {
          sessionStorage.setItem(`product_${productId}`, JSON.stringify(productData));
          sessionStorage.setItem(`product_${productId}_timestamp`, Date.now().toString());
        } catch {
          // SessionStorage might be full, ignore error
        }
      } catch (err) {
        setError("Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const handlePurchase = () => {
    setIsPurchasing(true);
    window.location.href = `/checkout/${productId}`;
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // Add to cart logic here
    setTimeout(() => setIsAddingToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <PremiumPageLoader 
            isLoading={true}
          />
          <p className="mt-6 text-lg font-medium text-neutral-700">
            Loading product details...
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            Preparing your study material
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Product not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/categories">
                Browse Categories
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <AnnouncementBar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Media Gallery (Sticky) */}
          <div className="lg:sticky lg:top-28 self-start">
            <MediaGallery 
              images={product.images}
              mainImage={product.imageUrl}
              title={product.title}
            />
          </div>
          
          {/* Right Side - Product Info (Scrollable) */}
          <div>
            <ProductInfo 
              product={product}
              onPurchase={handlePurchase}
              onAddToCart={handleAddToCart}
              isPurchasing={isPurchasing}
              isAddingToCart={isAddingToCart}
            />
          </div>
        </div>
      </div>
      
      {/* See It In Action - UGC Video Reels */}
      <SeeInActionSection videos={ugcVideos} />

      {/* Product Highlights */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductHighlights />
        </div>
      </section>

      {/* Ratings and Reviews */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RatingsAndReviews />
        </div>
      </section>

      {/* Trust Screenshots - Student Success Stories */}
      <TrustScreenshots />

      {/* FAQ Accordion */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AccordionSection />
        </div>
      </section>
    </div>
  );
}
