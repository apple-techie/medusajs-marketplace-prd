import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Price } from '../../atoms/Price/Price';
import { Badge } from '../../atoms/Badge/Badge';

export interface CartItemProps {
  // Product info
  id: string;
  name: string;
  description?: string;
  variant?: string;
  sku?: string;
  
  // Images
  image?: {
    src: string;
    alt?: string;
  };
  
  // Pricing
  price: number;
  originalPrice?: number;
  currency?: string;
  
  // Quantity
  quantity: number;
  maxQuantity?: number;
  quantityStep?: number;
  
  // Stock
  inStock?: boolean;
  stockCount?: number;
  lowStockThreshold?: number;
  
  // Status
  status?: 'available' | 'limited' | 'backorder' | 'unavailable';
  
  // Vendor info
  vendorName?: string;
  vendorId?: string;
  
  // Fulfillment
  fulfillmentTime?: string;
  shippingMethod?: string;
  
  // Features
  editable?: boolean;
  removable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  
  // Display options
  layout?: 'horizontal' | 'vertical' | 'compact';
  showSavings?: boolean;
  showVendor?: boolean;
  showSku?: boolean;
  showStock?: boolean;
  
  // Actions
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
  
  // Styling
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  
  // Loading states
  updating?: boolean;
  removing?: boolean;
  
  // Labels
  removeLabel?: string;
  updateLabel?: string;
  outOfStockLabel?: string;
  limitedStockLabel?: string;
  
  'aria-label'?: string;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  description,
  variant,
  sku,
  image,
  price,
  originalPrice,
  currency = 'USD',
  quantity,
  maxQuantity,
  quantityStep = 1,
  inStock = true,
  stockCount,
  lowStockThreshold = 5,
  status = 'available',
  vendorName,
  vendorId,
  fulfillmentTime,
  shippingMethod,
  editable = true,
  removable = true,
  selectable = false,
  selected = false,
  layout = 'horizontal',
  showSavings = true,
  showVendor = false,
  showSku = false,
  showStock = false,
  onQuantityChange,
  onRemove,
  onSelect,
  onClick,
  className,
  imageClassName,
  contentClassName,
  updating = false,
  removing = false,
  removeLabel = 'Remove',
  updateLabel = 'Update',
  outOfStockLabel = 'Out of Stock',
  limitedStockLabel = 'Limited Stock',
  'aria-label': ariaLabel,
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate totals
  const subtotal = price * quantity;
  const originalSubtotal = originalPrice ? originalPrice * quantity : subtotal;
  const savings = originalSubtotal - subtotal;
  const savingsPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Determine effective max quantity
  const effectiveMaxQuantity = Math.min(
    maxQuantity || Infinity,
    stockCount || Infinity
  );

  // Check stock status
  const isLowStock = stockCount !== undefined && stockCount <= lowStockThreshold;
  const isOutOfStock = !inStock || stockCount === 0;

