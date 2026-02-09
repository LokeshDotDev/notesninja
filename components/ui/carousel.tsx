"use client";
import {
	IconArrowNarrowRight,
	IconChevronLeft,
	IconChevronRight,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState, useRef, useId, useEffect } from "react";

interface SlideData {
	title: string;
	button: string;
	src: string;
	description: string;
	id?: string; // Optional ID for each slide
	categoryId?: string; // Optional category ID for filtering
}

interface SlideProps {
	slide: SlideData;
	index: number;
	current: number;
	handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
	const slideRef = useRef<HTMLLIElement>(null);

	const xRef = useRef(0);
	const yRef = useRef(0);
	const frameRef = useRef<number>(0);

	useEffect(() => {
		const animate = () => {
			if (!slideRef.current) return;

			const x = xRef.current;
			const y = yRef.current;

			slideRef.current.style.setProperty("--x", `${x}px`);
			slideRef.current.style.setProperty("--y", `${y}px`);

			frameRef.current = requestAnimationFrame(animate);
		};

		frameRef.current = requestAnimationFrame(animate);

		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
		};
	}, []);

	const handleMouseMove = (event: React.MouseEvent) => {
		const el = slideRef.current;
		if (!el) return;

		const r = el.getBoundingClientRect();
		xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
		yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
	};

	const handleMouseLeave = () => {
		xRef.current = 0;
		yRef.current = 0;
	};

	const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
		event.currentTarget.style.opacity = "1";
	};

	const { src, button, title } = slide;

	return (
		<div className='[perspective:1200px] [transform-style:preserve-3d]'>
			<li
				ref={slideRef}
				className='flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 '
				onClick={() => handleSlideClick(index)}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				style={{
					transform:
						current !== index
							? "scale(0.98) rotateX(8deg)"
							: "scale(1) rotateX(0deg)",
					transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
					transformOrigin: "bottom",
				}}>
				<div
					className='absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out'
					style={{
						transform:
							current === index
								? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
								: "none",
					}}>
					<Image
						className='absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out'
						style={{
							opacity: current === index ? 1 : 0.5,
						}}
						alt={title}
						src={src}
						onLoad={imageLoaded}
						loading='eager'
						decoding='sync'
						width={800}
						height={600}
					/>
					{current === index && (
						<div className='absolute inset-0 bg-black/30 transition-all duration-1000' />
					)}
				</div>

				<article
					className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
						current === index ? "opacity-100 visible" : "opacity-0 invisible"
					}`}>
					<h2 className='text-lg md:text-2xl lg:text-4xl font-semibold  relative'>
						{title}
					</h2>
					<div className='flex justify-center'>
						<button className='mt-6  px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
							{button}
						</button>
					</div>
				</article>
			</li>
		</div>
	);
};

interface CarouselControlProps {
	type: string;
	title: string;
	handleClick: () => void;
}

const CarouselControl = ({
	type,
	title,
	handleClick,
}: CarouselControlProps) => {
	return (
		<button
			className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
				type === "previous" ? "rotate-180" : ""
			}`}
			title={title}
			onClick={handleClick}>
			<IconArrowNarrowRight className='text-neutral-600 dark:text-neutral-200' />
		</button>
	);
};

interface CarouselProps {
	slides: SlideData[];
	modernStyle?: boolean;
}

