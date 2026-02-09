"use client";
import React, { useEffect, useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryGridCombined, GalleryItem } from "@/components/ui/gallery-grid";

export default function CeramicAndCurtainsPage() {

	const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

	useEffect(() => {
		async function fetchData() {
			const galleryRes = await Promise.all([
				fetch("/api/posts?category=ceramic").then((r) => r.json()),
				fetch("/api/posts?category=curtain").then((r) => r.json()),
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
				title='Ceramic & Curtains'
				headline='Elegant Ceramics & Curtains for Modern Hospitality'
				description='Discover stylish, durable ceramics and elegant curtains designed to elevate every guest experience with timeless elegance.'
			/>
			{/* <div className=\"w-full max-w-6xl mt-16 mb-12 px-4\">
				<Featured label=\"Featured\" highlight=\"Ceramic & Curtains\" items={featuredItems} loading={loading} />
			</div> */}
			<div className='w-full max-w-6xl mt-16 mb-24 px-4'>
				<GalleryGridCombined items={galleryItems} />
			</div>
			{/* <div className='w-full max-w-6xl mt-4 mb-24 px-4 bg-white text-black rounded shadow p-4'>
				<h3>Debug: Merged Gallery Items</h3>
				<pre style={{ maxHeight: 300, overflow: "auto", fontSize: 12 }}>
					{JSON.stringify(galleryItems, null, 2)}
				</pre>
			</div> */}
		</div>
	);
}
