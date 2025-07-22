import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';

// Define product card variants
const productCardVariants = cva(
  'bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg',
  {
    variants: {
      variant: {
        default: 'border border-neutral-200',
        outlined: 'border-2 border-neutral-300',
        elevated: 'shadow-md hover:shadow-xl',
        minimal: '',
      },
      size: {
        sm: 'max-w-[200px]',
        md: 'max-w-[280px]',
        lg: 'max-w-[360px]',
        full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Types
export interface ProductCardProps extends VariantProps<typeof productCardVariants> {
  image: string;
  imageAlt?: string;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  badgeVariant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  isNew?: boolean;
  isSale?: boolean;
  isOutOfStock?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  showQuickView?: boolean;
  onQuickViewClick?: () => void;
  showAddToCart?: boolean;
  onAddToCartClick?: () => void;
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// Helper function to format price
const formatPrice = (price: number | string, currency: string = '$'): string => {
  if (typeof price === 'string') return price;
  return `${currency}${price.toFixed(2)}`;
};

// Helper function to calculate discount percentage
const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Rating Stars Component
const RatingStars: React.FC<{ rating: number; count?: number }> = ({ rating, count }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Icon 
            key={`full-${i}`} 
            icon="star" 
            size="xs" 
            className="text-warning-500 fill-warning-500" 
          />
        ))}
        {hasHalfStar && (
          <Icon 
            icon="star" 
            size="xs" 
            className="text-warning-500 fill-warning-500 [clip-path:inset(0_50%_0_0)]" 
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Icon 
            key={`empty-${i}`} 
            icon="star" 
            size="xs" 
            className="text-neutral-300" 
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-neutral-600">({count})</span>
      )}
    </div>
  );
};

// Main ProductCard component
export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({
    image,
    imageAlt,
    name,
    price,
    originalPrice,
    currency = '$',
    rating,
    reviewCount,
    badge,
    badgeVariant = 'primary',
    isNew,
    isSale,
    isOutOfStock,
    isFavorite: controlledFavorite,
    onFavoriteClick,
    showQuickView = true,
    onQuickViewClick,
    showAddToCart = true,
    onAddToCartClick,
    href,
    onClick,
    variant,
    size,
    className,
    children,
    ...props
  }, ref) => {
    const [isFavoriteInternal, setIsFavoriteInternal] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    // Use controlled favorite state if provided
    const isFavorite = controlledFavorite !== undefined ? controlledFavorite : isFavoriteInternal;
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (controlledFavorite === undefined) {
        setIsFavoriteInternal(!isFavoriteInternal);
      }
      onFavoriteClick?.();
    };

    const handleQuickViewClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickViewClick?.();
    };

    const handleAddToCartClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onAddToCartClick?.();
    };

    const handleClick = (e: React.MouseEvent) => {
      if (!href) {
        onClick?.(e);
      }
    };

    // Calculate discount if sale
    const discountPercentage = isSale && originalPrice && typeof originalPrice === 'number' && typeof price === 'number'
      ? calculateDiscount(originalPrice, price)
      : 0;

    const cardContent = (
      <>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100 group">
          {!imageError ? (
            <img
              src={image}
              alt={imageAlt || name}
              className={cn(
                'h-full w-full object-cover transition-transform duration-300 group-hover:scale-110',
                !isImageLoaded && 'opacity-0'
              )}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icon icon="image" size="lg" className="text-neutral-400" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && !isSale && (
              <Badge variant="info" size="sm">
                New
              </Badge>
            )}
            {isSale && discountPercentage > 0 && (
              <Badge variant="danger" size="sm">
                -{discountPercentage}%
              </Badge>
            )}
            {badge && (
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              onClick={handleFavoriteClick}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:shadow-lg',
                isFavorite && 'bg-danger-50'
              )}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Icon 
                icon="heart" 
                size="xs" 
                className={cn(
                  'transition-colors',
                  isFavorite ? 'text-danger-500 fill-danger-500' : 'text-neutral-600'
                )}
              />
            </button>
            
            {showQuickView && (
              <button
                onClick={handleQuickViewClick}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md opacity-0 transition-all duration-200 hover:shadow-lg group-hover:opacity-100"
                aria-label="Quick view"
              >
                <Icon icon="eye" size="xs" className="text-neutral-600" />
              </button>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900">
                Out of Stock
              </span>
            </div>
          )}

          {/* Loading Skeleton */}
          {!isImageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-neutral-200" />
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-sm font-medium text-neutral-900">
            {name}
          </h3>

          {/* Rating */}
          {rating !== undefined && (
            <div className="mb-2">
              <RatingStars rating={rating} count={reviewCount} />
            </div>
          )}

          {/* Price */}
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-neutral-900">
              {formatPrice(price, currency)}
            </span>
            {originalPrice && (
              <span className="text-sm text-neutral-500 line-through">
                {formatPrice(originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Custom Children */}
          {children}

          {/* Add to Cart Button */}
          {showAddToCart && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              leftIcon={<Icon icon="shoppingCart" size="xs" />}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </>
    );

    const cardElement = (
      <div
        ref={ref}
        className={cn(
          productCardVariants({ variant, size }),
          'cursor-pointer',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {cardContent}
      </div>
    );

    // Wrap in anchor tag if href is provided
    if (href) {
      return (
        <a href={href} className="no-underline">
          {cardElement}
        </a>
      );
    }

    return cardElement;
  }
);

ProductCard.displayName = 'ProductCard';

// ProductGrid component for layouts
export interface ProductGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  children,
  columns = 4,
  gap = 'md',
  className,
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

export { productCardVariants };