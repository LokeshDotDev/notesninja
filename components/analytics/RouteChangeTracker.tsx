"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackGA4Event, trackMetaEvent } from "@/lib/analytics";

export default function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = searchParams?.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;

    trackGA4Event("page_view", {
      page_location: window.location.href,
      page_path: pagePath,
      page_referrer: document.referrer || undefined,
    });

    trackMetaEvent("PageView");
  }, [pathname, searchParams]);

  return null;
}
