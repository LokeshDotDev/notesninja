"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
  onZoomChange?: (zoomData: { isVisible: boolean; imageUrl: string; position: { x: number; y: number } }) => void;
}

export function MediaGallery({ images = [], mainImage, title, onZoomChange }: MediaGalleryProps) {
  // Debug: Log props
  console.log('MediaGallery props:', { images: images.length, mainImage, title });
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleThumbnails, setVisibleThumbnails] = useState(5);
  const [mainSlideDirection, setMainSlideDirection] = useState<'left' | 'right'>('right');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomHovered, setIsZoomHovered] = useState(false);
  
  
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

  // Debug: Log image data
  useEffect(() => {
    if (currentImage) {
      console.log('Current image:', currentImage);
      console.log('Image URL:', currentImage.imageUrl);
    }
  }, [currentImage]);

  // Auto-scroll effect - cycles every 4 seconds, pauses on hover or zoom
  useEffect(() => {
    if (!isAutoScrolling || isHovered || isZoomHovered || allImages.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setMainSlideDirection('right');
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % allImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isHovered, isZoomHovered, allImages.length]);

  const handleImageSelect = (index: number) => {
    setIsAutoScrolling(false); // Pause auto-scroll on manual navigation
    setCurrentImageIndex(index);
    // Resume auto-scroll after 8 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 2000);
  };

  const handlePrevious = () => {
    setIsAutoScrolling(false);
    setMainSlideDirection('left');
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? allImages.length - 1 : prevIndex - 1);
    setTimeout(() => setIsAutoScrolling(true), 2000);
  };

  const handleNext = () => {
    setIsAutoScrolling(false);
    setMainSlideDirection('right');
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % allImages.length);
    setTimeout(() => setIsAutoScrolling(true), 2000);
  };

  const handleShowMore = () => {
    setVisibleThumbnails(allImages.length);
  };

  const handleShowLess = () => {
    setVisibleThumbnails(5);
  };


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Calculate the correct background position for the zoom preview
    // Since the zoom preview is 2x larger and takes up 50% of the container,
    // we need to adjust the position calculation
    const adjustedX = Math.max(0, Math.min(100, x * 2 - 50));
    const adjustedY = Math.max(0, Math.min(100, y * 2 - 50));
    
    // Call the callback to update parent component
    if (onZoomChange && currentImage) {
      onZoomChange({
        isVisible: true,
        imageUrl: currentImage.imageUrl,
        position: { x: adjustedX, y: adjustedY }
      });
    }
  };

  const handleMouseEnter = () => {
    setIsZoomHovered(true);
  };

  const handleMouseLeave = () => {
    setIsZoomHovered(false);
    // Call the callback to hide zoom in parent component
    if (onZoomChange) {
      onZoomChange({
        isVisible: false,
        imageUrl: '',
        position: { x: 0, y: 0 }
      });
    }
  };

  return (
    <>
      <main role="main" aria-label="Product image gallery">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex gap-4"
      >
      {/* Vertical Thumbnail Gallery - Hidden on mobile */}
      {allImages.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 order-1">
          {allImages.slice(0, visibleThumbnails).map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleImageSelect(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-neutral-50 dark:bg-neutral-900 relative ${
                index === currentImageIndex
                  ? 'border-orange-500 scale-105 shadow-lg'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
              }`}
              aria-label={`View image ${index + 1}: ${title}`}
              aria-current={index === currentImageIndex ? 'true' : 'false'}
              title={`View ${title} - Image ${index + 1}`}
            >
              {/* Optimized Thumbnail with Next.js Image - Immediate Loading Fix */}
              {image.imageUrl?.toLowerCase().includes('.gif') ? (
                <img 
                  src={image.imageUrl}
                  alt={`${title} - ${index + 1}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <Image
                  src={image.imageUrl}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  quality={75}
                  loading="lazy"
                />
              )}
              {image.isCover && (
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                  Cover
                </div>
              )}
            </button>
          ))}
          
          {/* Show More/Less Button */}
          {allImages.length > 5 && (
            <button
              onClick={visibleThumbnails < allImages.length ? handleShowMore : handleShowLess}
              className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {visibleThumbnails < allImages.length ? `+${allImages.length - visibleThumbnails}` : 'Show Less'}
                </div>
                {visibleThumbnails < allImages.length && (
                  <div className="text-xs text-blue-500 dark:text-blue-500 mt-1">More</div>
                )}
              </div>
            </button>
          )}
        </div>
      )}

      {/* Main Image with Zoom */}
      <div className="flex-1 order-2">
        <div 
          className="relative bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {currentImage ? (
            <div className="relative">
              {/* Main Image Container */}
              <div 
                className="relative w-full overflow-hidden cursor-zoom-in" 
                style={{ paddingBottom: '100%' }}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
              <motion.div
                key={currentImageIndex}
                initial={{ 
                  opacity: 0, 
                  x: mainSlideDirection === 'right' ? 50 : -50,
                  scale: 0.98
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1
                }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.25, 0.1, 0.25, 1.0] 
                }}
                className="absolute inset-0"
              >
                              {/* Optimized Main Image with Next.js Image - Immediate Loading Fix */}
              {currentImage.imageUrl?.toLowerCase().includes('.gif') ? (
                <img 
                  src={currentImage.imageUrl}
                  alt={title}
                  className="w-full h-full object-contain"
                  loading="eager"
                  fetchPriority="high"
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Image
                  src={currentImage.imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  quality={85}
                  fetchPriority="high"
                />
              )}
              </motion.div>
              </div>
              
              {/* Navigation Arrows - Show on hover when multiple images */}
              {allImages.length > 1 && (
                <React.Fragment>
                  {/* Left Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg z-20"
                    aria-label="Previous image"
                    title="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </button>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg z-20"
                    aria-label="Next image"
                    title="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </button>
                </React.Fragment>
              )}
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center">
              <FileText className="w-32 h-32 text-neutral-300 dark:text-neutral-600" />
              <div className="absolute bottom-4 text-center">
                <p className="text-sm text-neutral-500">No images available</p>
                <p className="text-xs text-neutral-400">Debug: {allImages.length} images found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
    </main>
    </>
  );
}