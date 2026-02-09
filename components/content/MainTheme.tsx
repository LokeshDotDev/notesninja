import { BlurFade } from "@/components/magicui/blur-fade";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const furniture = [
	{
		title: "Modern Sofa",
		description:
			"A comfortable modern sofa with plush cushions and a sleek design.",
		url: "https://picsum.photos/seed/sofa/800/600",
		width: 800,
		height: 600,
	},
	{
		title: "Classic Armchair",
		description:
			"A timeless armchair perfect for reading nooks and cozy corners. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, ratione ipsa autem eius quam delectus labore corrupti facere veniam aperiam quidem, molestiae enim nobis recusandae sit esse soluta unde minima? Perspiciatis cum iusto porro veritatis harum iure eius atque totam aliquam aperiam consequatur blanditiis, aspernatur maxime fuga molestiae quod delectus incidunt aut, possimus quidem unde eaque natus. Molestiae, tempore modi?A timeless armchair perfect for reading nooks and cozy corners. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, ratione ipsa autem eius quam delectus labore corrupti facere veniam aperiam quidem, molestiae enim nobis recusandae sit esse soluta unde minima? Perspiciatis cum iusto porro veritatis harum iure eius atque totam aliquam aperiam consequatur blanditiis, aspernatur maxime fuga molestiae quod delectus incidunt aut, possimus quidem unde eaque natus. Molestiae, tempore modi?A timeless armchair perfect for reading nooks and cozy corners. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, ratione ipsa autem eius quam delectus labore corrupti facere veniam aperiam quidem, molestiae enim nobis recusandae sit esse soluta unde minima? Perspiciatis cum iusto porro veritatis harum iure eius atque totam aliquam aperiam consequatur blanditiis, aspernatur maxime fuga molestiae quod delectus incidunt aut, possimus quidem unde eaque natus. Molestiae, tempore modi?A timeless armchair perfect for reading nooks and cozy corners. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, ratione ipsa autem eius quam delectus labore corrupti facere veniam aperiam quidem, molestiae enim nobis recusandae sit esse soluta unde minima? Perspiciatis cum iusto porro veritatis harum iure eius atque totam aliquam aperiam consequatur blanditiis, aspernatur maxime fuga molestiae quod delectus incidunt aut, possimus quidem unde eaque natus. Molestiae, tempore modi?A timeless armchair perfect for reading nooks and cozy corners. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, ratione ipsa autem eius quam delectus labore corrupti facere veniam aperiam quidem, molestiae enim nobis recusandae sit esse soluta unde minima? Perspiciatis cum iusto porro veritatis harum iure eius atque totam aliquam aperiam consequatur blanditiis, aspernatur maxime fuga molestiae quod delectus incidunt aut, possimus quidem unde eaque natus. Molestiae, tempore modi?A timeless armchair perfect for reading nooks and cozy corners. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, ratione ipsa autem eius quam delectus labore corrupti facere veniam aperiam quidem, molestiae enim nobis recusandae sit esse soluta unde minima? Perspiciatis cum iusto porro veritatis harum iure eius atque totam aliquam aperiam consequatur blanditiis, aspernatur maxime fuga molestiae quod delectus incidunt aut, possimus quidem unde eaque natus. Molestiae, tempore modi?A timeless armchair perfect for reading nooks and cozy corners. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, ratione ipsa autem eius quam delectus labore corrupti facere veniam aperiam quidem, molestiae enim nobis recusandae sit esse soluta unde minima? Perspiciatis cum iusto porro veritatis harum iure eius atque totam aliquam aperiam consequatur blanditiis, aspernatur maxime fuga molestiae quod delectus incidunt aut, possimus quidem unde eaque natus. Molestiae, tempore modi?A timeless armchair perfect for reading nooks and cozy corners. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui, ratione ipsa autem eius quam delectus labore corrupti facere veniam aperiam quidem, molestiae enim nobis recusandae sit esse soluta unde minima? Perspiciatis cum iusto porro veritatis harum iure eius atque totam aliquam aperiam consequatur blanditiis, aspernatur maxime fuga molestiae quod delectus incidunt aut, possimus quidem unde eaque natus. Molestiae, tempore modi?",
		url: "https://picsum.photos/seed/armchair/600/800",
		width: 600,
		height: 800,
	},
	{
		title: "Wooden Dining Table",
		description: "A sturdy wooden dining table that seats six comfortably.",
		url: "https://picsum.photos/seed/table/800/600",
		width: 800,
		height: 600,
	},
	{
		title: "Minimalist Bed Frame",
		description: "A minimalist bed frame with a strong build and modern look.",
		url: "https://picsum.photos/seed/bed/800/600",
		width: 800,
		height: 600,
	},
	{
		title: "Elegant Bookshelf",
		description:
			"An elegant bookshelf to display your favorite books and decor.",
		url: "https://picsum.photos/seed/bookshelf/600/800",
		width: 600,
		height: 800,
	},
	{
		title: "Comfy Recliner",
		description: "A comfy recliner chair for ultimate relaxation.",
		url: "https://picsum.photos/seed/recliner/800/600",
		width: 800,
		height: 600,
	},
];

