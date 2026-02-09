"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PostImage {
	id: string;
	imageUrl: string;
	publicId: string;
	order: number;
}

interface ImageGalleryModalProps {
	images: PostImage[];
	isOpen: boolean;
	onClose: () => void;
	initialIndex?: number;
}

export function ImageGalleryModal({
	images,
	isOpen,
	onClose,
	initialIndex = 0,
}: ImageGalleryModalProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const sortedImages = [...images].sort((a, b) => a.order - b.order);

	useEffect(() => {
		setCurrentIndex(
			Math.max(0, Math.min(initialIndex, sortedImages.length - 1))
		);
	}, [initialIndex, sortedImages.length]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isOpen) return;

			switch (event.key) {
				case "Escape":
					onClose();
					break;
				case "ArrowLeft":
					setCurrentIndex(
						(prev) => (prev - 1 + sortedImages.length) % sortedImages.length
					);
					break;
				case "ArrowRight":
					setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose, sortedImages.length]);

	const handlePrevious = () => {
		setCurrentIndex(
			(prev) => (prev - 1 + sortedImages.length) % sortedImages.length
		);
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen || !sortedImages.length) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
				className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm'
				onClick={handleBackdropClick}>
				{" "}
				{/* Close Button */}
				<button
					onClick={onClose}
					className='absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200 touch-manipulation'
					aria-label='Close gallery'>
					<X className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
				</button>
				{/* Navigation Buttons */}
				{sortedImages.length > 1 && (
					<>
						<button
							onClick={handlePrevious}
							className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200 touch-manipulation'
							aria-label='Previous image'>
							<ChevronLeft className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
						</button>

						<button
							onClick={handleNext}
							className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200 touch-manipulation'
							aria-label='Next image'>
							<ChevronRight className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
						</button>
					</>
				)}{" "}
				{/* Main Content */}
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='relative w-full h-full flex flex-col items-center justify-center p-1 sm:p-2'>
					{/* Image Container */}
					<div className='relative flex-1 flex items-center justify-center w-full max-w-7xl max-h-[90vh] px-1 sm:px-2'>
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.3 }}
							className='relative w-full h-full flex items-center justify-center'>
							<Image
								src={sortedImages[currentIndex].imageUrl}
								alt={`Image ${currentIndex + 1} of ${sortedImages.length}`}
								width={1600}
								height={1200}
								className='max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl'
								priority
								quality={100}
								sizes='(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 90vw'
							/>
						</motion.div>
					</div>{" "}
					{/* Image Counter */}
					<div className='mt-1 sm:mt-2 text-center text-white'>
						<p className='text-xs sm:text-sm text-gray-400'>
							{currentIndex + 1} of {sortedImages.length}
						</p>
					</div>
					{/* Thumbnail Navigation */}
					{sortedImages.length > 1 && (
						<div className='mt-1 sm:mt-2 flex justify-center space-x-1 sm:space-x-2 max-w-full overflow-x-auto pb-1 px-2'>
							{sortedImages.map((image, index) => (
								<button
									key={image.id}
									onClick={() => setCurrentIndex(index)}
									className={`relative flex-shrink-0 w-10 h-7 sm:w-12 sm:h-9 rounded overflow-hidden border-2 transition-all duration-200 touch-manipulation ${
										index === currentIndex
											? "border-white shadow-lg scale-110"
											: "border-gray-500 hover:border-gray-300"
									}`}>
									<Image
										src={image.imageUrl}
										alt={`Thumbnail ${index + 1}`}
										width={100}
										height={100}
										className='w-full h-full object-cover'
									/>
								</button>
							))}
						</div>
					)}
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
