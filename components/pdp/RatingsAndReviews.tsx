"use client";

import React from "react";
import { motion } from "framer-motion";

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
		name: "Kavya Iyer",
		rating: 4,
		date: "2 weeks ago",
		review:
			"The notes are well structured and easy to revise from. I used them mainly during exam week and it helped me cover the important topics quickly. A few topics could probably include a little more explanation, but overall it was very useful for revision.",
		verified: true,
		itemType: "BBA, Manipal University Jaipur",
	},
	{
		id: 2,
		name: "Rohan Sharma",
		rating: 5,
		date: "1 week ago",
		review:
			"What I liked most is that the content is to the point. Instead of going through long chapters, the notes highlight what actually matters for exams. It made revision much faster compared to using only textbooks.",
		verified: true,
		itemType: "MBA",
	},
	{
		id: 3,
		name: "Ishita Bansal",
		rating: 3,
		date: "3 weeks ago",
		review:
			"The notes are written in simple language and the key concepts are clearly explained. They worked well for revision, although adding a few more examples in some sections could make them even easier to understand.",
		verified: true,
		itemType: "BCom, Manipal University Jaipur",
	},
	{
		id: 4,
		name: "Harsh Malhotra",
		rating: 4,
		date: "5 days ago",
		review:
			"Used these notes for quick revision and they were quite helpful. Most of the topics that appeared in the exam were already covered, which made last-minute preparation easier.",
		verified: true,
		itemType: "MCA",
	},
	{
		id: 5,
		name: "Aditi Verma",
		rating: 3,
		date: "1 month ago",
		review:
			"The explanations are clear and the content is organized properly. It helped me understand a few concepts that I was struggling with earlier. I also liked that it included a glossary section for better understanding. It would be even better if a few topics had slightly more detailed explanations.",
		verified: true,
		itemType: "MA Economics",
	},
	{
		id: 6,
		name: "Neha Gupta",
		rating: 5,
		date: "6 days ago",
		review:
			"Very useful when you are short on time. I used their summary section mainly for revision and it saved me from going through multiple resources. The notes are straightforward and easy to follow.",
		verified: true,
		itemType: "BCA",
	},
	{
		id: 7,
		name: "Arjun Mehta",
		rating: 4,
		date: "4 days ago",
		review:
			"The notes are short and easy to read. I liked that the important points are already summarized which makes studying much faster. The PDF format is also convenient because I could access it on my phone and laptop while studying.",
		verified: true,
		itemType: "BBA, Manipal University Jaipur",
	},
	{
		id: 8,
		name: "Simran Kaur",
		rating: 3,
		date: "2 weeks ago",
		review:
			"The units are well organized and cover the main areas of my syllabus. It helped me prepare more confidently for my semester exams. Adding a few more practical examples in certain topics could make the notes even more helpful.",
		verified: true,
		itemType: "MCom",
	},
	{
		id: 9,
		name: "Rahul Jain",
		rating: 4,
		date: "1 week ago",
		review:
			"Good study material for revision. The format makes it easy to go through all the units quickly before exams.",
		verified: true,
		itemType: "MBA, Manipal University Jaipur",
	},
	{
		id: 10,
		name: "Priya Nair",
		rating: 5,
		date: "3 days ago",
		review:
			"These notes helped me revise my entire syllabus quickly before the exam. Everything is explained in a clear and straightforward way.",
		verified: true,
		itemType: "BBA",
	},
];

const StarIcon = ({
	filled,
	half,
	index,
}: {
	filled: boolean;
	half?: boolean;
	index?: number;
}) => {
	const gradientId = `halfStar-${index ?? 0}`;
	return (
		<svg
			className={`w-4 h-4 ${filled ? "text-yellow-400 fill-yellow-400" : half ? "text-yellow-400" : "text-gray-300"}`}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill={half ? `url(#${gradientId})` : filled ? "currentColor" : "none"}
			stroke='currentColor'
			strokeWidth={half ? 0 : filled ? 0 : 2}>
			{half && (
				<defs>
					<linearGradient id={gradientId}>
						<stop offset='50%' stopColor='currentColor' />
						<stop offset='50%' stopColor='transparent' />
					</linearGradient>
				</defs>
			)}
			<path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
		</svg>
	);
};

