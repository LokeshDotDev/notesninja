"use client";

import { Card } from "@/components/ui/card";
import { ShineBorder } from "@/components/magicui/shine-border";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import React from "react";
import Carousel from "@/components/ui/carousel";

type FeaturedItem = {
	id: string;
	title: string;
	descripition: string;
	imageUrl: string;
	categoryId: string;
};

interface FeaturedProps {
	label?: string;
	highlight?: string;
	categoryId?: string;
}

// Cache for API responses
const apiCache = new Map<string, { data: FeaturedItem[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function Featured({
	label = "Featured",
	highlight = "Collection",
	categoryId,
}: FeaturedProps) {
	const { theme } = useTheme?.() || { theme: "light" };
	const [featured, setFeatured] = React.useState<FeaturedItem[]>([]);
	const [loading, setLoading] = React.useState(false);
	React.useEffect(() => {
		if (!categoryId) return;

		// Check cache first
		const cacheKey = `featured-${categoryId}`;
		const cached = apiCache.get(cacheKey);
		const now = Date.now();

		if (cached && now - cached.timestamp < CACHE_DURATION) {
			setFeatured(cached.data.filter((item) => item.categoryId === categoryId));
			return;
		}

		setLoading(true);
		fetch(`/api/featured?category=${categoryId}`, {
			headers: {
				"Cache-Control": "public, max-age=300", // 5 minutes browser cache
			},
		})
			.then((res) => res.json())
			.then((data: FeaturedItem[]) => {
				// Cache the response
				apiCache.set("featured-all", { data, timestamp: now });
				setFeatured(
					data
						.filter((item) => item.categoryId === categoryId)
						.map((item) => ({ ...item }))
				);
			})
			.catch(() => setFeatured([]))
			.finally(() => setLoading(false));
	}, [categoryId]);

	// Map to Carousel slides format
	const slides = featured.map((item) => ({
		title: item.title,
		description: item.descripition,
		id: item.id,
		categoryId: item.categoryId,
		button: "View", // You can customize this or make dynamic
		src: item.imageUrl,
	}));

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, delay: 0.6 }}
			className='w-full max-w-6xl mt-8 sm:mt-12 md:mt-16 mb-6 sm:mb-10 md:mb-12 px-2 sm:px-4 md:px-6'>
			<Card className='relative w-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md shadow-xl p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-neutral-200 dark:border-neutral-700'>
				<ShineBorder
					shineColor={theme === "dark" ? "white" : "black"}
					className='rounded-2xl md:rounded-3xl'
				/>
				<div className='text-center'>
					<motion.h3
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className='text-lg sm:text-lg md:text-2xl lg:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100'>
						{label}
						<PointerHighlight
							rectangleClassName='bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-loose'
							pointerClassName='text-blue-500 h-3 w-3'
							containerClassName='inline-block mx-1'>
							<span className='relative z-10'>{highlight}</span>
						</PointerHighlight>
					</motion.h3>
				</div>
				{loading ? (
					<div className='text-center py-8 text-neutral-400'>Loading...</div>
				) : slides.length > 0 ? (
					<div className='w-full flex justify-center items-center overflow-x-hidden'>
						<div className='w-full mx-auto px-0 sm:px-4 md:px-8'>
							<div className='relative w-full aspect-[4/3] md:aspect-[16/9] flex items-center justify-center'>
								<Carousel slides={slides} modernStyle />
							</div>
						</div>
					</div>
				) : (
					<div className='text-center py-8 text-neutral-400'>
						No featured items in this category.
					</div>
				)}
			</Card>
		</motion.div>
	);
}
