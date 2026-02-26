"use client";

import dynamic from "next/dynamic";

// Lazy load all client-side only components
const GoogleAnalytics = dynamic(() => import("@/components/analytics/GoogleAnalytics"));
const VisitorTracker = dynamic(() => import("@/components/analytics/GoogleAnalytics"));
const MetaPixel = dynamic(() => import("@/components/analytics/MetaPixel"));
const RouteChangeTracker = dynamic(() => import("@/components/analytics/RouteChangeTracker"));
const PerformanceMonitor = dynamic(() => import("@/components/custom/PerformanceMonitor"));
const NavigationLoader = dynamic(() => import("@/components/custom/NavigationLoader"));
const WhatsAppChat = dynamic(() => import("@/components/ui/WhatsAppChat").then(mod => ({ default: mod.WhatsAppChat })));

interface ClientOnlyComponentsProps {
  ga_id: string;
}

export default function ClientOnlyComponents({ ga_id }: ClientOnlyComponentsProps) {
  return (
    <>
      <GoogleAnalytics ga_id={ga_id} />
      <VisitorTracker ga_id={ga_id} />
      <MetaPixel />
      <RouteChangeTracker />
      <PerformanceMonitor />
      <NavigationLoader />
      <WhatsAppChat />
    </>
  );
}
