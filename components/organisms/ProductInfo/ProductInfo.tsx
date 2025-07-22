import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '../../atoms/Badge/Badge';
import { Price } from '../../atoms/Price/Price';
import { Icon } from '../../atoms/Icon/Icon';
import { Rating } from '../../atoms/Rating/Rating';
import { Button } from '../../atoms/Button/Button';

export interface ProductFeature {
  icon?: string;
  label: string;
  value: string;
}

export interface ProductInfoProps {
  // Basic info
  name: string;
  brand?: string;
  sku?: string;
  
  // Pricing
  price: number;
  originalPrice?: number;
  currency?: string;
  
  // Description
  shortDescription?: string;
  longDescription?: string;
  
  // Features
  features?: ProductFeature[];
  highlights?: string[];
  
  // Ratings
  rating?: number;
  reviewCount?: number;
  onReviewClick?: () => void;
  
  // Vendor
  vendorName?: string;
  vendorId?: string;
  vendorRating?: number;
  onVendorClick?: () => void;
  
  // Stock & availability
  inStock?: boolean;
  stockCount?: number;
  lowStockThreshold?: number;
  availability?: string;
  
  // Shipping
  shippingInfo?: {
    freeShipping?: boolean;
    estimatedDays?: string;
    cost?: number;
  };
  
  // Badges
  badges?: Array<{
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'success';
  }>;
  
  // Age restriction
  ageRestriction?: number;
  
  // Display options
  layout?: 'default' | 'compact' | 'detailed';
  showSku?: boolean;
  showVendor?: boolean;
  showShipping?: boolean;
  
  // Actions
  onShare?: () => void;
  onWishlist?: () => void;
  isWishlisted?: boolean;
  
  // Styling
  className?: string;
  
