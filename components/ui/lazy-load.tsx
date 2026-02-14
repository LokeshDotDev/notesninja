"use client";

import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

interface LazyLoadProps {
  loader: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>;
  fallback?: React.ReactNode;
  props?: Record<string, unknown>;
}

export function LazyLoad({ loader, fallback, props }: LazyLoadProps) {
  const LazyComponent = lazy(loader);

  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Example usage - uncomment and modify paths as needed
/*
export const LazyAdminDashboard = () => LazyLoad({
  loader: () => import("../../app/admin/page").then(mod => ({ default: mod.default }))
});

export const LazyCategoryPage = () => LazyLoad({
  loader: () => import("../../app/[category]/page").then(mod => ({ default: mod.default }))
});

export const LazyCheckout = () => LazyLoad({
  loader: () => import("../../app/checkout/[id]/page").then(mod => ({ default: mod.default }))
});
*/
