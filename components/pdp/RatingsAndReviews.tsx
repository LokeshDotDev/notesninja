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
    name: "Rahul Sharma",
    rating: 5,
    date: "1 week ago",
    review: "Best for last-minute revision, honestly.",
    verified: true,
    itemType: "Study Notes"
  },
  {
    id: 2,
    name: "Priya Singh",
    rating: 4,
    date: "2 weeks ago",
    review: "So simple and clear — loved it. 🤩",
    verified: true,
    itemType: "Digital Notes"
  },
  {
    id: 3,
    name: "Arjun Patel",
    rating: 5,
    date: "3 days ago",
    review: "Amazing notes — super easy to follow.",
    verified: true,
    itemType: "Course Pack"
  },
  {
    id: 4,
    name: "Sneha Gupta",
    rating: 4.5,
    date: "1 month ago",
    review: "Helpful for quick concept revision.",
    verified: true,
    itemType: "Study Guide"
  },
  {
    id: 5,
    name: "Vikram Reddy",
    rating: 3,
    date: "2 days ago",
    review: "Good content but could use more examples.",
    verified: true,
    itemType: "Exam Prep"
  },
  {
    id: 6,
    name: "Anjali Mehta",
    rating: 5,
    date: "5 days ago",
    review: "Great for quick studying before exams.",
    verified: true,
    itemType: "Notes Pack"
  },
  {
    id: 7,
    name: "Rohan Kumar",
    rating: 4,
    date: "1 week ago",
    review: "Important topics were nicely covered. 👍",
    verified: true,
    itemType: "Study Material"
  },
  {
    id: 8,
    name: "Divya Joshi",
    rating: 4.5,
    date: "3 weeks ago",
    review: "Very organized and easy to read.",
    verified: true,
    itemType: "Digital Pack"
  },
  {
    id: 9,
    name: "Karan Singh",
    rating: 5,
    date: "4 days ago",
    review: "Perfect for late starters like me. 😂",
    verified: true,
    itemType: "Revision Notes"
  },
  {
    id: 10,
    name: "Neha Verma",
    rating: 4,
    date: "2 weeks ago",
    review: "Worth it for exam preparation.",
    verified: true,
    itemType: "Study Pack"
  },
  {
    id: 11,
    name: "Aditya Rao",
    rating: 4.5,
    date: "6 days ago",
    review: "Very easy to understand, no confusion.",
    verified: true,
    itemType: "Course Notes"
  },
  {
    id: 12,
    name: "Pooja Desai",
    rating: 5,
    date: "1 month ago",
    review: "Really useful during exam pressure.",
    verified: true,
    itemType: "Exam Notes"
  },
  {
    id: 13,
    name: "Siddharth Shah",
    rating: 4,
    date: "3 days ago",
    review: "Really satisfied — everything was clear.",
    verified: true,
    itemType: "Study Bundle"
  },
  {
    id: 14,
    name: "Riya Kapoor",
    rating: 3,
    date: "1 week ago",
    review: "Decent notes, but some topics missing.",
    verified: true,
    itemType: "Notes Collection"
  },
  {
    id: 15,
    name: "Manish Agarwal",
    rating: 5,
    date: "2 days ago",
    review: "Super happy with how organized it is.",
    verified: true,
    itemType: "Digital Study Pack"
  },
  {
    id: 16,
    name: "Kavya Iyer",
    rating: 4.5,
    date: "5 days ago",
    review: "Worth it.",
    verified: true,
    itemType: "Study Notes"
  },
  {
    id: 17,
    name: "Harsh Malhotra",
    rating: 4,
    date: "4 weeks ago",
    review: "Good for last-minute prep.",
    verified: true,
    itemType: "Revision Pack"
  },
  {
    id: 18,
    name: "Ishita Bansal",
    rating: 5,
    date: "1 week ago",
    review: "Last-minute lifesaver.",
    verified: true,
    itemType: "Quick Notes"
  },
  {
    id: 19,
    name: "Tarun Nair",
    rating: 4,
    date: "3 days ago",
    review: "Simple and effective.",
    verified: true,
    itemType: "Study Material"
  },
  {
    id: 20,
    name: "Simran Kaur",
    rating: 4.5,
    date: "2 weeks ago",
    review: "Very helpful.",
    verified: true,
    itemType: "Exam Prep Notes"
  }
];

const StarIcon = ({ filled, half, index }: { filled: boolean; half?: boolean; index?: number }) => {
  const gradientId = `halfStar-${index ?? 0}`;
  return (
    <svg
      className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : half ? 'text-yellow-400' : 'text-gray-300'}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={half ? `url(#${gradientId})` : filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={half ? 0 : filled ? 0 : 2}
    >
      {half && (
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
};

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
    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition duration-300 h-full"
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
      {[...Array(5)].map((_, i) => {
        const filled = i < Math.floor(review.rating);
        const half = !filled && i < review.rating;
        return <StarIcon key={i} filled={filled} half={half} index={i} />;
      })}
    </div>

    {/* Review Text */}
    <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
      {review.review}
    </p>

    {/* Review Image (if present) */}
    {review.image && (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.image}
          alt="Review image"
          className="w-full rounded-lg object-cover mt-3"
        />
      </>
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
  // Calculate real average from reviews
  const averageRating = Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));
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
                {[...Array(5)].map((_, i) => {
                  const filled = i < Math.floor(averageRating);
                  const half = !filled && i < averageRating;
                  return <StarIcon key={i} filled={filled} half={half} index={i} />;
                })}
              </div>
              <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">
              {totalReviews}+ Reviews
            </span>
          </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Horizontal Scrolling Carousel */}
        <div className="overflow-hidden relative group w-full mt-8">
          <style jsx>{`
            @keyframes seamlessReviewScroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-1 * var(--scroll-width)));
              }
            }
            .review-scroll-animate {
              animation: seamlessReviewScroll 30s linear infinite;
            }
            .review-scroll-animate:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          {/* Left fade overlay */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          {/* Right fade overlay */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          
          <div 
            className="flex gap-6 will-change-transform review-scroll-animate"
            style={{
              // Width of one set: 20 reviews × 320px + 19 gaps × 24px = 6400 + 456 = 6856px
              '--scroll-width': '6856px'
            } as React.CSSProperties}
          >
            {/* Double the reviews for seamless infinite scroll - 2 copies create perfect loop */}
            {[...reviews, ...reviews].map((review, index) => (
              <div key={`${review.id}-${index}`} className="flex-shrink-0 w-80">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Subtle More Reviews Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="mt-16 text-center"
        >
          
          <p className="text-xs text-gray-500 mt-3">
            Trusted by Students from Top Universities
          </p>
        </motion.div>
      </div>
    </section>
  );
}
