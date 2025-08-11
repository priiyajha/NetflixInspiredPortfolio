import { useState } from "react";

interface OptimizedProfileImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Highly optimized profile image component to fix the 2MB headshot issue
 * This addresses the critical PageSpeed issue where farooq-headshot.png was 2MB for 20x25px display
 */
export default function OptimizedProfileImage({
  src,
  alt,
  className = "",
  style = {}
}: OptimizedProfileImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate multiple sizes for different pixel densities
  const sizes = "25px"; // Actual display size
  const srcSet = [
    `${src}?w=25&h=30&q=85 1x`, // Standard density (25x30px)
    `${src}?w=50&h=60&q=85 2x`, // Retina density (50x60px)
    `${src}?w=75&h=90&q=85 3x`  // High DPI (75x90px)
  ].join(', ');

  return (
    <div className="relative inline-block">
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse rounded-full"
          style={style}
        />
      )}
      
      <img
        src={`${src}?w=50&h=60&q=85&f=webp`} // Fallback with WebP optimization
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{
          ...style,
          width: '25px',
          height: '30px',
          objectFit: 'cover'
        }}
        loading="eager" // Profile image should load immediately
        decoding="async"
        fetchPriority="high"
        draggable={false}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-xs"
          style={style}
        >
          ?
        </div>
      )}
    </div>
  );
}