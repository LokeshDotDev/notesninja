"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Image from "next/image";

export default function Showcase() {
	const cards = data.map((card, index) => (
		<Card key={card.src} card={card} index={index} />
	));

	return (
		<div className='w-full h-full py-20'>
			<h2 className='max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans'>
				Where Comfort Meets Function
			</h2>
			<Carousel items={cards} />
		</div>
	);
}

const data = [
	{
		category: "Metal Frame Beds",
		title: "Discover our premium collection of metal frame beds.",
		src: "/assets/Metal_frame_bed.jpg",
		content: (
			<div className='bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4'>
				<p className='text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto'>
					At our business,
					<span className='font-bold text-neutral-700 dark:text-neutral-200'>
						we specialize in crafting premium metal frame beds
					</span>{" "}
					that combine durability with modern elegance. Each bed is designed to
					provide sturdy support and timeless style, ensuring a perfect blend of
					comfort and sophistication for your bedroom. Elevate your sleep
					experience with our expertly engineered metal frame beds, built to
					last and impress.
				</p>
				<Image
					src='/assets/Metal_frame_bed.jpg'
					alt='Macbook mockup from Aceternity UI'
					height='500'
					width='500'
					className='md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain'
				/>
			</div>
		),
	},
	{
		category: "Furnitures",
		title: "Explore our elegant furniture collection.",
		src: "/assets/combo_Dark.jpg",
		content: (
			<div className='bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4'>
				<p className='text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto'>
					At our business,
					<span className='font-bold text-neutral-700 dark:text-neutral-200'>
						we offer a stunning range of furniture
					</span>{" "}
					, expertly crafted to enhance any space with style and functionality.
					From sleek desks to versatile shelves, each piece is designed with
					durable metal frames and rich wood finishes, ensuring lasting quality
					and modern appeal. Elevate your home or motel with our furniture,
					built for both beauty and practicality.
				</p>
				<Image
					src='/assets/004 La-Quinta Double Bedroom_001.jpg'
					alt='Macbook mockup from Aceternity UI'
					height='500'
					width='500'
					className='md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain'
				/>
			</div>
		),
	},
	{
		category: "Lights and Plugs",
		title: "Illuminate your space with our stylish lights and plugs.",
		src: "/assets/Screenshot_20250424_130415_Alibabacom.jpg",
		content: (
			<div className='bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4'>
				<p className='text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto'>
					At our business,
					<span className='font-bold text-neutral-700 dark:text-neutral-200'>
						we provide top-quality lighting and power
					</span>{" "}
					solutions tailored for motels, ensuring both functionality and
					ambiance. From modern wall lights that create a warm, inviting glow to
					power strips with USB ports for guest convenience, our products are
					designed for reliability and style. Illuminate and energize your motel
					spaces with our expertly crafted essentials, perfect for enhancing
					guest experiences.
				</p>
				<Image
					src='/assets/Screenshot_20250424_130225_Alibabacom.jpg'
					alt='Macbook mockup from Aceternity UI'
					height='500'
					width='500'
					className='md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mb-10 rounded-lg shadow-lg'
				/>
				<Image
					src='/assets/81FM876BVXL._AC_UF1000,1000_QL80_FMwebp_.jpg'
					alt='Macbook mockup from Aceternity UI'
					height='500'
					width='500'
					className='md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mb-10 rounded-lg shadow-lg'
				/>
				<Image
					src='/assets/Screenshot_20250424_130415_Alibabacom.jpg'
					alt='Macbook mockup from Aceternity UI'
					height='500'
					width='500'
					className='md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mb-10 rounded-lg shadow-lg'
				/>
			</div>
		),
	},

	{
		category: "Rooms furnishing",
		title: "Transform your rooms with our furnishing solutions.",
		src: "/assets/1.jpg",
		content: (
			<div className='bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4'>
				<p className='text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto'>
					Transform your rooms{" "}
					<span className='font-bold text-neutral-700 dark:text-neutral-200'>
						with our comprehensive furnishing solutions
					</span>{" "}
					, featuring sleek metal frame beds, modern furniture, and stylish
					lighting and power options. Designed for durability and elegance, our
					products bring comfort, functionality, and a touch of sophistication
					to any space, perfect for motels or homes. Create inviting, practical
					rooms that leave a lasting impression.
				</p>
				<Image
					src='/assets/003 Red Roof Plus king_003.jpg'
					alt='Macbook mockup from Aceternity UI'
					height='500'
					width='500'
					className='md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mb-10 rounded-lg shadow-lg'
				/>
				<Image
					src='/assets/006 Sure Stay King_001.jpg'
					alt='Macbook mockup from Aceternity UI'
					height='500'
					width='500'
					className='md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mb-10 rounded-lg shadow-lg'
				/>
			</div>
		),
	},
];
