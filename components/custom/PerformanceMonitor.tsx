"use client";

import { useEffect } from "react";

export default function PerformanceMonitor() {
	useEffect(() => {
		// Monitor navigation performance
		const handleRouteChange = () => {
			if (typeof window !== "undefined" && "performance" in window) {
				const navigation = performance.getEntriesByType(
					"navigation"
				)[0] as PerformanceNavigationTiming;

				if (navigation) {
					const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
					const domContentLoaded =
						navigation.domContentLoadedEventEnd -
						navigation.domContentLoadedEventStart;

					// Only log if performance is poor (>2 seconds)
					if (loadTime > 2000) {
						console.warn("Slow page load detected:", {
							loadTime: `${loadTime}ms`,
							domContentLoaded: `${domContentLoaded}ms`,
							url: window.location.href,
						});
					}
				}
			}
		};

		// Initial load check
		if (typeof window !== "undefined" && document.readyState === "complete") {
			handleRouteChange();
		} else if (typeof window !== "undefined") {
			window.addEventListener("load", handleRouteChange);
		}

		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener("load", handleRouteChange);
			}
		};
	}, []);

	return null;
}
