"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface PostImage {
  id: string;
  imageUrl: string;
  publicId: string;
  order: number;
  isCover: boolean;
}

interface MediaGalleryProps {
  images?: PostImage[];
  mainImage?: string;
  title: string;
}

export function MediaGallery({ images = [], mainImage, title }: MediaGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Find cover image or use first image as fallback
  const coverImage = images.find(img => img.isCover);
  
  const allImages = useMemo(() => {
    return images && images.length > 0 
      ? images.sort((a, b) => a.order - b.order)
      : mainImage 
        ? [{ id: 'main', imageUrl: mainImage, publicId: '', order: 0, isCover: false }]
        : [];
  }, [images, mainImage]);

  // Set initial image to cover image if available
  React.useEffect(() => {
    if (coverImage) {
      const coverIndex = allImages.findIndex(img => img.id === coverImage.id);
      if (coverIndex !== -1) {
        setCurrentImageIndex(coverIndex);
      }
    }
  }, [coverImage, allImages]);

  const currentImage = allImages[currentImageIndex] || null;

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevious = () => {
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? allImages.length - 1 : prevIndex - 1);
  };

  const handleNext = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % allImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex gap-4"
    >
      {/* Vertical Thumbnail Gallery - Hidden on mobile */}
      {allImages.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 order-1">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleImageSelect(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-neutral-50 dark:bg-neutral-900 relative ${
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
              {image.isCover && (
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                  Cover
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 order-2">
        <div className="relative bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl group">
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
              
              {/* Navigation Arrows - Show on hover when multiple images */}
              {allImages.length > 1 && (
                <React.Fragment>
                  {/* Left Arrow */}
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </button>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </button>
                </React.Fragment>
              )}
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