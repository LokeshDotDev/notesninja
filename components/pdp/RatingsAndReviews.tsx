"use client";

import React from 'react';
import { motion } from 'motion/react';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  review: string;
  verified: boolean;
  image?: string;
  itemType?: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    date: "2 weeks ago",
    review: "Absolutely comprehensive study materials! The notes are well-structured and cover everything I needed for my exams. Worth every penny.",
    verified: true,
    itemType: "Complete Course Pack"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    date: "1 month ago",
    review: "Perfect for last-minute preparation. The digital format is convenient and the quality is exceptional. Helped me score 92%!",
    verified: true,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop&crop=center",
    itemType: "Digital Notes"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 4,
    date: "3 weeks ago",
    review: "Great content and easy to understand. The diagrams and explanations made complex topics so much simpler. Would definitely recommend!",
    verified: true,
    itemType: "Study Guide"
  },
  {
    id: 4,
    name: "James Wilson",
    rating: 5,
    date: "2 months ago",
    review: "Life-saving materials! The problem-solving approaches and examples are exactly what I needed. Instant download was a huge plus.",
    verified: true,
    itemType: "Practice Papers"
  },
  {
    id: 5,
    name: "Priya Patel",
    rating: 5,
    date: "1 week ago",
    review: "Outstanding quality! The materials are expert-verified and aligned with the latest curriculum. Helped me secure an internship.",
    verified: true,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop&crop=center",
    itemType: "Premium Bundle"
  },
  {
    id: 6,
    name: "David Kim",
    rating: 4,
    date: "3 weeks ago",
    review: "Excellent study materials! The comprehensive coverage and clear explanations made all the difference in my understanding.",
    verified: true,
    itemType: "Subject Notes"
  },
  {
    id: 7,
    name: "Lisa Thompson",
    rating: 5,
    date: "1 month ago",
    review: "Best investment in my education! The materials are detailed yet easy to follow. No subscription needed - one-time payment is perfect.",
    verified: true,
    itemType: "Complete Package"
  },
  {
    id: 8,
    name: "Alex Martinez",
    rating: 5,
    date: "2 weeks ago",
    review: "Transformed my study routine! The quality is exceptional and the instant access feature is amazing. Highly recommend to all students.",
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center",
    itemType: "Digital Access"
  }
];

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const VerifiedBadge = () => (
  <div className="flex items-center gap-1">
    <div className="w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    <span className="text-xs text-purple-600 font-medium">Verified</span>
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition duration-300 mb-6 break-inside-avoid w-full inline-block"
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
          {review.verified && <VerifiedBadge />}
        </div>
        <p className="text-xs text-gray-500">{review.date}</p>
      </div>
    </div>

    {/* Star Rating */}
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < review.rating} />
      ))}
    </div>

    {/* Review Text */}
    <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
      {review.review}
    </p>

    {/* Review Image (if present) */}
    {review.image && (
      <img
        src={review.image}
        alt="Review image"
        className="w-full rounded-lg object-cover mt-3"
      />
    )}

    {/* Item Type */}
    {review.itemType && (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500 font-medium">{review.itemType}</span>
      </div>
    )}
  </motion.div>
);

export function RatingsAndReviews() {
  const averageRating = 4.8;
  const totalReviews = 602;

  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
              Ratings and Reviews
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < Math.floor(averageRating)} />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
              <span className="text-gray-600">| {totalReviews} Reviews</span>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Subtle More Reviews Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">
              {totalReviews}+ Verified Reviews
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Trusted by students worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
}
