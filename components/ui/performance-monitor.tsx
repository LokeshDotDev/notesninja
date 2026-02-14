"use client";

import { useEffect, useState } from "react";

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run in development or when monitoring is enabled
    if (process.env.NODE_ENV !== 'development' && !localStorage.getItem('enable-perf-monitor')) {
      return;
    }

    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        const ttfb = navigation.responseStart - navigation.requestStart;

        // Observe LCP
        let lcp = 0;
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = lastEntry.startTime;
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Observe CLS
        let cls = 0;
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
                cls += (entry as PerformanceEntry & { value?: number }).value || 0;
              }
            }
          });
          observer.observe({ entryTypes: ['layout-shift'] });
        }

        // Observe FID
        let fid = 0;
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              fid = (entry as PerformanceEntry & { processingStart?: number }).processingStart ? (entry as PerformanceEntry & { processingStart?: number }).processingStart! - entry.startTime : 0;
            }
          });
          observer.observe({ entryTypes: ['first-input'] });
        }

        setTimeout(() => {
          setMetrics({
            fcp: Math.round(fcp),
            lcp: Math.round(lcp),
            fid: Math.round(fid),
            cls: Math.round(cls * 1000) / 1000,
            ttfb: Math.round(ttfb)
          });
        }, 3000);
      }
    };

    measurePerformance();
  }, []);

  if (!metrics) return null;

  const getScoreColor = (value: number, type: keyof Omit<PerformanceMetrics, 'ttfb'>) => {
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[type];
    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTtfbColor = (ttfb: number) => {
    if (ttfb <= 800) return 'text-green-600';
    if (ttfb <= 1800) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-900 text-white p-2 rounded-lg shadow-lg text-xs hover:bg-gray-800"
      >
        🚀 {isVisible ? 'Hide' : 'Show'} Metrics
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-64 text-xs">
          <h3 className="font-bold mb-3 text-gray-900">Performance Metrics</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>FCP:</span>
              <span className={getScoreColor(metrics.fcp, 'fcp')}>{metrics.fcp}ms</span>
            </div>
            <div className="flex justify-between">
              <span>LCP:</span>
              <span className={getScoreColor(metrics.lcp, 'lcp')}>{metrics.lcp}ms</span>
            </div>
            <div className="flex justify-between">
              <span>FID:</span>
              <span className={getScoreColor(metrics.fid, 'fid')}>{metrics.fid}ms</span>
            </div>
            <div className="flex justify-between">
              <span>CLS:</span>
              <span className={getScoreColor(metrics.cls, 'cls')}>{metrics.cls}</span>
            </div>
            <div className="flex justify-between">
              <span>TTFB:</span>
              <span className={getTtfbColor(metrics.ttfb)}>{metrics.ttfb}ms</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-gray-500 text-xs">
              Green: Good | Yellow: Needs Improvement | Red: Poor
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
