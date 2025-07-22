import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ProductCard } from '../../molecules/ProductCard/ProductCard';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';

export interface Product {
  id: string | number;
  title: string;
  price: string | number;
  originalPrice?: string | number;
  image: string;
  images?: string[];
  href: string;
  vendor?: {
    name: string;
    href?: string;
  };
  rating?: number;
  reviewCount?: number;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

export interface ProductCarouselProps {
  products: Product[];
  
  // Layout options
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  itemsPerView?: number | { mobile: number; tablet: number; desktop: number };
  gap?: 'sm' | 'md' | 'lg';
  
  // Display options
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
  
  // Navigation options
  showNavigation?: boolean;
  navigationPosition?: 'sides' | 'bottom' | 'top-right';
  showDots?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  
  // Loading state
  loading?: boolean;
  skeletonCount?: number;
  
  // Callbacks
  onProductClick?: (product: Product) => void;
  onViewAll?: () => void;
  onSlideChange?: (index: number) => void;
  
  // Styling
  className?: string;
  headerClassName?: string;
  carouselClassName?: string;
  navigationClassName?: string;
  
  'aria-label'?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  variant = 'default',
  itemsPerView = { mobile: 1, tablet: 2, desktop: 4 },
  gap = 'md',
  title,
  subtitle,
  showViewAll = false,
  viewAllHref,
  viewAllText = 'View All',
  showNavigation = true,
  navigationPosition = 'sides',
  showDots = false,
  autoplay = false,
  autoplayInterval = 5000,
  loop = false,
  loading = false,
  skeletonCount = 4,
  onProductClick,
  onViewAll,
  onSlideChange,
  className,
  headerClassName,
  carouselClassName,
  navigationClassName,
  'aria-label': ariaLabel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Parse items per view
  const getItemsPerView = () => {
    if (typeof itemsPerView === 'number') {
      return itemsPerView;
    }
    
    // Default to desktop view for SSR
    if (typeof window === 'undefined') {
      return itemsPerView.desktop;
    }
    
    const width = window.innerWidth;
    if (width < 640) return itemsPerView.mobile;
    if (width < 1024) return itemsPerView.tablet;
    return itemsPerView.desktop;
  };

  const [currentItemsPerView, setCurrentItemsPerView] = useState(getItemsPerView());
  
  // Update items per view on resize
  useEffect(() => {
    const handleResize = () => {
      setCurrentItemsPerView(getItemsPerView());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  // Calculate max index
  const maxIndex = Math.max(0, products.length - currentItemsPerView);

  // Gap classes
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  // Handle navigation
  const goToSlide = (index: number) => {
    let newIndex = index;
    
    if (loop) {
      if (index < 0) {
        newIndex = maxIndex;
      } else if (index > maxIndex) {
        newIndex = 0;
      }
    } else {
      newIndex = Math.max(0, Math.min(index, maxIndex));
    }
    
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  // Autoplay
  useEffect(() => {
    if (autoplay && !isHovered && products.length > currentItemsPerView) {
      intervalRef.current = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, autoplayInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, isHovered, currentIndex, autoplayInterval, products.length, currentItemsPerView]);

  // Calculate transform
  const itemWidth = 100 / currentItemsPerView;
  const transform = `translateX(-${currentIndex * itemWidth}%)`;

  // Render header
  const renderHeader = () => {
    if (!title && !showViewAll) return null;

    return (
      <div className={cn('mb-6 flex items-center justify-between', headerClassName)}>
        <div>
          {title && (
            <h2 className="text-2xl font-bold">{title}</h2>
          )}
          {subtitle && (
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {showViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            as={viewAllHref ? 'a' : 'button'}
            href={viewAllHref}
          >
            {viewAllText}
            <Icon icon="arrow-right" size="xs" className="ml-1" />
          </Button>
        )}
      </div>
    );
  };

  // Render navigation buttons
  const renderNavigation = () => {
    if (!showNavigation || products.length <= currentItemsPerView) return null;

    const canGoPrevious = loop || currentIndex > 0;
    const canGoNext = loop || currentIndex < maxIndex;

    const navButtons = (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPrevious}
          disabled={!canGoPrevious}
          className={cn(
            'rounded-full w-10 h-10 p-0',
            'bg-white dark:bg-neutral-800 shadow-lg',
            'hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'disabled:opacity-50',
            navigationClassName
          )}
          aria-label="Previous products"
        >
          <Icon icon="chevron-left" size="sm" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNext}
          disabled={!canGoNext}
          className={cn(
            'rounded-full w-10 h-10 p-0',
            'bg-white dark:bg-neutral-800 shadow-lg',
            'hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'disabled:opacity-50',
            navigationClassName
          )}
          aria-label="Next products"
        >
          <Icon icon="chevron-right" size="sm" />
        </Button>
      </>
    );

    if (navigationPosition === 'top-right') {
      return (
        <div className="flex items-center gap-2 ml-auto">
          {navButtons}
        </div>
      );
    }

    if (navigationPosition === 'bottom') {
      return (
        <div className="flex items-center justify-center gap-2 mt-6">
          {navButtons}
        </div>
      );
    }

    // Default: sides
    return null;
  };

  // Render dots
  const renderDots = () => {
    if (!showDots || products.length <= currentItemsPerView) return null;

    const totalDots = Math.ceil(products.length / currentItemsPerView);

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: totalDots }).map((_, index) => {
          const isActive = Math.floor(currentIndex / currentItemsPerView) === index;
          
          return (
            <button
              key={index}
              onClick={() => goToSlide(index * currentItemsPerView)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                isActive
                  ? 'w-8 bg-primary-600 dark:bg-primary-400'
                  : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    );
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return (
      <div className={cn('flex', gapClasses[gap])}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: `${100 / currentItemsPerView}%` }}
          >
            <Skeleton variant="product" className="w-full" />
          </div>
        ))}
      </div>
    );
  };

