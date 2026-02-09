"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function GoogleAnalytics({ ga_id }: { ga_id: string }) {
	useEffect(() => {
		async function trackVisitor() {
			try {
				// Get IP and location from a public API
				const res = await fetch("https://ipapi.co/json/");
				const data = await res.json();
				const ipAddress = data.ip;
				const location = `${data.city}, ${data.region}, ${data.country_name}`;
				await fetch("/api/analytics", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ipAddress, location }),
				});
			} catch {
				// Ignore errors
			}
		}
		trackVisitor();
	}, []);

	return (
		<>
			<Script
				strategy='afterInteractive'
				src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
			/>

			<Script
				id='google-analytics'
				strategy='afterInteractive'
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga_id}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
				}}
			/>
		</>
	);
}