  // Handle quantity change
  const handleQuantityChange = async (newQuantity: number) => {
    if (!editable || isUpdating || !onQuantityChange) return;
    
    const validQuantity = Math.max(
      quantityStep,
      Math.min(newQuantity, effectiveMaxQuantity)
    );
    
    setLocalQuantity(validQuantity);
    
    if (validQuantity !== quantity) {
      setIsUpdating(true);
      try {
        await onQuantityChange(validQuantity);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Handle quick quantity changes
  const adjustQuantity = (delta: number) => {
    const newQuantity = localQuantity + (delta * quantityStep);
    handleQuantityChange(newQuantity);
  };

  const renderQuantitySelector = () => {
    if (!editable) {
      return (
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          Qty: {quantity}
        </span>
      );
    }

    return (
      <div className="flex items-center gap-1 rounded-md border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            adjustQuantity(-1);
          }}
          disabled={
            localQuantity <= quantityStep || 
            isUpdating || 
            isOutOfStock ||
            updating
          }
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Icon icon="minus" size="xs" />
        </button>
        
        <input
          type="number"
          value={localQuantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || quantityStep)}
          onBlur={() => {
            if (localQuantity !== quantity) {
              handleQuantityChange(localQuantity);
            }
          }}
          disabled={isUpdating || isOutOfStock || updating}
          min={quantityStep}
          max={effectiveMaxQuantity}
          step={quantityStep}
          className="w-12 text-center text-sm border-0 focus:outline-none disabled:opacity-50"
          aria-label="Quantity"
        />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            adjustQuantity(1);
          }}
          disabled={
            localQuantity >= effectiveMaxQuantity || 
            isUpdating || 
            isOutOfStock ||
            updating
          }
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Icon icon="plus" size="xs" />
        </button>
      </div>
    );
  };

  const renderStockStatus = () => {
    if (!showStock) return null;

    if (isOutOfStock) {
      return (
        <Badge variant="destructive" size="sm">
          {outOfStockLabel}
        </Badge>
      );
    }

    if (isLowStock) {
      return (
        <Badge variant="secondary" size="sm">
          {limitedStockLabel} - {stockCount} left
        </Badge>
      );
    }

    return null;
  };

  // Layout classes
  const layoutClasses = {
    horizontal: 'flex gap-4',
    vertical: 'flex flex-col gap-3',
    compact: 'flex gap-3',
  };

  const imageSize = {
    horizontal: 'w-24 h-24',
    vertical: 'w-full h-48',
    compact: 'w-16 h-16',
  };

  const content = (
    <>
      {/* Selection checkbox */}
      {selectable && (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect?.(e.target.checked)}
            disabled={updating || removing}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            aria-label={`Select ${name}`}
          />
        </div>
      )}

      {/* Product image */}
      {image && (
        <div className={cn(
          'flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800',
          imageSize[layout],
          imageClassName
        )}>
          <img
            src={image.src}
            alt={image.alt || name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Product details */}
      <div className={cn(
        'flex-1 min-w-0',
        layout === 'vertical' ? 'space-y-2' : 'space-y-1',
        contentClassName
      )}>
        {/* Name and variant */}
        <div>
          <h3 className="font-medium text-sm line-clamp-2">
            {name}
          </h3>
          {variant && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {variant}
            </p>
          )}
          {description && layout !== 'compact' && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          {showSku && sku && (
            <span>SKU: {sku}</span>
          )}
          {showVendor && vendorName && (
            <span>Sold by: {vendorName}</span>
          )}
          {fulfillmentTime && (
            <span>{fulfillmentTime}</span>
          )}
        </div>

        {/* Price and quantity for compact layout */}
        {layout === 'compact' && (
          <div className="flex items-center gap-3">
            <Price amount={price} currency={currency} size="sm" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              × {quantity}
            </span>
          </div>
        )}

        {/* Stock status */}
        {renderStockStatus()}
      </div>

      {/* Actions section */}
      {layout !== 'compact' && (
        <div className={cn(
          'flex',
          layout === 'vertical' ? 'justify-between items-center' : 'flex-col justify-between items-end gap-2'
        )}>
          {/* Price */}
          <div className="text-right">
            <Price
              amount={subtotal}
              currency={currency}
              className="font-semibold"
            />
            {originalPrice && showSavings && savings > 0 && (
              <div className="text-xs space-y-0.5">
                <Price
                  amount={originalSubtotal}
                  currency={currency}
                  className="line-through text-neutral-500"
                />
                <p className="text-green-600 dark:text-green-400">
                  Save {savingsPercentage}%
                </p>
              </div>
            )}
          </div>

          {/* Quantity and remove */}
          <div className="flex items-center gap-2">
            {renderQuantitySelector()}
            
            {removable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.();
                }}
                disabled={removing || updating}
                className="text-neutral-500 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                aria-label={`${removeLabel} ${name}`}
              >
                {removing ? (
                  <Icon icon="loader-2" size="sm" className="animate-spin" />
                ) : (
                  <Icon icon="trash-2" size="sm" />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );

  const itemClasses = cn(
    'p-4 bg-card rounded-lg border',
    layoutClasses[layout],
    (updating || removing) && 'opacity-50',
    onClick && 'cursor-pointer hover:shadow-sm transition-shadow',
    isOutOfStock && 'opacity-75',
    className
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={updating || removing}
        className={cn(itemClasses, 'w-full text-left')}
        aria-label={ariaLabel || `Cart item: ${name}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={itemClasses}
      aria-label={ariaLabel || `Cart item: ${name}`}
    >
      {content}
    </div>
  );
};

CartItem.displayName = 'CartItem';