"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
  backgroundColor?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 1.webp",
    backgroundColor: "from-transparent to-transparent"
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 2.webp",
    backgroundColor: "from-transparent to-transparent"
  },
  {
    id: 3,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 3.webp",
    backgroundColor: "from-transparent to-transparent"
  },
  {
    id: 4,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 4.webp",
    backgroundColor: "from-transparent to-transparent"
  },
  {
    id: 5,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 5 option 1.webp",
    backgroundColor: "from-transparent to-transparent"
  }
];

// Create infinite slides array by adding first and last slides to both ends
const infiniteSlides = [slides[slides.length - 1], ...slides, slides[0]];

export function GiantSlider() {
  const [currentSlide, setCurrentSlide] = useState(1); // Start at 1 to show first real slide
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  // Main heading for accessibility - visually hidden
  const mainHeading = "Premium Digital Academic Materials & Study Resources";

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Handle infinite loop boundaries
    if (currentSlide === 0) {
      // Reached the cloned last slide, jump to real last slide
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(slides.length);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 700);
    } else if (currentSlide === slides.length + 1) {
      // Reached the cloned first slide, jump to real first slide
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
        setTimeout(() => setIsTransitioning(true), 50);
      }, 700);
    }
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index + 1); // Add 1 to account for cloned first slide
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  return (
    <>
      {/* Visually hidden h1 for accessibility and SEO */}
      <h1 className="sr-only">{mainHeading}</h1>
      
      <section 
        className="relative w-full overflow-hidden bg-white aspect-[2/1] md:aspect-[16/9] lg:aspect-video"
        id="hero-carousel"
        aria-label="Hero carousel with study materials showcase"
      >
      <div className="relative h-full overflow-hidden">
        <div 
          className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            willChange: 'transform'
          }}
        >
          {infiniteSlides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className="w-full h-full flex-shrink-0 relative"
            >
              <Image
                src={slide.backgroundImage}
                alt={slide.title || `Premium study materials slide ${index}`}
                fill
                className={cn("object-cover", index === 1 && "hero-lcp image-lcp")}
                priority={index === 1}
                fetchPriority={index === 1 ? "high" : "low"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                quality={index === 1 ? 90 : 75}
                loading={index === 1 ? "eager" : "lazy"}
                unoptimized={false}
              />
              {/* Background Overlay - Lighter for white background */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Accessible with touch targets and proper ARIA */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/10 backdrop-blur-sm text-black p-2 md:p-3 rounded-full hover:bg-black/20 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
        style={{ willChange: 'background-color' }}
        aria-label="Previous slide"
        aria-controls="hero-carousel"
        title="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" aria-hidden="true" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/10 backdrop-blur-sm text-black p-2 md:p-3 rounded-full hover:bg-black/20 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
        style={{ willChange: 'background-color' }}
        aria-label="Next slide"
        aria-controls="hero-carousel"
        title="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" aria-hidden="true" />
      </button>

      {/* Pagination Dots - Accessible carousel controls */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-1 md:space-x-2" role="group" aria-label="Slide navigation">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 md:h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
              currentSlide === index + 1
                ? "bg-black w-6 md:w-8"
                : "bg-black/50 hover:bg-black/70 w-2 md:w-3"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index + 1 ? "true" : "false"}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      </section>
    </>
  );
}
