"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Screenshot {
  id: number;
  image: string;
  title: string;
}

const screenshots: Screenshot[] = [
  {
    id: 1,
    image: '/assets/trustscreenshoots/WhatsApp Image 2026-02-23 at 10.43.47 AM.webp',
    title: 'Your notes were really helpful. I just came from my exam and I think I will score pretty good. Thank you so much!'
  },
  {
    id: 2,
    image: '/assets/trustscreenshoots/WhatsApp Image 2026-02-23 at 10.43.47 AM (1).webp',
    title: 'Your notes are really helpful. I would like to have notes for other marked subjects too.'
  },
  {
    id: 3,
    image: '/assets/trustscreenshoots/WhatsApp Image 2026-02-23 at 10.43.47 AM (2).webp',
    title: 'Complete guidance for project submission. All details filled carefully with instant support and PDF access.'
  },
  {
    id: 4,
    image: '/assets/trustscreenshoots/WhatsApp Image 2026-02-23 at 10.43.47 AM (3).webp',
    title: 'I visited your website and purchased notes. You gave instant reply to my message and instant PDF access. Thank you so much!'
  },
  {
    id: 5,
    image: '/assets/trustscreenshoots/Screenshot 8.webp',
    title: 'Trusted by MBA students for concise and effective exam preparation.'
  },
  {
    id: 6,
    image: '/assets/trustscreenshoots/Screenshot 9.webp',
    title: 'Making quick revision simple with well-structured key questions and answers.'
  },
  {
    id: 7,
    image: '/assets/trustscreenshoots/Screenshot 10.webp',
    title: 'Helping M.Com students simplify last-day revision with clear, structured notes.'
  },
  {
    id: 8,
    image: '/assets/trustscreenshoots/Screenshot 11.webp',
    title: 'When time is limited, structured Notes Ninja bundles make the difference.'
  },
  {
    id: 9,
    image: '/assets/trustscreenshoots/Screenshot 12.webp',
    title: 'When structured notes make exam questions feel familiar.'
  }
];

export function TrustScreenshots() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const totalPages = Math.ceil(screenshots.length / itemsPerPage);

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1); // Mobile: 1 item
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // Tablet: 2 items
      } else {
        setItemsPerPage(3); // Desktop: 3 items
      }
    };

    // Set initial value
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const getCurrentScreenshots = () => {
    const start = currentPage * itemsPerPage;
    return screenshots.slice(start, start + itemsPerPage);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Student Feedback & Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what students are saying about their experience
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute -left-2 md:-left-16 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 border border-gray-200"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-2 md:-right-16 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 border border-gray-200"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>

          {/* Screenshots Grid */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              >
                {getCurrentScreenshots().map((screenshot, index) => (
                  <motion.div
                    key={screenshot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex flex-col"
                  >
                    {/* Quote Mark */}
                    <div className="text-5xl font-serif text-orange-500 mb-2 leading-none h-10">
                      &quot;
                    </div>

                    {/* Image */}
                    <div className="relative aspect-[9/16] bg-white rounded-2xl overflow-hidden mb-6">
                      <Image
                        src={screenshot.image}
                        alt={`Student testimonial ${screenshot.id}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={80}
                      />
                    </div>

                    {/* Text Content */}
                    <p className="text-gray-800 text-base leading-relaxed mb-6 font-normal flex-1">
                      {screenshot.title}
                    </p>

                    {/* Verified Badge */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600">Verified Student</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`transition-all duration-300 ${currentPage === index
                  ? 'w-8 h-2 bg-gray-900 rounded-full'
                  : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                  }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-20"
        >
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-semibold">Join 10,000+ Successful Students</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
