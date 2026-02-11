"use client";
import React from "react";
// import Featured from "@/components/content/Featured";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryGridSingle } from "@/components/ui/gallery-grid";

const CeramicPage = () => {
	return (
		<div className='w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center'>
			<PageHero
				title='Ceramic'
				headline='Ceramic headline'
				description='Discover stylish, durable ceramics designed to elevate every guest experience with timeless elegance.'
			/>
			{/* <div className="w-full max-w-6xl mt-16 mb-12 px-4">
        <Featured categoryId="ceramic" label="Featured" highlight="Ceramic" />
      </div> */}
			<div className='w-full max-w-6xl mt-12 mb-24 px-4'>
				<GalleryGridSingle categoryId='ceramic' />
			</div>
		</div>
	);
};

export default CeramicPage;
