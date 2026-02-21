"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Search, FileText } from 'lucide-react';

interface PostImage {
  id: string;
  imageUrl: string;
  publicId: string;
  order: number;
}

interface MediaGalleryProps {
  images?: PostImage[];
  mainImage?: string;
  title: string;
}

export function MediaGallery({ images = [], mainImage, title }: MediaGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const allImages = images && images.length > 0 
    ? images.sort((a, b) => a.order - b.order)
    : mainImage 
      ? [{ id: 'main', imageUrl: mainImage, publicId: '', order: 0 }]
      : [];

  const currentImage = allImages[currentImageIndex] || null;

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex gap-4"
    >
      {/* Vertical Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="flex flex-col gap-2 order-1">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleImageSelect(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-neutral-50 dark:bg-neutral-900 ${
                index === currentImageIndex
                  ? 'border-orange-500 scale-105 shadow-lg'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={`${title} - ${index + 1}`}
                fill
                className="object-cover"
                quality={95}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 order-2">
        <div className="relative bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl group cursor-zoom-in">
          {currentImage ? (
            <div className="relative w-full" style={{ paddingBottom: '100%' }}>
              <Image
                src={currentImage.imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl rounded-full p-2 shadow-lg">
                  <Search className="w-5 h-5 text-neutral-900 dark:text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center">
              <FileText className="w-32 h-32 text-neutral-300 dark:text-neutral-600" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