export default function MainTheme() {
	const [openIdx, setOpenIdx] = useState<number | null>(null);

	React.useEffect(() => {
		if (openIdx !== null) {
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "";
			};
		} else {
			document.body.style.overflow = "";
		}
	}, [openIdx]);

	const handleModalClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (e.target === e.currentTarget) {
			setOpenIdx(null);
		}
	};

	const handlePrev = (e: React.MouseEvent) => {
		e.stopPropagation();
		setOpenIdx((prev) =>
			prev !== null ? (prev - 1 + furniture.length) % furniture.length : null
		);
	};

	const handleNext = (e: React.MouseEvent) => {
		e.stopPropagation();
		setOpenIdx((prev) =>
			prev !== null ? (prev + 1) % furniture.length : null
		);
	};

	return (
		<section id='photos' className='py-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{furniture.map((item, idx) => (
					<BlurFade key={item.url} delay={0.25 + idx * 0.05} inView>
						<motion.div
							whileHover={{
								scale: 1.05,
								boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
							}}
							transition={{ duration: 0.3 }}
							className='relative group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700'
							onClick={() => setOpenIdx(idx)}>
							<Image
								className='rounded-xl object-cover w-full h-72 transition-transform duration-500 group-hover:scale-110'
								src={item.url}
								alt={item.title}
								width={item.width}
								height={item.height}
								priority={idx < 3}
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end'>
								<div className='p-4 w-full'>
									<h3 className='text-lg font-bold text-white'>{item.title}</h3>
									<p className='text-sm text-neutral-200 line-clamp-2'>
										{item.description}
									</p>
								</div>
							</div>
						</motion.div>
					</BlurFade>
				))}
			</div>

			{/* Modal for fullscreen pop-up */}
			<AnimatePresence>
				{openIdx !== null && (
					<motion.div
						key='modal-bg'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-lg'
						onClick={handleModalClick}>
						<motion.button
							initial={{ x: -40, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -40, opacity: 0 }}
							transition={{ duration: 0.2, delay: 0.1 }}
							className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 dark:bg-neutral-800/50 text-white dark:text-neutral-200 rounded-full p-3 hover:bg-white/30 dark:hover:bg-neutral-700/50 transition shadow-lg'
							onClick={handlePrev}
							aria-label='Previous furniture'>
							←
						</motion.button>

						<motion.div
							key='modal-content'
							initial={{ scale: 0.98, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.98, opacity: 0, y: 20 }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 30,
								duration: 0.35,
							}}
							className='relative flex flex-col lg:flex-row items-start bg-gradient-to-br from-neutral-100/50 to-neutral-300/40 dark:from-neutral-900/90 dark:to-black/90 rounded-2xl max-w-6xl w-full mx-4 p-6 lg:p-8 min-h-[60vh] max-h-[90vh] gap-6 lg:gap-8 shadow-2xl'>
							{/* Close Button (Cross) */}
							<button
								className='absolute top-4 right-4 text-white dark:text-neutral-200 rounded-full p-2 hover:bg-white/20 dark:hover:bg-neutral-700/50 transition'
								onClick={(e) => {
									e.stopPropagation();
									setOpenIdx(null);
								}}
								aria-label='Close modal'>
								✕
							</button>

							{/* Image Section */}
							<div className='w-full lg:w-1/2 flex items-center justify-center'>
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.2 }}>
									<Image
										className='rounded-lg object-cover w-full max-h-[50vh] lg:max-h-[70vh] shadow-lg border border-neutral-700/50'
										src={furniture[openIdx].url}
										alt={furniture[openIdx].title}
										width={furniture[openIdx].width}
										height={furniture[openIdx].height}
										priority
									/>
								</motion.div>
							</div>

							{/* Text Section */}
							<div className='w-full lg:w-1/2 flex flex-col justify-center text-white dark:text-neutral-200'>
								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.3 }}
									className='text-3xl lg:text-4xl font-bold mb-4'>
									{furniture[openIdx].title}
								</motion.h2>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.4 }}
									className='relative max-h-[40vh] lg:max-h-[60vh] overflow-y-auto text-lg lg:text-xl text-white dark:text-neutral-400 leading-relaxed pr-4 custom-scrollbar'>
									{/* Content */}
									<div>
										<p className='whitespace-pre-line'>
											{furniture[openIdx].description}
										</p>
									</div>
								</motion.div>
							</div>
						</motion.div>

						<motion.button
							initial={{ x: 40, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 40, opacity: 0 }}
							transition={{ duration: 0.2, delay: 0.1 }}
							className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 dark:bg-neutral-800/50 text-white dark:text-neutral-200 rounded-full p-3 hover:bg-white/30 dark:hover:bg-neutral-700/50 transition shadow-lg'
							onClick={handleNext}
							aria-label='Next furniture'>
							→
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Custom scrollbar styles for modal description */}
			<style jsx global>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 10px;
					background: transparent;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: #fff;
					border-radius: 8px;
					min-height: 40px;
					border: 2px solid transparent;
					background-clip: padding-box;
					box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7);
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #fff;
					box-shadow: 0 0 0 2px #fff;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
					border-radius: 8px;
				}
				.custom-scrollbar {
					scrollbar-width: thin;
					scrollbar-color: #fff transparent;
				}
			`}</style>
		</section>
	);
}

// This component is now redundant and can be safely removed since GalleryGrid is used directly in all main pages.
