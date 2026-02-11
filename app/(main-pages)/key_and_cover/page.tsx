"use client";
import React from "react";
import Featured from "@/components/content/Featured";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryGridSingle } from "@/components/ui/gallery-grid";

const page = () => {
	return (
		<div className='w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center'>
			<PageHero
				title='Key & Cover'
				headline='Crafted for Comfort, Built for Guests'
				description='Discover secure, stylish key cards and covers designed to elevate every guest experience with timeless elegance.'
			/>
			<div className='w-full max-w-6xl mt-16 mb-12 px-4'>
				<Featured
					categoryId='key_and_cover'
					label='Featured'
					highlight='Key & Cover'
				/>
			</div>
			<div className='w-full max-w-6xl mt-12 mb-24 px-4'>
				<GalleryGridSingle categoryId='key_and_cover' />
			</div>
		</div>
	);
};

export default page;
