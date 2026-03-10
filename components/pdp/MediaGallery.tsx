"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

// FIX 1: Move toWebp outside component — it's a pure function and
// recreating it on every render wastes work (and breaks memoization).
const toWebp = (url: string): string => {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (url.includes("f_webp") || url.includes("f_auto")) return url;
  return url.replace("/upload/", "/upload/f_webp,q_auto/");
};

// FIX 2: Pre-compute thumbnail Cloudinary URLs at a smaller size so the
// browser downloads ~8 KB per thumb instead of the full-res image.
const toThumbnail = (url: string): string => {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  // w_160,h_160,c_fill keeps file tiny while still looking sharp at 80px
  return url.replace("/upload/", "/upload/f_webp,q_auto,w_160,h_160,c_fill/");
};

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
  onZoomChange?: (zoomData: {
    isVisible: boolean;
    imageUrl: string;
    position: { x: number; y: number };
  }) => void;
}

export function MediaGallery({
  images = [],
  mainImage,
  title,
  onZoomChange,
}: MediaGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleThumbnails, setVisibleThumbnails] = useState(5);
  const [mainSlideDirection, setMainSlideDirection] = useState<'left' | 'right'>('right');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomHovered, setIsZoomHovered] = useState(false);

  // FIX 3: Don't mutate inside useMemo — Array.sort() mutates in place,
  // which can cause subtle bugs and forces React to see a "new" array
  // every time even when nothing changed. Use .slice().sort() instead.
  const allImages = useMemo(() => {
    if (images && images.length > 0) {
      return images.slice().sort((a, b) => a.order - b.order);
    }
    if (mainImage) {
      return [{ id: 'main', imageUrl: mainImage, publicId: '', order: 0, isCover: false }];
    }
    return [];
  }, [images, mainImage]);

  // Find cover image once, derived from the stable allImages memo.
  const coverImage = useMemo(
    () => allImages.find(img => img.isCover),
    [allImages]
  );

  // Set initial index to cover image.
  useEffect(() => {
    if (coverImage) {
      const idx = allImages.findIndex(img => img.id === coverImage.id);
      if (idx !== -1) setCurrentImageIndex(idx);
    }
  }, [coverImage, allImages]);

  const currentImage = allImages[currentImageIndex] ?? null;

  // FIX 4: Memoize the optimized URL so it's only recomputed when the
  // actual image URL changes — not on every render.
  const optimizedCurrentImageUrl = useMemo(
    () => (currentImage?.imageUrl ? toWebp(currentImage.imageUrl) : ''),
    [currentImage?.imageUrl]
  );

  // Auto-scroll pauses while hovered or zoomed.
  useEffect(() => {
    if (!isAutoScrolling || isHovered || isZoomHovered || allImages.length <= 1) return;
    const interval = setInterval(() => {
      setMainSlideDirection('right');
      setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoScrolling, isHovered, isZoomHovered, allImages.length]);

  // FIX 5: Wrap handlers in useCallback so child buttons don't re-render
  // unnecessarily when the parent re-renders for unrelated reasons.
  const handleImageSelect = useCallback((index: number) => {
    setIsAutoScrolling(false);
    setCurrentImageIndex(index);
    setTimeout(() => setIsAutoScrolling(true), 2000);
  }, []);

  const handlePrevious = useCallback(() => {
    setIsAutoScrolling(false);
    setMainSlideDirection('left');
    setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
    setTimeout(() => setIsAutoScrolling(true), 2000);
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setIsAutoScrolling(false);
    setMainSlideDirection('right');
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    setTimeout(() => setIsAutoScrolling(true), 2000);
  }, [allImages.length]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const adjustedX = Math.max(0, Math.min(100, x * 2 - 50));
      const adjustedY = Math.max(0, Math.min(100, y * 2 - 50));
      if (onZoomChange && currentImage) {
        onZoomChange({
          isVisible: true,
          imageUrl: optimizedCurrentImageUrl,
          position: { x: adjustedX, y: adjustedY },
        });
      }
    },
    [onZoomChange, currentImage, optimizedCurrentImageUrl]
  );

  const handleMouseEnter = useCallback(() => setIsZoomHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsZoomHovered(false);
    onZoomChange?.({ isVisible: false, imageUrl: '', position: { x: 0, y: 0 } });
  }, [onZoomChange]);

  return (
    <main role="main" aria-label="Product image gallery">
      <div
        className="flex gap-4"
      >
        {/* Vertical Thumbnail Gallery */}
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
                {image.imageUrl?.toLowerCase().includes('.gif') ? (
                  // FIX 6: GIF thumbnails use the raw URL — no WebP conversion
                  // (browsers can't display a WebP-converted GIF as animated).
                  <Image
                    src={image.imageUrl}
                    alt={`${title} - ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                    // FIX 7: First 3 thumbs load eagerly; the rest are lazy.
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                ) : (
                  <Image
                    src={toThumbnail(image.imageUrl)} // FIX 2 applied here
                    alt={`${title} - ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    quality={75}
                    loading={index < 3 ? 'eager' : 'lazy'} // FIX 7
                  />
                )}
                {image.isCover && (
                  <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                    Cover
                  </div>
                )}
              </button>
            ))}

            {allImages.length > 5 && (
              <button
                onClick={() =>
                  visibleThumbnails < allImages.length
                    ? setVisibleThumbnails(allImages.length)
                    : setVisibleThumbnails(5)
                }
                className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {visibleThumbnails < allImages.length
                      ? `+${allImages.length - visibleThumbnails}`
                      : 'Show Less'}
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
          <div
            className="relative bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {currentImage ? (
              <div className="relative">
                <div
                  className="relative w-full overflow-hidden cursor-zoom-in"
                  style={{ paddingBottom: '100%' }}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: mainSlideDirection === 'right' ? 50 : -50, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="absolute inset-0"
                  >
                    {currentImage.imageUrl?.toLowerCase().includes('.gif') ? (
                      <Image
                        src={currentImage.imageUrl} // raw URL for animated GIFs
                        alt={title}
                        width={800}
                        height={800}
                        className="w-full h-full object-contain"
                        loading="eager"
                        fetchPriority="high"
                      />
                    ) : (
                      <Image
                        src={optimizedCurrentImageUrl}
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

                  {/* FIX 8: Preload the next image invisibly so it's already
                      in the browser cache when the user clicks Next. */}
                  {allImages.length > 1 && (
                    <div className="sr-only" aria-hidden="true">
                      <Image
                        src={toWebp(allImages[(currentImageIndex + 1) % allImages.length].imageUrl)}
                        alt=""
                        fill
                        sizes="1px"
                        quality={85}
                        priority={false}
                        loading="eager"
                      />
                    </div>
                  )}
                </div>

                {allImages.length > 1 && (
                  <React.Fragment>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg z-20"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-neutral-900 dark:text-white" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg z-20"
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
      </div>
    </main>
  );
}