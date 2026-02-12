"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { PremiumProgressBar } from "@/components/ui/premium-loader";

export default function NavigationLoader() {
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const pathname = usePathname();

	useEffect(() => {
		setIsLoading(false);
		setProgress(0);
	}, [pathname]);

	useEffect(() => {
		// Listen for navigation events
		if (typeof window !== "undefined") {
			// For client-side navigation, listen to link clicks
			const handleLinkClick = (e: Event) => {
				const target = e.target as HTMLElement;
				const link = target.tagName === "A" ? target as HTMLAnchorElement : target.closest("a");
				
				if (link && link.href && link.href !== window.location.href) {
					setIsLoading(true);
					setProgress(0);
					
					// Simulate progress animation
					const progressInterval = setInterval(() => {
						setProgress((prev) => {
							if (prev >= 90) {
								clearInterval(progressInterval);
								return 90;
							}
							return prev + Math.random() * 30;
						});
					}, 100);

					// Complete the progress after navigation
					setTimeout(() => {
						setProgress(100);
						setTimeout(() => {
							setIsLoading(false);
							setProgress(0);
						}, 200);
					}, 800);
				}
			};

			document.addEventListener("click", handleLinkClick);

			return () => {
				document.removeEventListener("click", handleLinkClick);
			};
		}
	}, []);

	return (
		<AnimatePresence mode="wait">
			{isLoading && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
					className="fixed top-0 left-0 right-0 z-[9999]"
				>
					<PremiumProgressBar progress={progress} />
				</motion.div>
			)}
		</AnimatePresence>
	);
}
