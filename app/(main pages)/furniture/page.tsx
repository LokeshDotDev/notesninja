"use client";
// import Featured from "@/components/content/Featured";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryGridSingle } from "@/components/ui/gallery-grid";
import React from "react";

const Page = () => {
	return (
		<div className='w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center'>
			<PageHero
				title='Hotel & Motel Furniture'
				headline='Commercial-Grade Comfort, Built for American Hospitality'
				description='Discover stylish, durable furniture specifically designed for US motels and hotels. Our hospitality furniture enhances guest experiences while withstanding the demands of commercial use.'
			/>
			{/* <div className='w-full max-w-6xl mt-16 mb-12 px-4'>
				<Featured
					categoryId='furniture'
					label='Featured'
					highlight='Furniture'
				/>
			</div> */}
			<div className='w-full max-w-6xl mt-12 mb-24 px-4'>
				<GalleryGridSingle categoryId='furniture' />
			</div>
		</div>
	);
};

export default Page;
