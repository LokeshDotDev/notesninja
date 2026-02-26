"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PostImage {
	id: string;
	imageUrl: string;
	publicId: string;
	order: number;
}

interface ImageStackProps {
	images: PostImage[];
	title: string;
	onImageClick?: (imageIndex: number) => void;
	className?: string;
}

export function ImageStack({
	images,
	title,
	onImageClick,
	className = "",
}: ImageStackProps) {
	if (!images || images.length === 0) return null;

	const sortedImages = [...images].sort((a, b) => a.order - b.order);
	const displayImages = sortedImages.slice(0, 3); // Show max 3 stacked images
	const remainingCount = Math.max(0, images.length - 3);
	const handleImageClick = (e: React.MouseEvent, imageIndex: number) => {
		console.log("ImageStack handleImageClick called", imageIndex);
		// Only stop propagation if we have an image click handler
		if (onImageClick) {
			e.stopPropagation();
			onImageClick(imageIndex);
		}
	};
	return (
		<div className={`relative group ${className}`}>
			{/* Stacked Images with clean card design */}
			<div className='relative h-80 w-full md:h-96'>
				{displayImages.map((image, index) => {
					const isTopCard = index === displayImages.length - 1;
					const zIndex = displayImages.length - index + 10;
					const translateX = index * 6; // Horizontal offset
					const translateY = index * 6; // Vertical offset

					return (
						<motion.div
							key={image.id}
							className='absolute top-0 left-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-white'
							style={{
								zIndex,
								width: `calc(100% - ${index * 12}px)`,
								height: `calc(100% - ${index * 12}px)`,
								transform: `translate(${translateX}px, ${translateY}px)`,
								filter: isTopCard ? "none" : "brightness(0.85)",
							}}
							whileHover={{
								scale: 1.03,
								transition: { duration: 0.2 },
							}}>
							{" "}
							<div className='relative h-full w-full bg-white'>
								<Image
									src={image.imageUrl}
									alt={`${title} - Image ${index + 1}`}
									fill
									className='object-cover transition-transform duration-500'
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								/>

								{/* Subtle shadow overlay for depth */}
								{!isTopCard && <div className='absolute inset-0 bg-black/10' />}

								{/* Only the top image can be clicked for gallery */}
								{isTopCard && onImageClick && (
									<button
										className='absolute top-2 left-2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 z-10'
										onClick={(e) => handleImageClick(e, index)}
										title='View gallery'>
										🖼️
									</button>
								)}
							</div>
						</motion.div>
					);
				})}
			</div>{" "}
			{/* Count indicator with clean design */}
			{remainingCount > 0 && (
				<motion.div
					className='absolute top-3 right-3 bg-black/75 text-white text-sm font-semibold px-3 py-1.5 rounded-full z-50 backdrop-blur-sm shadow-lg'
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2 }}>
					+{remainingCount}
				</motion.div>
			)}
			{/* Clean hover effect */}
			<div className='absolute inset-0 bg-gradient-to-t from-transparent to-transparent group-hover:from-black/5 transition-all duration-300 rounded-2xl pointer-events-none' />
		</div>
	);
}