export default function Carousel({ slides, modernStyle }: CarouselProps) {
	const [current, setCurrent] = useState(0);

	// Drag/swipe refs and threshold
	const dragStartX = useRef<number | null>(null);
	const dragDeltaX = useRef(0);
	const isDragging = useRef(false);
	const threshold = 50; // px threshold to change slide

	const handlePreviousClick = () => {
		const previous = current - 1;
		setCurrent(previous < 0 ? slides.length - 1 : previous);
	};

	const handleNextClick = () => {
		const next = current + 1;
		setCurrent(next === slides.length ? 0 : next);
	};

	const handleSlideClick = (index: number) => {
		if (current !== index) {
			setCurrent(index);
		}
	};

	// Drag/Swipe handlers for old style carousel
	const handlePointerDown = (e: React.PointerEvent) => {
		dragStartX.current = e.clientX;
		dragDeltaX.current = 0;
		isDragging.current = true;
	};

	const handlePointerMove = (e: React.PointerEvent) => {
		if (!isDragging.current || dragStartX.current === null) return;

		dragDeltaX.current = e.clientX - dragStartX.current;
	};

	const handlePointerUp = () => {
		if (!isDragging.current || dragStartX.current === null) return;

		if (dragDeltaX.current > threshold) {
			// Dragged right, previous slide
			handlePreviousClick();
		} else if (dragDeltaX.current < -threshold) {
			// Dragged left, next slide
			handleNextClick();
		}

		dragStartX.current = null;
		dragDeltaX.current = 0;
		isDragging.current = false;
	};

	const handlePointerCancel = () => {
		dragStartX.current = null;
		dragDeltaX.current = 0;
		isDragging.current = false;
	};

	// Add touch event handlers for swipe functionality
	const touchStartX = useRef<number | null>(null);
	const touchDeltaX = useRef(0);

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
		touchDeltaX.current = 0;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;

		touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
	};

	const handleTouchEnd = () => {
		if (touchStartX.current === null) return;

		if (touchDeltaX.current > threshold) {
			// Swiped right, previous slide
			handlePreviousClick();
		} else if (touchDeltaX.current < -threshold) {
			// Swiped left, next slide
			handleNextClick();
		}

		touchStartX.current = null;
		touchDeltaX.current = 0;
	};

	const id = useId();

	// Modern style carousel rendering (unchanged)
	if (modernStyle) {
		return (
			<div className='relative w-full h-full flex items-center justify-center'>
				<button
					className='absolute left-2 top-1/2 -translate-y-1/2 z-100 bg-white/70 dark:bg-neutral-900/70 shadow-lg rounded-full sm:p-2 p-1 hover:bg-white hover:scale-110 transition border border-neutral-200 dark:border-neutral-700 backdrop-blur'
					onClick={handlePreviousClick}
					title='Previous'>
					<IconChevronLeft className='w-7 h-7 text-black dark:text-white' />
				</button>
				<div className='flex items-center justify-center w-full h-full'>
					{slides.map((slide, index) => {
						// Calculate position relative to current
						const offset = index - current;
						const style = "absolute top-0 left-1/2 transition-all duration-500";
						let scale = 1;
						let blur = "";
						let z = 10;
						let opacity = 1;
						let translateX = 0;
						if (offset === 0) {
							// Center slide
							scale = 1;
							blur = "";
							z = 30;
							opacity = 1;
							translateX = 0;
						} else if (
							offset === -1 ||
							(current === 0 && index === slides.length - 1)
						) {
							// Left slide
							scale = 0.8;
							blur = "blur-sm";
							z = 20;
							opacity = 0.7;
							translateX = -120;
						} else if (
							offset === 1 ||
							(current === slides.length - 1 && index === 0)
						) {
							// Right slide
							scale = 0.8;
							blur = "blur-sm";
							z = 20;
							opacity = 0.7;
							translateX = 120;
						} else {
							// Hide other slides
							scale = 0.5;
							blur = "blur-md";
							z = 0;
							opacity = 0;
							translateX = 0;
						}
						return (
							<div
								key={index}
								className={`${style} w-[90%] h-[90%] sm:w-[80%] sm:h-[80%] cursor-pointer select-none ${blur}`}
								style={{
									zIndex: z,
									opacity,
									transform: `translate(-50%, 0) scale(${scale}) translateX(${translateX}px)`,
								}}
								onClick={() => handleSlideClick(index)}>
								<div className='relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-900/80'>
									<Image
										src={slide.src}
										alt={slide.title}
										className='w-full h-full object-cover object-center transition-all duration-500'
										width={800}
										height={600}
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end items-center p-6'>
										<h2 className='text-lg md:text-3xl font-bold text-white mb-4 drop-shadow-lg'>
											{slide.title}
										</h2>
										<p className='text-sm md:text-base text-white mb-4 drop-shadow-lg w-full text-wrap text-center'>
											{slide.description}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<button
					className='absolute right-2 top-1/2 -translate-y-1/2 z-100 bg-white/70 dark:bg-neutral-900/70 shadow-lg rounded-full p-1 sm:p-2 hover:bg-white hover:scale-110 transition border border-neutral-200 dark:border-neutral-700 backdrop-blur '
					onClick={handleNextClick}
					title='Next'>
					<IconChevronRight className='w-7 h-7 text-black dark:text-white' />
				</button>
			</div>
		);
	}

	// Old style carousel with drag/swipe support
	return (
		<div
			className='relative w-[70vmin] h-[70vmin] mx-auto'
			aria-labelledby={`carousel-heading-${id}`}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}>
			<ul
				className='absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out cursor-grab select-none'
				style={{
					transform: `translateX(-${current * (100 / slides.length)}%)`,
				}}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerCancel}
				onPointerLeave={handlePointerCancel}>
				{slides.map((slide, index) => (
					<Slide
						key={index}
						slide={slide}
						index={index}
						current={current}
						handleSlideClick={handleSlideClick}
					/>
				))}
			</ul>
			<div className='absolute flex justify-center w-full top-[calc(100%+1rem)]'>
				<CarouselControl
					type='previous'
					title='Go to previous slide'
					handleClick={handlePreviousClick}
				/>
				<CarouselControl
					type='next'
					title='Go to next slide'
					handleClick={handleNextClick}
				/>
			</div>
		</div>
	);
}
