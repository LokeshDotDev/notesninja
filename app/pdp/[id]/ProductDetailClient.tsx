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
import { Suspense } from 'react';

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
  params?: Promise<{
    id: string;
  }>;
  initialProduct?: Product | null;
}

export default function ProductDetailPage({ params, initialProduct }: ProductPageProps) {
  const { id } = params ? use(params) : { id: '' };
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState<string | null>(null);

  // UGC Video Data - Using actual student review videos
  const ugcVideos = [
    {
      id: '1',
      thumbnail: '/assets/reviews-thumbnails/Screenshot 2026-03-01 at 4.35.06 PM.png',
      embedSrc: 'https://play.gumlet.io/embed/69a41a6d825d3351d56a73e8',
      aspectRatio: '9/16',
      title: 'Student Success Story - Interview Experience'
    },
    {
      id: '2',
      thumbnail: '/assets/reviews-thumbnails/Screenshot 2026-03-01 at 4.36.12 PM.png',
      embedSrc: 'https://play.gumlet.io/embed/69a41a6d98dac99517915c0a',
      aspectRatio: '9/16',
      title: 'Academic Achievement Journey'
    },
    {
      id: '3',
      thumbnail: '/assets/reviews-thumbnails/Screenshot 2026-03-01 at 4.36.59 PM.png',
      embedSrc: 'https://play.gumlet.io/embed/69a41a6d825d3351d56a73ea',
      aspectRatio: '9/16',
      title: 'Study Techniques That Work'
    },
    {
      id: '4',
      thumbnail: '/assets/reviews-thumbnails/Screenshot 2026-03-01 at 4.37.46 PM.png',
      embedSrc: 'https://play.gumlet.io/embed/69a41a6d825d3351d56a73e6',
      aspectRatio: '9/16',
      title: 'Exam Preparation Success'
    },
    {
      id: '5',
      thumbnail: '/assets/reviews-thumbnails/Screenshot 2026-03-01 at 4.42.32 PM.png',
      embedSrc: 'https://play.gumlet.io/embed/69a41a6de9610ba04ec142aa',
      aspectRatio: '9/16',
      title: 'Real Results from Real Students'
    },
    {
      id: '6',
      thumbnail: '/assets/reviews-thumbnails/Screenshot 2026-03-01 at 4.43.00 PM.png',
      embedSrc: 'https://play.gumlet.io/embed/69a41a6d825d3351d56a73df',
      aspectRatio: '9/16',
      title: 'Student Achievement Showcase'
    },
    {
      id: '7',
      thumbnail: '/assets/reviews-thumbnails/Screenshot 2026-03-01 at 4.44.18 PM.png',
      embedSrc: 'https://play.gumlet.io/embed/69a41a6de9610ba04ec142b1',
      aspectRatio: '9/16',
      title: 'Learning Success Stories'
    },
    {
      id: '8',
      thumbnail: '/assets/reviews-thumbnails/Screenshot 2026-03-01 at 4.44.51 PM.png',
      embedSrc: 'https://play.gumlet.io/embed/69a41a6d98dac99517915c0d',
      aspectRatio: '9/16',
      title: 'Academic Excellence Journey'
    },
  ];

  useEffect(() => {
    // Skip fetching if we already have the product from server
    if (initialProduct) {
      setProduct(initialProduct);
      // Track product view when loaded
      trackViewItem({
        id: initialProduct.id,
        title: initialProduct.title,
        price: initialProduct.price,
        category: initialProduct.category?.name,
        subcategory: initialProduct.subcategory?.name,
        imageUrl: initialProduct.imageUrl
      });
      return;
    }

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

    if (id) {
      fetchProduct();
    }
  }, [id, initialProduct]);




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
            />
          </div>
        </div>
      </div>

      {/* Product Highlights - Suspense for streaming */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-32 animate-pulse bg-gray-200 rounded-lg" />}>
            <ProductHighlights />
          </Suspense>
        </div>
      </section>

      {/* Trust Signals - Suspense for streaming */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-24 animate-pulse bg-gray-200 rounded-lg" />}>
            <TrustSignals />
          </Suspense>
        </div>
      </section>

      {/* See It In Action - Student Videos - Suspense for streaming */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 rounded-lg" />}>
        <SeeInActionSection videos={ugcVideos} />
      </Suspense>

      {/* Student Reviews - Suspense for streaming */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-48 animate-pulse bg-gray-200 rounded-lg" />}>
            <StudentReviews />
          </Suspense>
        </div>
      </section>

      {/* FAQ Accordion - Suspense for streaming */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-32 animate-pulse bg-gray-200 rounded-lg" />}>
            <AccordionSection />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
