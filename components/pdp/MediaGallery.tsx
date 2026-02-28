"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';

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
  const [visibleThumbnails, setVisibleThumbnails] = useState(5);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [mainSlideDirection, setMainSlideDirection] = useState<'left' | 'right'>('right');
  
  // Prevent body scroll and hide navbar when full screen is open
  React.useEffect(() => {
    if (isFullScreen) {
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      
      // Hide navbar
      const navbar = document.querySelector('header, nav, [role="navigation"]') as HTMLElement;
      if (navbar) {
        navbar.style.display = 'none';
      }
    } else {
      // Restore body scrolling
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      
      // Show navbar
      const navbar = document.querySelector('header, nav, [role="navigation"]') as HTMLElement;
      if (navbar) {
        navbar.style.display = '';
      }
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      const navbar = document.querySelector('header, nav, [role="navigation"]') as HTMLElement;
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, [isFullScreen]);
  
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
    setMainSlideDirection('left');
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? allImages.length - 1 : prevIndex - 1);
  };

  const handleNext = () => {
    setMainSlideDirection('right');
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % allImages.length);
  };

  const handleShowMore = () => {
    setVisibleThumbnails(allImages.length);
  };

  const handleShowLess = () => {
    setVisibleThumbnails(5);
  };

  const handleImageClick = () => {
    setIsFullScreen(true);
  };

  const handleFullScreenClose = () => {
    setIsFullScreen(false);
  };

  const handleFullScreenPrevious = () => {
    setSlideDirection('left');
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? allImages.length - 1 : prevIndex - 1);
  };

  const handleFullScreenNext = () => {
    setSlideDirection('right');
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % allImages.length);
  };

  return (
    <>
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

      {/* Main Image */}
      <div className="flex-1 order-2">
        <div className="relative bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl group">
          {currentImage ? (
            <div 
              className="relative w-full cursor-pointer overflow-hidden" 
              style={{ paddingBottom: '100%' }}
              onClick={handleImageClick}
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
                <Image
                  src={currentImage.imageUrl}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  quality={100}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
              
              {/* Navigation Arrows - Show on hover when multiple images */}
              {allImages.length > 1 && (
                <React.Fragment>
                  {/* Left Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </button>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
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

    {/* Full Screen Modal */}
    <AnimatePresence>
      {isFullScreen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-white overflow-hidden"
          onClick={handleFullScreenClose}
        >
          {/* Close Button */}
          <button
            onClick={handleFullScreenClose}
            className="absolute top-6 right-6 z-[100000] bg-black/70 hover:bg-black text-white rounded-full p-3 transition-all duration-200 shadow-lg"
            aria-label="Close full screen"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullScreenPrevious();
                }}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black text-white rounded-full p-3 transition-all duration-200 shadow-lg z-[100000]"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullScreenNext();
                }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black text-white rounded-full p-3 transition-all duration-200 shadow-lg z-[100000]"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Full Screen Image Container */}
          <div 
            className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={currentImageIndex}
              initial={{ 
                opacity: 0, 
                x: slideDirection === 'right' ? 100 : -100,
                scale: 0.95
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: slideDirection === 'right' ? -100 : 100,
                scale: 0.95
              }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.1, 0.25, 1.0] 
              }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage.imageUrl}
                alt={`${title} - Full Screen`}
                fill
                className="object-contain"
                quality={100}
                priority
                sizes="95vw"
              />
            </motion.div>
          </div>

          {/* Image Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white rounded-full px-4 py-2 text-sm font-medium shadow-lg z-[100000]">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}