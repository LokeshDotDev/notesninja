// Example: You can import and use GalleryGrid in any main page like this:
import { GalleryGrid, GalleryItem } from "@/components/ui/gallery-grid";

const items: GalleryItem[] = [
	// ...your data here (title, description, url, width, height)
];

export default function MyPage() {
	return <GalleryGrid items={items} />;
}
