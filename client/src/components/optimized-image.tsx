import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
  fetchpriority?: "high" | "low" | "auto";
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  draggable?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  style = {},
  loading = "lazy",
  fetchpriority = "auto",
  sizes,
  onLoad,
  onError,
  draggable = false
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Intersection Observer for lazy loading optimization
    if (loading === "lazy") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Start loading when image comes into view
              img.src = src;
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px", // Start loading 50px before image is visible
        }
      );

      observer.observe(img);
      return () => observer.unobserve(img);
    } else {
      // Load immediately for eager images
      img.src = src;
    }
  }, [src, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className="relative">
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center"
          style={style}
        >
          <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      <img
        ref={imgRef}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{
          ...style,
          aspectRatio: style.aspectRatio || 'auto'
        }}
        loading={loading}
        decoding="async"
        fetchPriority={fetchpriority}
        sizes={sizes}
        draggable={draggable}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-400 text-sm"
          style={style}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
}