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
    backgroundImage: "/assets/slider/Slide 1.png",
    backgroundColor: "from-transparent to-transparent"
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 2.png",
    backgroundColor: "from-transparent to-transparent"
  },
  {
    id: 3,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 3.png",
    backgroundColor: "from-transparent to-transparent"
  },
  {
    id: 4,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 4.png",
    backgroundColor: "from-transparent to-transparent"
  },
  {
    id: 5,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 5 option 1.png",
    backgroundColor: "from-transparent to-transparent"
  },
  {
    id: 6,
    title: "",
    subtitle: "",
    buttonText: "",
    backgroundImage: "/assets/slider/Slide 5 Option 2.png",
    backgroundColor: "from-transparent to-transparent"
  }
];

// Create infinite slides array by adding first and last slides to both ends
const infiniteSlides = [slides[slides.length - 1], ...slides, slides[0]];

export function GiantSlider() {
  const [currentSlide, setCurrentSlide] = useState(1); // Start at 1 to show first real slide
  const [isTransitioning, setIsTransitioning] = useState(true);

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
    <section 
      className="relative w-full overflow-hidden bg-white aspect-[2/1] md:aspect-[16/9] lg:aspect-video"
    >
      <div className="relative h-full overflow-hidden">
        <div 
          className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`
          }}
        >
          {infiniteSlides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className="w-full h-full flex-shrink-0 relative"
            >
              <Image
                src={slide.backgroundImage}
                alt={`Slide ${index}`}
                fill
                className="object-cover object-center md:object-center lg:object-center"
                priority={index === 1}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  width: '100%',
                  height: '100%'
                }}
              />
              {/* Background Overlay - Lighter for white background */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/10 backdrop-blur-sm text-black p-2 md:p-3 rounded-full hover:bg-black/20 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/10 backdrop-blur-sm text-black p-2 md:p-3 rounded-full hover:bg-black/20 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-1 md:space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 md:h-3 rounded-full transition-all duration-300",
              currentSlide === index + 1
                ? "bg-black w-6 md:w-8"
                : "bg-black/50 hover:bg-black/70 w-2 md:w-3"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
