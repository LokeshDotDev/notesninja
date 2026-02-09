"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationLoader() {
	const [isLoading, setIsLoading] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setIsLoading(false);
	}, [pathname]);

	useEffect(() => {
		// Listen for navigation events
		if (typeof window !== "undefined") {
			// For client-side navigation, listen to link clicks
			const handleLinkClick = (e: Event) => {
				const target = e.target as HTMLElement;
				if (target.tagName === "A" || target.closest("a")) {
					setIsLoading(true);
					setTimeout(() => setIsLoading(false), 1500); // Auto-clear after 1.5s
				}
			};

			document.addEventListener("click", handleLinkClick);

			return () => {
				document.removeEventListener("click", handleLinkClick);
			};
		}
	}, []);

	if (!isLoading) return null;

	return (
		<div className='fixed top-0 left-0 w-full h-1 z-[9999]'>
			<div className='h-full bg-gradient-to-r from-blue-500 to-green-500 animate-pulse'></div>
		</div>
	);
}
