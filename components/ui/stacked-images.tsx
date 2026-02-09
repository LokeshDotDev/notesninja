"use client";

import React from "react";
import Image from "next/image";

interface PostImage {
	id: string;
	imageUrl: string;
	publicId: string;
	order: number;
}

interface StackedImagesProps {
	images: PostImage[];
	title: string;
	onImageClick?: (imageIndex: number) => void; // Click on specific image
	className?: string;
}

export function StackedImages({
	images,
	title,
	onImageClick,
	className = "",
}: StackedImagesProps) {
	if (!images || images.length === 0) return null;
	const sortedImages = [...images].sort((a, b) => a.order - b.order);
	const displayImages = sortedImages.slice(0, 3); // Show max 3 stacked images
	const remainingCount = Math.max(0, images.length - 3);

	const handleImageClick = (e: React.MouseEvent, imageIndex: number) => {
		e.stopPropagation(); // Prevent card click
		onImageClick?.(imageIndex);
	};

	return (
		<div className={`relative cursor-pointer group ${className}`}>
			{/* Stacked Images */}
			<div className='relative'>
				{displayImages.map((image, index) => {
					const isTopImage = index === displayImages.length - 1;
					const zIndex = 10 + index;
					const translateX = index * 4;
					const translateY = index * 4;

					return (
						<div
							key={image.id}
							className='absolute top-0 left-0 rounded-xl overflow-hidden border-2 border-white shadow-lg transition-transform duration-300 group-hover:scale-105 cursor-pointer'
							style={{
								zIndex,
								transform: `translate(${translateX}px, ${translateY}px)`,
								filter: isTopImage ? "none" : "brightness(0.9)",
							}}
							onClick={(e) => handleImageClick(e, index)}>
							<Image
								src={image.imageUrl}
								alt={`${title} - Image ${index + 1}`}
								width={300}
								height={200}
								className='w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform duration-500'
							/>
							{/* Individual image hover effect */}
							<div className='absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300' />
						</div>
					);
				})}

				{/* Main image container to maintain proper spacing */}
				<div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-xl overflow-hidden opacity-0'>
					<Image
						src={sortedImages[0].imageUrl}
						alt={title}
						width={300}
						height={200}
						className='w-full h-full object-cover'
					/>
				</div>
			</div>

			{/* Count indicator for remaining images */}
			{remainingCount > 0 && (
				<div className='absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full z-20 backdrop-blur-sm'>
					+{remainingCount}
				</div>
			)}

			{/* Hover overlay */}
			<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl z-30' />
		</div>
	);
}
