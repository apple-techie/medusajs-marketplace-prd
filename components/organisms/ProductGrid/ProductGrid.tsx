import React from 'react';
import { cn } from '@/lib/utils';
import { ProductCard, ProductCardProps } from '../../molecules/ProductCard/ProductCard';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';
import { Spinner } from '../../atoms/Spinner/Spinner';

export interface Product extends Omit<ProductCardProps, 'onClick' | 'onAddToCart' | 'onToggleWishlist'> {
  id: string;
}

export interface ProductGridProps {
  products: Product[];
  
  // Display options
  viewMode?: 'grid' | 'list';
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
  };
  gap?: 'sm' | 'md' | 'lg';
  
  // Loading & empty states
  loading?: boolean;
  loadingCount?: number;
  emptyMessage?: string;
  emptyIcon?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  
  // Pagination
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  loadMoreLabel?: string;
  
  // Callbacks
  onProductClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  
  // Card options
  showVendor?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  imageAspectRatio?: '1:1' | '4:3' | '16:9';
  
  // Styling
  className?: string;
  productClassName?: string;
  
  'aria-label'?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode = 'grid',
  columns = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  },
  gap = 'md',
  loading = false,
  loadingCount = 8,
  emptyMessage = 'No products found',
  emptyIcon = 'package',
  emptyAction,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  loadMoreLabel = 'Load more',
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  showVendor = true,
  showRating = true,
  showAddToCart = true,
  showWishlist = true,
  imageAspectRatio = '1:1',
  className,
  productClassName,
  'aria-label': ariaLabel,
}) => {
  // Gap styles
  const gapStyles = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-6',
    lg: 'gap-4 sm:gap-6 lg:gap-8',
  };
  
  // Column styles for grid view
  const getGridColumns = () => {
    const cols = {
      mobile: columns.mobile || 2,
      tablet: columns.tablet || 3,
      desktop: columns.desktop || 4,
    };
    
    return cn(
      `grid-cols-${cols.mobile}`,
      `sm:grid-cols-${cols.tablet}`,
      `lg:grid-cols-${cols.desktop}`
    );
  };
  
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div 
        className={cn(
          'bg-neutral-200 dark:bg-neutral-700 rounded-lg',
          imageAspectRatio === '1:1' && 'aspect-square',
          imageAspectRatio === '4:3' && 'aspect-[4/3]',
          imageAspectRatio === '16:9' && 'aspect-[16/9]'
        )}
      />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
      </div>
    </div>
  );
  
  // Loading state
  if (loading && products.length === 0) {
    return (
      <div
        className={cn(
          viewMode === 'grid' ? 'grid' : 'space-y-4',
          viewMode === 'grid' && getGridColumns(),
          gapStyles[gap],
          className
        )}
        aria-label={ariaLabel || 'Loading products'}
        aria-busy="true"
      >
        {Array.from({ length: loadingCount }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  // Empty state
  if (!loading && products.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className
        )}
        aria-label={ariaLabel || 'No products'}
      >
        <Icon 
          icon={emptyIcon} 
          className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mb-4" 
        />
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
          {emptyMessage}
        </p>
        {emptyAction && (
          <Button onClick={emptyAction.onClick} variant="outline">
            {emptyAction.label}
          </Button>
        )}
      </div>
    );
  }
  
  // Product grid/list
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          viewMode === 'grid' ? 'grid' : 'space-y-4',
          viewMode === 'grid' && getGridColumns(),
          gapStyles[gap]
        )}
        aria-label={ariaLabel || 'Product list'}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
            imageAspectRatio={imageAspectRatio}
            showVendor={showVendor}
            showRating={showRating}
            showAddToCart={showAddToCart}
            showWishlist={showWishlist}
            onClick={() => onProductClick?.(product.id)}
            onAddToCart={() => onAddToCart?.(product.id)}
            onToggleWishlist={() => onToggleWishlist?.(product.id)}
            className={productClassName}
          />
        ))}
      </div>
      
      {/* Load more */}
      {hasMore && onLoadMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={loadingMore}
            loading={loadingMore}
            className="min-w-[200px]"
          >
            {!loadingMore && (
              <>
                <Icon icon="plus" className="w-5 h-5 mr-2" />
                {loadMoreLabel}
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Loading overlay for load more */}
      {loadingMore && (
        <div className="absolute inset-0 bg-white/50 dark:bg-neutral-900/50 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};

ProductGrid.displayName = 'ProductGrid';