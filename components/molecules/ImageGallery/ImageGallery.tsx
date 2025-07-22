import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';

export interface ImageGalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface ImageGalleryProps {
  images: ImageGalleryImage[];
  alt?: string;
  
  // Display options
  variant?: 'default' | 'carousel' | 'grid' | 'stacked';
  orientation?: 'horizontal' | 'vertical';
  showThumbnails?: boolean;
  thumbnailPosition?: 'bottom' | 'left' | 'right';
  
  // Zoom options
  enableZoom?: boolean;
  zoomType?: 'hover' | 'click' | 'magnifier';
  zoomLevel?: number;
  
  // Navigation
  showArrows?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  
  // Visual options
  aspectRatio?: '1:1' | '4:3' | '16:9' | '9:16' | 'auto';
  objectFit?: 'contain' | 'cover' | 'fill';
  rounded?: boolean;
  
  // Badges
  badges?: Array<{
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'success';
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }>;
  
  // Callbacks
  onImageChange?: (index: number) => void;
  onImageClick?: (image: ImageGalleryImage, index: number) => void;
  onZoom?: (isZoomed: boolean) => void;
  
  // Styling
  className?: string;
  imageClassName?: string;
  thumbnailClassName?: string;
  
  'aria-label'?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt = 'Product image',
  variant = 'default',
  orientation = 'horizontal',
  showThumbnails = true,
  thumbnailPosition = 'bottom',
  enableZoom = true,
  zoomType = 'hover',
  zoomLevel = 2,
  showArrows = true,
  showDots = false,
  autoplay = false,
  autoplayInterval = 5000,
  loop = true,
  aspectRatio = '1:1',
  objectFit = 'contain',
  rounded = true,
  badges = [],
  onImageChange,
  onImageClick,
  onZoom,
  className,
  imageClassName,
  thumbnailClassName,
  'aria-label': ariaLabel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Handle image navigation
  const goToImage = (index: number) => {
    const newIndex = loop
      ? (index + images.length) % images.length
      : Math.max(0, Math.min(index, images.length - 1));
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      onImageChange?.(newIndex);
    }
  };

  const goToPrevious = () => goToImage(currentIndex - 1);
  const goToNext = () => goToImage(currentIndex + 1);

  // Autoplay
  useEffect(() => {
    if (autoplay && images.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, autoplayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, autoplayInterval, currentIndex, images.length]);

  // Handle zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || zoomType !== 'hover' || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleZoomToggle = () => {
    if (enableZoom && zoomType === 'click') {
      const newZoomState = !isZoomed;
      setIsZoomed(newZoomState);
      onZoom?.(newZoomState);
    }
  };

  const handleImageClick = () => {
    onImageClick?.(images[currentIndex], currentIndex);
    handleZoomToggle();
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-4/3',
    '16:9': 'aspect-video',
    '9:16': 'aspect-9/16',
    'auto': '',
  };

  // Thumbnail position classes
  const thumbnailPositionClasses = {
    bottom: 'flex-col',
    left: 'flex-row-reverse',
    right: 'flex-row',
  };

  const isVerticalThumbnails = thumbnailPosition === 'left' || thumbnailPosition === 'right';

  if (images.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-neutral-100 dark:bg-neutral-800',
        aspectRatioClasses[aspectRatio],
        rounded && 'rounded-lg',
        className
      )}>
        <Icon icon="image" size="lg" className="text-neutral-400" />
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div
      className={cn(
        'relative',
        variant === 'default' && showThumbnails && 'flex gap-4',
        variant === 'default' && thumbnailPositionClasses[thumbnailPosition],
        className
      )}
      aria-label={ariaLabel || `Image gallery with ${images.length} images`}
    >
      {/* Main Image */}
      <div
        ref={imageRef}
        className={cn(
          'relative overflow-hidden bg-neutral-100 dark:bg-neutral-800',
          aspectRatioClasses[aspectRatio],
          rounded && 'rounded-lg',
          enableZoom && zoomType === 'hover' && 'cursor-zoom-in',
          enableZoom && zoomType === 'click' && 'cursor-pointer',
          isZoomed && 'cursor-zoom-out',
          imageClassName
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          if (zoomType === 'hover') setIsZoomed(false);
        }}
        onMouseMove={handleMouseMove}
        onClick={handleImageClick}
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt || alt}
          className={cn(
            'w-full h-full transition-transform duration-300',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'fill' && 'object-fill',
            enableZoom && zoomType === 'hover' && isHovering && 'scale-150',
            isZoomed && 'scale-150'
          )}
          style={{
            transformOrigin: 
              enableZoom && (zoomType === 'hover' || isZoomed)
                ? `${mousePosition.x}% ${mousePosition.y}%`
                : 'center',
          }}
        />

        {/* Badges */}
        {badges.map((badge, index) => (
          <div
            key={index}
            className={cn(
              'absolute m-2',
              badge.position === 'top-left' && 'top-0 left-0',
              badge.position === 'top-right' && 'top-0 right-0',
              badge.position === 'bottom-left' && 'bottom-0 left-0',
              badge.position === 'bottom-right' && 'bottom-0 right-0'
            )}
          >
            <Badge variant={badge.variant}>{badge.text}</Badge>
          </div>
        ))}

        {/* Navigation Arrows */}
        {showArrows && images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                'absolute top-1/2 left-2 -translate-y-1/2',
                'bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black',
                'backdrop-blur-sm shadow-lg',
                !loop && currentIndex === 0 && 'opacity-50 cursor-not-allowed'
              )}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              disabled={!loop && currentIndex === 0}
              aria-label="Previous image"
            >
              <Icon icon="chevron-left" size="sm" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                'absolute top-1/2 right-2 -translate-y-1/2',
                'bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black',
                'backdrop-blur-sm shadow-lg',
                !loop && currentIndex === images.length - 1 && 'opacity-50 cursor-not-allowed'
              )}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              disabled={!loop && currentIndex === images.length - 1}
              aria-label="Next image"
            >
              <Icon icon="chevron-right" size="sm" />
            </Button>
          </>
        )}

        {/* Dots Navigation */}
        {showDots && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(index);
                }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && !showDots && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && variant === 'default' && (
        <div
          className={cn(
            'flex gap-2',
            isVerticalThumbnails ? 'flex-col max-h-96 overflow-y-auto' : 'overflow-x-auto',
            thumbnailClassName
          )}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              className={cn(
                'relative flex-shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800',
                rounded && 'rounded',
                index === currentIndex && 'ring-2 ring-primary-500',
                isVerticalThumbnails ? 'w-20 h-20' : 'w-16 h-16'
              )}
              onClick={() => goToImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ImageGallery.displayName = 'ImageGallery';