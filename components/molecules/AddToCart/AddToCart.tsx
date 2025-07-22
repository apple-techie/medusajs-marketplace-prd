import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { Price } from '../../atoms/Price/Price';

export interface AddToCartProps {
  // Product info
  productId: string;
  productName?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  
  // Availability
  available?: boolean;
  inStock?: boolean;
  stockCount?: number;
  maxQuantity?: number;
  
  // Quantity selector
  showQuantity?: boolean;
  defaultQuantity?: number;
  quantityStep?: number;
  
  // Display options
  variant?: 'default' | 'compact' | 'minimal' | 'full';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  
  // Features
  showPrice?: boolean;
  showStock?: boolean;
  showSavings?: boolean;
  quickAdd?: boolean;
  
  // Labels
  addToCartLabel?: string;
  addingLabel?: string;
  addedLabel?: string;
  outOfStockLabel?: string;
  limitedStockLabel?: string;
  quantityLabel?: string;
  
  // Loading states
  loading?: boolean;
  disabled?: boolean;
  
  // Callbacks
  onAddToCart?: (quantity: number) => void | Promise<void>;
  onQuantityChange?: (quantity: number) => void;
  
  // Styling
  className?: string;
  buttonClassName?: string;
  quantityClassName?: string;
  
  'aria-label'?: string;
}

