// Image optimization utilities to address PageSpeed performance issues

/**
 * Get optimized image sizes based on display context
 */
export const getOptimizedImageSizes = (context: 'thumbnail' | 'hero' | 'modal' | 'profile') => {
  switch (context) {
    case 'thumbnail':
      // Project thumbnails displayed at 176x117px
      return {
        width: 176,
        height: 117,
        sizes: "(max-width: 768px) 240px, (max-width: 1024px) 252px, (max-width: 1280px) 276px, 276px"
      };
    case 'hero':
      // Hero background video/image
      return {
        width: 1920,
        height: 1080,
        sizes: "100vw"
      };
    case 'modal':
      // Modal gallery images
      return {
        width: 800,
        height: 600,
        sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
      };
    case 'profile':
      // Profile headshot (critical optimization needed - was 2MB for 20x25px display)
      return {
        width: 40, // Double the display size for retina
        height: 50,
        sizes: "25px" // Actual display size is 20x25px
      };
    default:
      return {
        width: 400,
        height: 300,
        sizes: "400px"
      };
  }
};

/**
 * Generate optimized srcset for responsive images
 */
export const generateSrcSet = (baseSrc: string, widths: number[]) => {
  return widths
    .map(width => `${baseSrc}?w=${width} ${width}w`)
    .join(', ');
};

/**
 * Create optimized image URL with compression and format hints
 */
export const optimizeImageUrl = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg';
}) => {
  // For static assets, we'll add query parameters for optimization hints
  const url = new URL(src, window.location.origin);
  
  if (options.width) url.searchParams.set('w', options.width.toString());
  if (options.height) url.searchParams.set('h', options.height.toString());
  if (options.quality) url.searchParams.set('q', options.quality.toString());
  if (options.format) url.searchParams.set('f', options.format);
  
  return url.toString();
};

/**
 * Intersection Observer for lazy loading optimization
 */
export const createLazyLoadObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px', // Start loading 50px before visible
    threshold: 0.1
  });
};

/**
 * Preload critical images to improve LCP
 */
export const preloadCriticalImages = (imageSrcs: string[]) => {
  imageSrcs.forEach((src, index) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    if (index < 3) {
      link.setAttribute('fetchpriority', 'high');
    }
    document.head.appendChild(link);
  });
};

/**
 * Optimize images for mobile performance
 */
export const getMobileOptimizedImage = (src: string, displayWidth: number) => {
  // For mobile, use 2x pixel density but cap at reasonable size
  const optimizedWidth = Math.min(displayWidth * 2, 600);
  return optimizeImageUrl(src, {
    width: optimizedWidth,
    quality: 80,
    format: 'webp'
  });
};