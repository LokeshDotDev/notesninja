"use client";
import React, { useEffect, useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryGrid, GalleryItem } from "@/components/ui/gallery-grid";

export default function SafetyAndAccessPage() {
	const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

	useEffect(() => {
		async function fetchData() {
			const galleryRes = await Promise.all([
				fetch("/api/posts?category=key_and_cover").then((r) => r.json()),
				fetch("/api/posts?category=motel_sign_board").then((r) => r.json()),
			]);
			const merged = [...galleryRes[0], ...galleryRes[1]];
			// Optionally sort by createdAt or title if available
			// merged.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
			setGalleryItems(merged);
			console.log("Merged gallery items:", merged);
		}
		fetchData();
	}, []);

	return (
		<div className='w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center'>
			<PageHero
				title='Safety & Access'
				headline='Secure, Modern Solutions for Hospitality Safety & Access'
				description='Explore our range of smart key cards, covers, and sign boards designed for secure, stylish, and efficient hospitality operations.'
			/>
			{/* <div className=\"w-full max-w-6xl mt-16 mb-12 px-4\">
				<Featured label=\"Featured\" highlight=\"Safety & Access\" items={featuredItems} loading={loading} />
			</div> */}
			<div className='w-full max-w-6xl mt-16 mb-24 px-4'>
				<GalleryGrid items={galleryItems} />
			</div>
		</div>
	);
}