export const AddToCart: React.FC<AddToCartProps> = ({
  productId,
  productName,
  price,
  originalPrice,
  currency = 'USD',
  available = true,
  inStock = true,
  stockCount,
  maxQuantity,
  showQuantity = true,
  defaultQuantity = 1,
  quantityStep = 1,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  showPrice = true,
  showStock = false,
  showSavings = true,
  quickAdd = false,
  addToCartLabel = 'Add to Cart',
  addingLabel = 'Adding...',
  addedLabel = 'Added!',
  outOfStockLabel = 'Out of Stock',
  limitedStockLabel = 'Limited Stock',
  quantityLabel = 'Quantity',
  loading = false,
  disabled = false,
  onAddToCart,
  onQuantityChange,
  className,
  buttonClassName,
  quantityClassName,
  'aria-label': ariaLabel,
}) => {
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Calculate effective max quantity
  const effectiveMaxQuantity = Math.min(
    maxQuantity || Infinity,
    stockCount || Infinity
  );

  // Check if can add/remove quantity
  const canIncrement = quantity < effectiveMaxQuantity;
  const canDecrement = quantity > quantityStep;

  // Calculate savings
  const savings = originalPrice && originalPrice > price
    ? originalPrice - price
    : 0;
  const savingsPercentage = originalPrice && originalPrice > price
    ? Math.round((savings / originalPrice) * 100)
    : 0;

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(
      quantityStep,
      Math.min(newQuantity, effectiveMaxQuantity)
    );
    setQuantity(clampedQuantity);
    onQuantityChange?.(clampedQuantity);
  };

  const incrementQuantity = () => {
    if (canIncrement) {
      handleQuantityChange(quantity + quantityStep);
    }
  };

  const decrementQuantity = () => {
    if (canDecrement) {
      handleQuantityChange(quantity - quantityStep);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!available || !inStock || isAdding || disabled) return;

    setIsAdding(true);
    setIsAdded(false);

    try {
      await onAddToCart?.(quantity);
      setIsAdded(true);
      
      // Reset added state after delay
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Button size classes
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg',
  };

  const quantitySizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10',
    lg: 'h-12 w-12 text-lg',
  };

  // Stock status
  const getStockStatus = () => {
    if (!inStock || stockCount === 0) {
      return { available: false, message: outOfStockLabel, variant: 'destructive' as const };
    }
    if (stockCount && stockCount <= 10) {
      return { available: true, message: `${limitedStockLabel} (${stockCount})`, variant: 'warning' as const };
    }
    return { available: true, message: null, variant: null };
  };

  const stockStatus = getStockStatus();

  // Determine button state
  const buttonDisabled = !available || !inStock || disabled || loading || isAdding;
  const buttonLabel = isAdded ? addedLabel : (isAdding || loading) ? addingLabel : addToCartLabel;

  // Quick add mode (no quantity selector)
  if (quickAdd || variant === 'minimal') {
    return (
      <Button
        variant={buttonDisabled ? 'secondary' : 'primary'}
        size={size}
        disabled={buttonDisabled}
        onClick={handleAddToCart}
        className={cn(
          fullWidth && 'w-full',
          buttonClassName,
          className
        )}
        aria-label={ariaLabel || `Add ${productName || 'item'} to cart`}
      >
        {(isAdding || loading) && (
          <Icon icon="loader" size="sm" className="mr-2 animate-spin" />
        )}
        {isAdded && (
          <Icon icon="check" size="sm" className="mr-2" />
        )}
        <span>{buttonLabel}</span>
      </Button>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {showQuantity && inStock && (
          <div className="flex items-center">
            <button
              onClick={decrementQuantity}
              disabled={!canDecrement || buttonDisabled}
              className={cn(
                'rounded-l-md border border-r-0 border-neutral-300 dark:border-neutral-600',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                quantitySizeClasses[size]
              )}
              aria-label="Decrease quantity"
            >
              <Icon icon="minus" size="xs" />
            </button>
            <div
              className={cn(
                'border-y border-neutral-300 dark:border-neutral-600',
                'bg-white dark:bg-neutral-900',
                'flex items-center justify-center font-medium',
                quantitySizeClasses[size],
                'w-12'
              )}
            >
              {quantity}
            </div>
            <button
              onClick={incrementQuantity}
              disabled={!canIncrement || buttonDisabled}
              className={cn(
                'rounded-r-md border border-l-0 border-neutral-300 dark:border-neutral-600',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                quantitySizeClasses[size]
              )}
              aria-label="Increase quantity"
            >
              <Icon icon="plus" size="xs" />
            </button>
          </div>
        )}
        
        <Button
          variant={buttonDisabled ? 'secondary' : 'primary'}
          size={size}
          disabled={buttonDisabled}
          onClick={handleAddToCart}
          className={cn(fullWidth && 'flex-1', buttonClassName)}
        >
          {(isAdding || loading) && (
            <Icon icon="loader" size="sm" className="mr-2 animate-spin" />
          )}
          {isAdded && (
            <Icon icon="check" size="sm" className="mr-2" />
          )}
          <span className="hidden sm:inline">{buttonLabel}</span>
          <Icon icon="shopping-cart" size="sm" className="sm:ml-2" />
        </Button>
      </div>
    );
  }

  // Default and full variants
  return (
    <div
      className={cn(
        'space-y-3',
        variant === 'full' && 'p-4 border rounded-lg',
        className
      )}
      aria-label={ariaLabel || 'Add to cart section'}
    >
      {/* Price and savings */}
      {showPrice && variant === 'full' && (
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <Price
              amount={price}
              currency={currency}
              size="lg"
              className="font-bold"
            />
            {originalPrice && originalPrice > price && (
              <>
                <Price
                  amount={originalPrice}
                  currency={currency}
                  size="sm"
                  className="line-through text-neutral-500"
                />
                {showSavings && (
                  <Badge variant="destructive" size="sm">
                    Save {savingsPercentage}%
                  </Badge>
                )}
              </>
            )}
          </div>
          {showSavings && savings > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400">
              You save <Price amount={savings} currency={currency} size="sm" className="font-medium" />
            </p>
          )}
        </div>
      )}

      {/* Stock status */}
      {showStock && stockStatus.message && (
        <div className="flex items-center gap-2">
          <Icon 
            icon={stockStatus.available ? 'alert-triangle' : 'x-circle'} 
            size="sm" 
            className={cn(
              stockStatus.variant === 'destructive' && 'text-red-500',
              stockStatus.variant === 'warning' && 'text-orange-500'
            )}
          />
          <span className={cn(
            'text-sm font-medium',
            stockStatus.variant === 'destructive' && 'text-red-600 dark:text-red-400',
            stockStatus.variant === 'warning' && 'text-orange-600 dark:text-orange-400'
          )}>
            {stockStatus.message}
          </span>
        </div>
      )}

      {/* Quantity selector and button */}
      <div className={cn(
        'flex gap-3',
        variant === 'full' && 'flex-col sm:flex-row'
      )}>
        {showQuantity && inStock && (
          <div className={cn(
            'flex items-center',
            variant === 'full' && 'justify-between sm:justify-start',
            quantityClassName
          )}>
            {variant === 'full' && (
              <label className="text-sm font-medium mr-3">
                {quantityLabel}:
              </label>
            )}
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                disabled={!canDecrement || buttonDisabled}
                className={cn(
                  'rounded-l-md border border-r-0 border-neutral-300 dark:border-neutral-600',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors',
                  quantitySizeClasses[size]
                )}
                aria-label="Decrease quantity"
              >
                <Icon icon="minus" size="xs" />
              </button>
              <input
                type="number"
                min={quantityStep}
                max={effectiveMaxQuantity}
                step={quantityStep}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || quantityStep)}
                className={cn(
                  'border-y border-neutral-300 dark:border-neutral-600',
                  'bg-white dark:bg-neutral-900',
                  'text-center font-medium',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  quantitySizeClasses[size],
                  'w-16'
                )}
                aria-label="Quantity"
              />
              <button
                onClick={incrementQuantity}
                disabled={!canIncrement || buttonDisabled}
                className={cn(
                  'rounded-r-md border border-l-0 border-neutral-300 dark:border-neutral-600',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors',
                  quantitySizeClasses[size]
                )}
                aria-label="Increase quantity"
              >
                <Icon icon="plus" size="xs" />
              </button>
            </div>
          </div>
        )}

        <Button
          variant={buttonDisabled ? 'secondary' : 'primary'}
          size={size}
          disabled={buttonDisabled}
          onClick={handleAddToCart}
          className={cn(
            fullWidth || variant === 'full' ? 'flex-1' : '',
            sizeClasses[size],
            buttonClassName
          )}
        >
          {(isAdding || loading) && (
            <Icon icon="loader" size="sm" className="mr-2 animate-spin" />
          )}
          {isAdded && (
            <Icon icon="check" size="sm" className="mr-2" />
          )}
          <Icon icon="shopping-cart" size="sm" className="mr-2" />
          <span>{buttonLabel}</span>
        </Button>
      </div>

      {/* Additional info for full variant */}
      {variant === 'full' && (
        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <Icon icon="truck" size="xs" />
            <span>Free shipping</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon="shield-check" size="xs" />
            <span>Secure checkout</span>
          </div>
        </div>
      )}
    </div>
  );
};

AddToCart.displayName = 'AddToCart';