import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '../../atoms/Badge/Badge';
import { StarRating } from '../../atoms/StarRating/StarRating';
import { PriceGroup } from '../PriceGroup/PriceGroup';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';

export interface ProductCardProps {
  // Core product data
  id: string | number;
  title: string;
  price: string | number;
  originalPrice?: string | number;
  currency?: string;
  image: string;
  images?: string[];
  href: string;
  
  // Vendor information
  vendor?: {
    name: string;
    href?: string;
    verified?: boolean;
  };
  
  // Product details
  description?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockCount?: number;
  
  // Visual options
  variant?: 'default' | 'minimal' | 'detailed' | 'horizontal' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  imageAspectRatio?: '1:1' | '4:3' | '3:4' | '16:9';
  
  // Badges and labels
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  
  // Interactive elements
  showQuickView?: boolean;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  
  // Callbacks
  onClick?: (e: React.MouseEvent) => void;
  onQuickView?: () => void;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isInWishlist?: boolean;
  
  // Styling
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  
  'aria-label'?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  currency = 'USD',
  image,
  images = [],
  href,
  vendor,
  description,
  rating,
  reviewCount = 0,
  inStock = true,
  stockCount,
  variant = 'default',
  size = 'md',
  imageAspectRatio = '1:1',
  badge,
  badgeVariant = 'default',
  isNew,
  isFeatured,
  discount,
  showQuickView = false,
  showAddToCart = false,
  showWishlist = false,
  onClick,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  className,
  imageClassName,
  contentClassName,
  'aria-label': ariaLabel,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  // All images including primary
  const allImages = [image, ...images];

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'p-3',
      titleSize: 'text-sm',
      priceSize: 'text-base',
      gap: 'gap-2',
      badgeSize: 'xs' as const,
      ratingSize: 'sm' as const,
    },
    md: {
      padding: 'p-4',
      titleSize: 'text-base',
      priceSize: 'text-lg',
      gap: 'gap-3',
      badgeSize: 'sm' as const,
      ratingSize: 'md' as const,
    },
    lg: {
      padding: 'p-5',
      titleSize: 'text-lg',
      priceSize: 'text-xl',
      gap: 'gap-4',
      badgeSize: 'md' as const,
      ratingSize: 'md' as const,
    },
  };

  const sizes = sizeConfig[size];

  // Aspect ratio classes
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '3:4': 'aspect-[3/4]',
    '16:9': 'aspect-video',
  };

  // Handle image hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const sectionWidth = rect.width / allImages.length;
    const index = Math.floor(x / sectionWidth);
    
    setCurrentImageIndex(Math.min(index, allImages.length - 1));
  };

  // Render badges
  const renderBadges = () => {
    const badges = [];
    
    if (badge) {
      badges.push(
        <Badge key="custom" variant={badgeVariant} size={sizes.badgeSize}>
          {badge}
        </Badge>
      );
    }
    
    if (isNew) {
      badges.push(
        <Badge key="new" variant="primary" size={sizes.badgeSize}>
          New
        </Badge>
      );
    }
    
    if (isFeatured) {
      badges.push(
        <Badge key="featured" variant="success" size={sizes.badgeSize}>
          Featured
        </Badge>
      );
    }
    
    if (discount) {
      badges.push(
        <Badge key="discount" variant="danger" size={sizes.badgeSize}>
          -{discount}%
        </Badge>
      );
    }
    
    if (!inStock) {
      badges.push(
        <Badge key="stock" variant="default" size={sizes.badgeSize}>
          Out of Stock
        </Badge>
      );
    }
    
    return badges.length > 0 ? (
      <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
        {badges}
      </div>
    ) : null;
  };

  // Render action buttons
  const renderActions = () => {
    if (!showQuickView && !showWishlist) return null;

    return (
      <div className={cn(
        'absolute top-2 right-2 flex flex-col gap-2 z-10',
        'opacity-0 group-hover:opacity-100 transition-opacity'
      )}>
        {showWishlist && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist?.();
            }}
            className="bg-white dark:bg-neutral-800 shadow-md rounded-full w-8 h-8 p-0"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Icon 
              icon={isInWishlist ? 'heart' : 'heart'} 
              size="xs"
              className={isInWishlist ? 'text-red-500 fill-red-500' : ''}
            />
          </Button>
        )}
        
        {showQuickView && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onQuickView?.();
            }}
            className="bg-white dark:bg-neutral-800 shadow-md rounded-full w-8 h-8 p-0"
            aria-label="Quick view"
          >
            <Icon icon="eye" size="xs" />
          </Button>
        )}
      </div>
    );
  };

  // Render image
  const renderImage = () => {
    const imageContent = (
      <div
        className={cn(
          'relative overflow-hidden bg-neutral-100 dark:bg-neutral-800',
          aspectRatioClasses[imageAspectRatio],
          imageClassName
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
      >
        <img
          src={allImages[currentImageIndex]}
          alt={title}
          className={cn(
            'w-full h-full object-cover',
            'transition-transform duration-300',
            isHovered && 'scale-105'
          )}
        />
        
        {images.length > 0 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {allImages.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-1 h-1 rounded-full transition-all',
                  index === currentImageIndex
                    ? 'w-4 bg-white'
                    : 'bg-white/50'
                )}
              />
            ))}
          </div>
        )}
      </div>
    );

    return variant === 'horizontal' ? imageContent : (
      <>
        {renderBadges()}
        {renderActions()}
        {imageContent}
      </>
    );
  };

  // Render vendor info
  const renderVendor = () => {
    if (!vendor) return null;

    return (
      <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
        {vendor.href ? (
          <Link 
            href={vendor.href}
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {vendor.name}
          </Link>
        ) : (
          <span>{vendor.name}</span>
        )}
        {vendor.verified && (
          <Icon icon="check-circle" size="xs" className="text-primary-600" />
        )}
      </div>
    );
  };

  // Render rating
  const renderRating = () => {
    if (!rating) return null;

    return (
      <div className="flex items-center gap-2">
        <StarRating rating={rating} size={sizes.ratingSize} readOnly />
        {reviewCount > 0 && (
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            ({reviewCount.toLocaleString()})
          </span>
        )}
      </div>
    );
  };

  // Render add to cart button
  const renderAddToCart = () => {
    if (!showAddToCart || variant === 'minimal') return null;

    return (
      <Button
        variant="primary"
        size={size === 'sm' ? 'xs' : 'sm'}
        onClick={(e) => {
          e.preventDefault();
          onAddToCart?.();
        }}
        disabled={!inStock}
        className="w-full"
      >
        <Icon icon="shopping-cart" size="xs" className="mr-1" />
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    );
  };

  // Content based on variant
  const renderContent = () => {
    const titleElement = (
      <h3 className={cn('font-medium line-clamp-2', sizes.titleSize)}>
        {title}
      </h3>
    );

    const priceElement = (
      <PriceGroup
        price={price}
        originalPrice={originalPrice}
        currency={currency}
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
        showBadge={false}
      />
    );

    switch (variant) {
      case 'minimal':
        return (
          <div className={cn('flex flex-col', sizes.gap, contentClassName)}>
            {titleElement}
            {priceElement}
          </div>
        );

      case 'detailed':
        return (
          <div className={cn('flex flex-col', sizes.gap, contentClassName)}>
            {renderVendor()}
            {titleElement}
            {description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {description}
              </p>
            )}
            {renderRating()}
            {priceElement}
            {stockCount !== undefined && inStock && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {stockCount} in stock
              </p>
            )}
            {renderAddToCart()}
          </div>
        );

      case 'horizontal':
        return (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-1/3 relative">
              {renderImage()}
            </div>
            <div className={cn('flex-1 flex flex-col', sizes.gap, contentClassName)}>
              {renderVendor()}
              {titleElement}
              {renderRating()}
              {priceElement}
              {renderAddToCart()}
            </div>
          </div>
        );

      default: // 'default' and 'grid'
        return (
          <div className={cn('flex flex-col', sizes.gap, contentClassName)}>
            {renderVendor()}
            {titleElement}
            {renderRating()}
            {priceElement}
            {renderAddToCart()}
          </div>
        );
    }
  };

  // Card wrapper
  const cardContent = (
    <>
      {variant !== 'horizontal' && renderImage()}
      {renderContent()}
    </>
  );

  const cardClasses = cn(
    'group relative bg-white dark:bg-neutral-900',
    'border border-neutral-200 dark:border-neutral-800',
    'rounded-lg overflow-hidden',
    'hover:shadow-lg transition-all duration-200',
    !inStock && 'opacity-75',
    variant === 'horizontal' ? '' : sizes.padding,
    className
  );

  if (onClick) {
    return (
      <div
        className={cardClasses}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel || `View ${title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick(e as any);
          }
        }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cardClasses}
      aria-label={ariaLabel || `View ${title}`}
    >
      {cardContent}
    </Link>
  );
};

ProductCard.displayName = 'ProductCard';