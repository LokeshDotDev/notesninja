"use client";

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { AnnouncementBar } from '@/components/pdp/AnnouncementBar';
import { MediaGallery } from '@/components/pdp/MediaGallery';
import { ProductInfo } from '@/components/pdp/ProductInfo';
import { ProductHighlights } from '@/components/pdp/ProductHighlights';
import { TrustSignals } from '@/components/pdp/TrustSignals';
import { AccordionSection } from '@/components/pdp/AccordionSection';
import { StudentReviews } from '@/components/pdp/StudentReviews';
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

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // UGC Video Data - Using actual student review videos
  const ugcVideos = [
    {
      id: '1',
      src: '/assets/student reviews videos/NOTESNINJA_INTERVIEW_1_17_FEB_2026.mp4',
      thumbnail: '/assets/student reviews videos/NOTESNINJA_INTERVIEW_1_17_FEB_2026.mp4',
      poster: '/assets/student reviews videos/NOTESNINJA_INTERVIEW_1_17_FEB_2026.mp4',
      title: 'Student Success Story - Interview Experience'
    },
    {
      id: '2',
      src: '/assets/student reviews videos/NOTESNINJA_INTERVIEW_2_17_FEB_2026.mp4',
      thumbnail: '/assets/student reviews videos/NOTESNINJA_INTERVIEW_2_17_FEB_2026.mp4',
      poster: '/assets/student reviews videos/NOTESNINJA_INTERVIEW_2_17_FEB_2026.mp4',
      title: 'Academic Achievement Journey'
    },
    {
      id: '3',
      src: '/assets/student reviews videos/Notes_Ninja_shot_Video01.mp4',
      thumbnail: '/assets/student reviews videos/Notes_Ninja_shot_Video01.mp4',
      poster: '/assets/student reviews videos/Notes_Ninja_shot_Video01.mp4',
      title: 'Study Techniques That Work'
    },
    {
      id: '4',
      src: '/assets/student reviews videos/Notes_ninja_03.mp4',
      thumbnail: '/assets/student reviews videos/Notes_ninja_03.mp4',
      poster: '/assets/student reviews videos/Notes_ninja_03.mp4',
      title: 'Exam Preparation Success'
    },
    {
      id: '5',
      src: '/assets/student reviews videos/Notes_ninja_shoot_video02_1.mp4',
      thumbnail: '/assets/student reviews videos/Notes_ninja_shoot_video02_1.mp4',
      poster: '/assets/student reviews videos/Notes_ninja_shoot_video02_1.mp4',
      title: 'For $35. For everyone. Plus tax.'
    }
  ];

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${id}`);
        
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
      } catch (err) {
        setError("Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handlePurchase = async () => {
    if (!product) return;
    
    setIsPurchasing(true);
    try {
      // Simulate processing time before redirect
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Redirect to checkout page
      window.location.href = `/checkout/${product.id}`;
    } catch (error) {
      console.error("Failed to process purchase:", error);
      setIsPurchasing(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      // Add to cart logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Added to cart:", product.id);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <PremiumPageLoader 
        isLoading={true}
        text="Loading product details..."
        subtext="Preparing your study material"
      />
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              {error || "Product Not Found"}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              The study material you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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

      {/* Product Highlights */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductHighlights />
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustSignals />
        </div>
      </section>

      {/* See It In Action - Student Videos */}
      <SeeInActionSection videos={ugcVideos} />

      {/* Student Reviews */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StudentReviews />
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AccordionSection />
        </div>
      </section>
    </div>
  );
}
