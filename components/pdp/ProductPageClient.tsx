"use client";

import React, { useEffect, useState } from 'react';
import { trackViewItem } from '@/lib/analytics';
import { MediaGallery } from '@/components/pdp/MediaGallery';
import { ProductInfo } from '@/components/pdp/ProductInfo';
import { MobileStickyFooter } from '@/components/pdp/MobileStickyFooter';

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
  imageUrl?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  isDigital?: boolean | null;
  categoryId: string;
  subcategoryId?: string | null;
  productTypeId?: string | null;
  images?: PostImage[];
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  subcategory?: {
    id: string;
    name: string;
    slug?: string;
  } | null;
}

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [zoomData, setZoomData] = useState<{ isVisible: boolean; imageUrl: string; position: { x: number; y: number } }>({
    isVisible: false,
    imageUrl: '',
    position: { x: 0, y: 0 }
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth', left: 0 });
  }, [product.id]);

  useEffect(() => {
    trackViewItem({
      id: product.id,
      title: product.title,
      price: product.price ?? undefined,
      category: product.category?.name,
      subcategory: product.subcategory?.name,
      imageUrl: product.imageUrl ?? undefined,
    });
  }, [product]);

  const handlePurchase = () => {
    setIsPurchasing(true);
    window.location.href = `/checkout/${product.id}`;
  };

  const handleZoomChange = (zoomInfo: { isVisible: boolean; imageUrl: string; position: { x: number; y: number } }) => {
    setZoomData(zoomInfo);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="lg:sticky lg:top-28 self-start">
            <MediaGallery
              images={product.images}
              mainImage={product.imageUrl ?? undefined}
              title={product.title}
              onZoomChange={handleZoomChange}
            />
          </div>

          <div className="relative">
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
              onPurchase={handlePurchase}
              isPurchasing={isPurchasing}
            />
          </div>
        </div>
      </div>

      <MobileStickyFooter
        product={product}
        onPurchase={handlePurchase}
        isPurchasing={isPurchasing}
      />
    </div>
  );
}