  'aria-label'?: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  brand,
  sku,
  price,
  originalPrice,
  currency = 'USD',
  shortDescription,
  longDescription,
  features = [],
  highlights = [],
  rating,
  reviewCount = 0,
  onReviewClick,
  vendorName,
  vendorId,
  vendorRating,
  onVendorClick,
  inStock = true,
  stockCount,
  lowStockThreshold = 10,
  availability,
  shippingInfo,
  badges = [],
  ageRestriction,
  layout = 'default',
  showSku = true,
  showVendor = true,
  showShipping = true,
  onShare,
  onWishlist,
  isWishlisted = false,
  className,
  'aria-label': ariaLabel,
}) => {
  // Calculate savings
  const savings = originalPrice ? originalPrice - price : 0;
  const savingsPercentage = originalPrice 
    ? Math.round((savings / originalPrice) * 100)
    : 0;

  // Check if low stock
  const isLowStock = stockCount !== undefined && stockCount <= lowStockThreshold && stockCount > 0;

  // Render stock status
  const renderStockStatus = () => {
    if (!inStock) {
      return (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <Icon icon="x-circle" size="sm" />
          <span className="font-medium">Out of Stock</span>
        </div>
      );
    }

    if (isLowStock) {
      return (
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <Icon icon="alert-circle" size="sm" />
          <span className="font-medium">Only {stockCount} left in stock</span>
        </div>
      );
    }

    if (availability) {
      return (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <Icon icon="check-circle" size="sm" />
          <span className="font-medium">{availability}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <Icon icon="check-circle" size="sm" />
        <span className="font-medium">In Stock</span>
      </div>
    );
  };

  // Render shipping info
  const renderShippingInfo = () => {
    if (!showShipping || !shippingInfo) return null;

    return (
      <div className="flex items-start gap-2">
        <Icon icon="truck" size="sm" className="text-neutral-600 dark:text-neutral-400 mt-0.5" />
        <div className="text-sm">
          {shippingInfo.freeShipping ? (
            <span className="font-medium text-green-600 dark:text-green-400">
              Free Shipping
            </span>
          ) : shippingInfo.cost ? (
            <span>
              Shipping: <Price amount={shippingInfo.cost} currency={currency} size="sm" />
            </span>
          ) : null}
          {shippingInfo.estimatedDays && (
            <span className="text-neutral-600 dark:text-neutral-400 ml-1">
              • {shippingInfo.estimatedDays}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'space-y-4',
        layout === 'compact' && 'space-y-3',
        className
      )}
      aria-label={ariaLabel || `Product information for ${name}`}
    >
      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant}>
              {badge.text}
            </Badge>
          ))}
        </div>
      )}

      {/* Brand */}
      {brand && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
          {brand}
        </p>
      )}

      {/* Name */}
      <h1 className={cn(
        'font-bold',
        layout === 'compact' ? 'text-xl' : 'text-2xl md:text-3xl'
      )}>
        {name}
      </h1>

      {/* SKU */}
      {showSku && sku && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          SKU: {sku}
        </p>
      )}

      {/* Rating and reviews */}
      {rating !== undefined && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Rating value={rating} readonly />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          {reviewCount > 0 && (
            <button
              onClick={onReviewClick}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </button>
          )}
        </div>
      )}

      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <Price
            amount={price}
            currency={currency}
            className="text-2xl font-bold"
          />
          {originalPrice && (
            <>
              <Price
                amount={originalPrice}
                currency={currency}
                className="text-lg line-through text-neutral-500"
              />
              <Badge variant="destructive" size="sm">
                Save {savingsPercentage}%
              </Badge>
            </>
          )}
        </div>
        {savings > 0 && (
          <p className="text-sm text-green-600 dark:text-green-400">
            You save: <Price amount={savings} currency={currency} size="sm" />
          </p>
        )}
      </div>

      {/* Short description */}
      {shortDescription && layout !== 'compact' && (
        <p className="text-neutral-700 dark:text-neutral-300">
          {shortDescription}
        </p>
      )}

      {/* Stock status */}
      {renderStockStatus()}

      {/* Shipping info */}
      {renderShippingInfo()}

      {/* Vendor info */}
      {showVendor && vendorName && (
        <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Sold by
            </p>
            <button
              onClick={onVendorClick}
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              {vendorName}
            </button>
          </div>
          {vendorRating !== undefined && (
            <div className="flex items-center gap-1">
              <Rating value={vendorRating} readonly size="sm" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                ({vendorRating.toFixed(1)})
              </span>
            </div>
          )}
        </div>
      )}

      {/* Highlights */}
      {highlights.length > 0 && layout !== 'compact' && (
        <div>
          <h3 className="font-semibold mb-2">Highlights</h3>
          <ul className="space-y-1">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2">
                <Icon
                  icon="check"
                  size="sm"
                  className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && layout === 'detailed' && (
        <div>
          <h3 className="font-semibold mb-3">Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                {feature.icon && (
                  <Icon
                    icon={feature.icon}
                    size="sm"
                    className="text-neutral-600 dark:text-neutral-400 mt-0.5"
                  />
                )}
                <div className="text-sm">
                  <span className="font-medium">{feature.label}:</span>{' '}
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {feature.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Long description */}
      {longDescription && layout === 'detailed' && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h3 className="font-semibold mb-2">Description</h3>
          <div dangerouslySetInnerHTML={{ __html: longDescription }} />
        </div>
      )}

      {/* Age restriction */}
      {ageRestriction && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <Icon icon="alert-circle" className="text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm font-medium">
            Must be {ageRestriction}+ years old to purchase
          </span>
        </div>
      )}

      {/* Action buttons */}
      {(onShare || onWishlist) && (
        <div className="flex gap-2 pt-2">
          {onWishlist && (
            <Button
              variant="outline"
              size="sm"
              onClick={onWishlist}
              className="gap-2"
            >
              <Icon
                icon={isWishlisted ? 'heart' : 'heart'}
                size="sm"
                className={isWishlisted ? 'fill-current text-red-500' : ''}
              />
              {isWishlisted ? 'Saved' : 'Save'}
            </Button>
          )}
          {onShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="gap-2"
            >
              <Icon icon="share-2" size="sm" />
              Share
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

ProductInfo.displayName = 'ProductInfo';