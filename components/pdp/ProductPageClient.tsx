"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { trackViewItem } from '@/lib/analytics';

// Dynamic imports for better performance
const AnnouncementBar = dynamic(() => import('@/components/pdp/AnnouncementBar').then(mod => mod.AnnouncementBar), { 
  loading: () => <div className="h-12 bg-blue-600 animate-pulse" />,
  ssr: false 
});
const MediaGallery = dynamic(() => import('@/components/pdp/MediaGallery').then(mod => ({ default: mod.MediaGallery })), { 
  loading: () => <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false 
});
const ProductInfo = dynamic(() => import('@/components/pdp/ProductInfo').then(mod => ({ default: mod.ProductInfo })), { 
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false 
});
const ProductHighlights = dynamic(() => import('@/components/pdp/ProductHighlights').then(mod => ({ default: mod.ProductHighlights })), { 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false 
});
const AccordionSection = dynamic(() => import('@/components/pdp/AccordionSection').then(mod => ({ default: mod.AccordionSection })), { 
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false 
});
const RatingsAndReviews = dynamic(() => import('@/components/pdp/RatingsAndReviews').then(mod => ({ default: mod.RatingsAndReviews })), { 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false 
});
const TrustScreenshots = dynamic(() => import('@/components/pdp/TrustScreenshots').then(mod => ({ default: mod.TrustScreenshots })), { 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false 
});
const SeeInActionSection = dynamic(() => import('@/components/pdp/SeeInActionSection').then(mod => mod.default), { 
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false 
});
const PremiumPageLoader = dynamic(() => import('@/components/ui/premium-loader').then(mod => ({ default: mod.PremiumPageLoader })), { 
  ssr: false 
});

interface PostImage {
  id: string;
  imageUrl: string;
  publicId: string;
  order: number;
  isCover: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    thumbnail: "/assets/reviews-thumbnails/student2.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73e8",
    aspectRatio: "9/16",
    title: "Student Success Story - Interview Experience",
  },
  {
    id: "2",
    thumbnail: "/assets/reviews-thumbnails/student3.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d98dac99517915c0a",
    aspectRatio: "9/16",
    title: "Academic Achievement Journey",
  },
  {
    id: "3",
    thumbnail: "/assets/reviews-thumbnails/student7.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73ea",
    aspectRatio: "9/16",
    title: "Study Techniques That Work",
  },
  {
    id: "4",
    thumbnail: "/assets/reviews-thumbnails/student6.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73e6",
    aspectRatio: "9/16",
    title: "Exam Preparation Success",
  },
  {
    id: "5",
    thumbnail: "/assets/reviews-thumbnails/student1.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6de9610ba04ec142aa",
    aspectRatio: "9/16",
    title: "Real Results from Real Students",
  },
  {
    id: "6",
    thumbnail: "/assets/reviews-thumbnails/student5.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73df",
    aspectRatio: "9/16",
    title: "Student Achievement Showcase",
  },
  {
    id: "7",
    thumbnail: "/assets/reviews-thumbnails/student8.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6de9610ba04ec142b1",
    aspectRatio: "9/16",
    title: "Learning Success Stories",
  },
  {
    id: "8",
    thumbnail: "/assets/reviews-thumbnails/student4.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d98dac99517915c0d",
    aspectRatio: "9/16",
    title: "Academic Excellence Journey",
  },
];

interface ProductPageClientProps {
  productId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProduct?: any; // Server-fetched product data
}

export default function ProductPageClient({ productId, initialProduct }: ProductPageClientProps) {
  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState<string | null>(null);
  const [zoomData, setZoomData] = useState<{ isVisible: boolean; imageUrl: string; position: { x: number; y: number } }>({
    isVisible: false,
    imageUrl: '',
    position: { x: 0, y: 0 }
  });

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      left: 0
    });
  }, [productId]);

  useEffect(() => {
    // Skip fetching if we already have product from server
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
    if (productId) {
      fetchProduct();
    }
  }, [productId, initialProduct]);



  const handleZoomChange = (zoomInfo: { isVisible: boolean; imageUrl: string; position: { x: number; y: number } }) => {
    setZoomData(zoomInfo);
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
              onZoomChange={handleZoomChange}
            />
          </div>
          
          {/* Right Side - Product Info (Scrollable) */}
          <div className="relative">
            {/* Zoom Preview - Overlay that doesn't shift content */}
            {zoomData.isVisible && (
              <div className="absolute top-0 left-0 right-0 z-50 bg-white border-2 border-gray-300 rounded-lg shadow-xl overflow-hidden hidden md:block">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Zoom Preview</span>
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">2x</span>
                </div>
                <div 
                  className="relative w-full h-[28rem] bg-gray-50"
                  style={{
                    backgroundImage: `url(${zoomData.imageUrl})`,
                    backgroundPosition: `${zoomData.position.x}% ${zoomData.position.y}%`,
                    backgroundSize: '200%',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>
            )}
            
            <ProductInfo 
              product={product}
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
      <section className="py-12 pb-24 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AccordionSection />
        </div>
      </section>


    </div>
  );
}