const VerifiedBadge = () => (
	<div className='flex items-center gap-1'>
		<div className='w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center'>
			<svg
				className='w-2 h-2 text-white'
				fill='currentColor'
				viewBox='0 0 20 20'>
				<path
					fillRule='evenodd'
					d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
					clipRule='evenodd'
				/>
			</svg>
		</div>
		<span className='text-xs text-purple-600 font-medium'>Verified</span>
	</div>
);

const ReviewCard = ({ review }: { review: Review }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		transition={{ duration: 0.7, ease: "easeOut" }}
		className='bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition duration-300 h-full'>
		{/* Header */}
		<div className='flex items-start justify-between mb-3'>
			<div className='flex-1'>
				<div className='flex items-center gap-2 mb-1'>
					<h4 className='font-semibold text-gray-900 text-sm'>{review.name}</h4>
					{review.verified && <VerifiedBadge />}
				</div>
				<p className='text-xs text-gray-500'>{review.date}</p>
			</div>
		</div>

		{/* Star Rating */}
		<div className='flex items-center gap-1 mb-3'>
			{[...Array(5)].map((_, i) => {
				const filled = i < Math.floor(review.rating);
				const half = !filled && i < review.rating;
				return <StarIcon key={i} filled={filled} half={half} index={i} />;
			})}
		</div>

		{/* Review Text */}
		<p className='text-gray-700 text-sm leading-relaxed'>{review.review}</p>

		{/* Review Image (if present) */}
		{review.image && (
			<>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={review.image}
					alt='Review image'
					className='w-full rounded-lg object-cover mt-3'
				/>
			</>
		)}

		{/* Item Type */}
		{review.itemType && (
			<div className='mt-3 pt-3 border-t border-gray-100'>
				<span className='text-xs text-gray-500 font-medium'>
					{review.itemType}
				</span>
			</div>
		)}
	</motion.div>
);

export function RatingsAndReviews() {
	// Calculate real average from reviews
	const averageRating = Number(
		(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
	);
	const totalReviews = reviews.length;
	const reviewCardWidth = 320;
	const reviewGap = 24;
	const scrollWidth =
		reviews.length * reviewCardWidth + (reviews.length - 1) * reviewGap;

	return (
		<section className='w-full bg-gray-50 py-20 px-6 md:px-16'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7, ease: "easeOut" }}>
					<div className='mb-12'>
						<h2 className='text-3xl md:text-4xl font-semibold text-gray-900 mb-3'>
							Ratings and Reviews
						</h2>
						<div className='flex items-center gap-3'>
							<div className='flex items-center gap-1'>
								{[...Array(5)].map((_, i) => {
									const filled = i < Math.floor(averageRating);
									const half = !filled && i < averageRating;
									return (
										<StarIcon key={i} filled={filled} half={half} index={i} />
									);
								})}
							</div>
							<span className='text-lg font-semibold text-gray-900'>
								{averageRating}
							</span>
							<div className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full'>
								<div className='w-2 h-2 bg-green-500 rounded-full'></div>
								<span className='text-xs font-medium text-gray-700'>
									{totalReviews}+ Reviews
								</span>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Reviews Horizontal Scrolling Carousel */}
				<div className='overflow-hidden relative group w-full mt-8'>
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
							animation: seamlessReviewScroll 60s linear infinite;
						}
						.review-scroll-animate:hover {
							animation-play-state: paused;
						}
					`}</style>

					{/* Left fade overlay */}
					<div className='pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent z-10' />
					{/* Right fade overlay */}
					<div className='pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-10' />

					<div
						className='flex gap-6 will-change-transform review-scroll-animate'
						style={
							{
								"--scroll-width": `${scrollWidth}px`,
							} as React.CSSProperties
						}>
						{/* Double the reviews for seamless infinite scroll - 2 copies create perfect loop */}
						{[...reviews, ...reviews].map((review, index) => (
							<div key={`${review.id}-${index}`} className='flex-shrink-0 w-80'>
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
					className='mt-16 text-center'>
					<p className='text-xs text-gray-500 mt-3'>
						Trusted by Students from Top Universities
					</p>
				</motion.div>
			</div>
		</section>
	);
}
