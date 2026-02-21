"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  course: string;
  rating: number;
  review: string;
  date: string;
  avatar?: string;
}

export function StudentReviews() {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews: Review[] = [
    {
      id: '1',
      name: "Priya Sharma",
      course: "BBA Semester 3",
      rating: 5,
      review: "The study materials are comprehensive and well-structured. They helped me understand complex concepts easily and I scored much better in my exams. Highly recommend!",
      date: "2 weeks ago",
      avatar: "PS"
    },
    {
      id: '2',
      name: "Rahul Kumar",
      course: "Engineering Mathematics",
      rating: 5,
      review: "Excellent quality content with clear explanations. The practice questions were very helpful for exam preparation. Worth every penny!",
      date: "1 month ago",
      avatar: "RK"
    },
    {
      id: '3',
      name: "Anita Patel",
      course: "Computer Science Fundamentals",
      rating: 4,
      review: "Great study materials with updated curriculum. The digital format makes it easy to study anywhere. Customer support is also very responsive.",
      date: "3 weeks ago",
      avatar: "AP"
    },
    {
      id: '4',
      name: "Vikram Singh",
      course: "Business Studies",
      rating: 5,
      review: "These materials saved me so much study time! Everything is organized perfectly and the examples are really practical. Got A+ in my finals!",
      date: "2 months ago",
      avatar: "VS"
    },
    {
      id: '5',
      name: "Kavya Reddy",
      course: "Economics Semester 2",
      rating: 5,
      review: "The best investment I made for my education. The content is exam-focused and the quality is outstanding. Thank you Notes Ninja!",
      date: "1 week ago",
      avatar: "KR"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'
        }`}
      />
    ));
  };

  const handlePrevious = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const visibleReviews = [
    reviews[currentReview],
    reviews[(currentReview + 1) % reviews.length],
    reviews[(currentReview + 2) % reviews.length]
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          What Students Say
        </h2>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          Real reviews from real students who&apos;ve transformed their learning journey
        </p>
      </div>

      {/* Reviews Carousel */}
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700 ${
                index === 0 ? 'ring-2 ring-green-500 ring-offset-2' : ''
              }`}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {renderStars(review.rating)}
              </div>

              {/* Review Content */}
              <div className="relative mb-4">
                <Quote className="w-8 h-8 text-green-500 absolute -top-2 -left-2 opacity-20" />
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed pl-6">
                  {review.review}
                </p>
              </div>

              {/* Student Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900 dark:text-white">
                    {review.name}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {review.course}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-500">
                {review.date}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-900 dark:text-white" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
        >
          <ChevronRight className="w-5 h-5 text-neutral-900 dark:text-white" />
        </button>
      </div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {renderStars(5)}
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">4.8/5</div>
            <div className="text-neutral-600 dark:text-neutral-400">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">2,500+</div>
            <div className="text-neutral-600 dark:text-neutral-400">Reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">96%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Would Recommend</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