  // Render carousel content
  const renderCarousel = () => {
    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <Icon icon="package" size="xl" className="mx-auto mb-4 text-neutral-400" />
          <p className="text-neutral-600 dark:text-neutral-400">
            No products available
          </p>
        </div>
      );
    }

    const sideNavigation = navigationPosition === 'sides' && showNavigation && products.length > currentItemsPerView;

    return (
      <div className={cn('relative', carouselClassName)}>
        {sideNavigation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            disabled={!loop && currentIndex === 0}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-10',
              'rounded-full w-10 h-10 p-0',
              'bg-white dark:bg-neutral-800 shadow-lg',
              'hover:bg-neutral-100 dark:hover:bg-neutral-700',
              'disabled:opacity-50',
              '-translate-x-1/2',
              navigationClassName
            )}
            aria-label="Previous products"
          >
            <Icon icon="chevron-left" size="sm" />
          </Button>
        )}

        <div
          ref={carouselRef}
          className="overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={cn('flex transition-transform duration-300 ease-out', gapClasses[gap])}
            style={{ transform }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0"
                style={{ width: `${100 / currentItemsPerView}%` }}
              >
                <ProductCard
                  {...product}
                  variant={variant === 'minimal' ? 'minimal' : 'default'}
                  size={variant === 'compact' ? 'sm' : 'md'}
                  onClick={onProductClick ? () => onProductClick(product) : undefined}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {sideNavigation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            disabled={!loop && currentIndex >= maxIndex}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 z-10',
              'rounded-full w-10 h-10 p-0',
              'bg-white dark:bg-neutral-800 shadow-lg',
              'hover:bg-neutral-100 dark:hover:bg-neutral-700',
              'disabled:opacity-50',
              'translate-x-1/2',
              navigationClassName
            )}
            aria-label="Next products"
          >
            <Icon icon="chevron-right" size="sm" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <section className={cn('py-8', className)} aria-label={ariaLabel}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {renderHeader()}
        </div>
        {navigationPosition === 'top-right' && renderNavigation()}
      </div>
      
      {loading ? renderSkeletons() : renderCarousel()}
      
      {navigationPosition === 'bottom' && renderNavigation()}
      {renderDots()}
    </section>
  );
};

ProductCarousel.displayName = 'ProductCarousel';

// Specialized product carousel variants
export interface RecommendedProductsProps {
  products: Product[];
  title?: string;
  loading?: boolean;
  onProductClick?: (product: Product) => void;
  className?: string;
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  products,
  title = 'Recommended for You',
  loading,
  onProductClick,
  className,
}) => (
  <ProductCarousel
    products={products}
    title={title}
    variant="default"
    itemsPerView={{ mobile: 1, tablet: 3, desktop: 5 }}
    showNavigation
    navigationPosition="top-right"
    loading={loading}
    onProductClick={onProductClick}
    className={className}
  />
);

export interface RelatedProductsProps {
  products: Product[];
  title?: string;
  loading?: boolean;
  onProductClick?: (product: Product) => void;
  className?: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  title = 'Related Products',
  loading,
  onProductClick,
  className,
}) => (
  <ProductCarousel
    products={products}
    title={title}
    variant="compact"
    itemsPerView={{ mobile: 2, tablet: 3, desktop: 4 }}
    gap="sm"
    showNavigation
    loading={loading}
    onProductClick={onProductClick}
    className={className}
  />
);