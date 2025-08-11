import { useEffect } from 'react';

/**
 * Performance monitoring hook to track Core Web Vitals and optimize accordingly
 */
export const usePerformanceObserver = () => {
  useEffect(() => {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry.startTime > 2500) {
          console.warn('LCP is slow:', lastEntry.startTime, 'ms. Consider optimizing images.');
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        if (clsValue > 0.1) {
          console.warn('CLS is high:', clsValue, '. Consider adding explicit dimensions to images.');
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Monitor First Input Delay (FID) / Interaction to Next Paint (INP)
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.processingStart - entry.startTime > 100) {
            console.warn('Slow interaction detected:', entry.processingStart - entry.startTime, 'ms');
          }
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });

      return () => {
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    }
  }, []);
};

/**
 * Hook to preload critical resources above the fold
 */
export const useResourcePreloader = (criticalImages: string[]) => {
  useEffect(() => {
    // Preload critical images that are above the fold
    criticalImages.slice(0, 3).forEach((src, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `${src}?w=276&q=85&f=webp`;
      link.fetchPriority = index < 2 ? 'high' : 'low';
      document.head.appendChild(link);
    });
  }, [criticalImages]);
};

/**
 * Hook to optimize video loading based on connection speed
 */
export const useVideoOptimization = () => {
  useEffect(() => {
    // Check network information if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
      
      if (isSlowConnection) {
        // Disable autoplay videos on slow connections
        document.querySelectorAll('video[autoplay]').forEach((video: any) => {
          video.removeAttribute('autoplay');
          video.preload = 'none';
        });
      }
    }
  }, []);
};