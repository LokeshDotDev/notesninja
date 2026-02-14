"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GoogleAnalytics({ ga_id }: { ga_id: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!ga_id || typeof window.gtag !== "function") return;

    window.gtag("config", ga_id, {
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname, ga_id]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${ga_id}');
        `}
      </Script>
    </>
  );
}
