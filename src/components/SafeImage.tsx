import React, { useState, useEffect } from 'react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackCategory?: 'basreng' | 'seblak' | 'beverage' | 'general';
  aspectRatio?: '16/10' | '4/3' | '1/1' | 'auto';
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onClick?: () => void;
}

const FALLBACK_IMAGES = {
  basreng: '/basreng-stik-pedas-daun-jeruk.jpg',
  seblak: '/seblak-cobek-rafael.jpg',
  beverage: '/thai-tea-powder-authentic.jpg',
  general: '/latiao-strip-main.jpg',
};

const SECONDARY_FALLBACKS = {
  basreng: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
  seblak: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  beverage: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
  general: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
};

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  imageClassName = '',
  fallbackCategory = 'general',
  aspectRatio = 'auto',
  loading = 'lazy',
  priority = false,
  onClick,
}) => {
  const primaryFallback = FALLBACK_IMAGES[fallbackCategory] || FALLBACK_IMAGES.general;
  const secondaryFallback = SECONDARY_FALLBACKS[fallbackCategory] || SECONDARY_FALLBACKS.general;

  const initialSrc = src && src.trim() !== '' ? src : primaryFallback;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [fallbackAttempt, setFallbackAttempt] = useState<number>(0);

  // Sync if prop src changes
  useEffect(() => {
    if (src && src.trim() !== '') {
      setCurrentSrc(src);
      setIsLoaded(false);
      setFallbackAttempt(0);
    } else {
      setCurrentSrc(primaryFallback);
      setIsLoaded(true);
    }
  }, [src, primaryFallback]);

  const handleError = () => {
    if (fallbackAttempt === 0) {
      setFallbackAttempt(1);
      setCurrentSrc(primaryFallback);
    } else if (fallbackAttempt === 1) {
      setFallbackAttempt(2);
      setCurrentSrc(secondaryFallback);
    } else {
      setIsLoaded(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const aspectClass =
    aspectRatio === '16/10'
      ? 'aspect-[16/10]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : '';

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-[#F0E8DC] ${aspectClass} ${className}`}
    >
      {/* Warm Golden Cream Skeleton Loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EADDCC]/70 via-[#F8F5EF] to-[#EADDCC]/70 animate-pulse z-0" />
      )}

      {/* Actual Image with smooth fade-in */}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imageClassName}`}
      />
    </div>
  );
};
