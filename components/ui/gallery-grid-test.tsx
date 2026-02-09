import React from "react";

export interface GalleryItem {
title: string;
description: string;
url: string;
width: number;
height: number;
}

interface ApiPost {
id: string;
title: string;
description: string;
imageUrl?: string;
width?: number;
height?: number;
categoryId: string;
images?: Array<{
id: string;
imageUrl: string;
publicId: string;
order: number;
}>;
productTypeId?: string;
}

export function GalleryGridTest({ items = [] }: { items: ApiPost[] | GalleryItem[] }) {
console.log("GalleryGridTest received items:", items.length, items);

return (
<section className='py-8'>
<div className='p-4 bg-blue-100 text-sm mb-4'>
Debug: GalleryGridTest rendering {items.length} posts
</div>
{items.length > 0 ? (
<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
{items.map((item, idx) => (
<div key={idx} className='border border-gray-300 rounded-lg p-4'>
<h3 className='font-bold'>{item.title}</h3>
<p className='text-sm text-gray-600'>{item.description}</p>
<div className='mt-2 text-xs text-gray-500'>
Type: {"url" in item ? "GalleryItem" : "ApiPost"}
<br />
Product Type: {"productTypeId" in item ? item.productTypeId : "N/A"}
<br />
Images: {"images" in item && item.images ? item.images.length : 0}
</div>
</div>
))}
</div>
) : (
<div className='text-center py-8 text-gray-500'>
No posts to display
</div>
)}
</section>
);
}
