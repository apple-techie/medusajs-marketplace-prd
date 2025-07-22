import React from 'react';
import { cn } from '@/lib/utils';
import { Price } from '../../atoms/Price/Price';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';

export interface CartSummaryLineItem {
  label: string;
  value: number;
  description?: string;
  icon?: string;
  highlight?: boolean;
  type?: 'default' | 'discount' | 'fee' | 'tax';
}

export interface CartSummaryProps {
  // Line items
  subtotal: number;
  items?: CartSummaryLineItem[];
  
  // Totals
  total: number;
  originalTotal?: number;
  
  // Currency
  currency?: string;
  
  // Discounts
  discount?: {
    amount: number;
    code?: string;
    type?: 'fixed' | 'percentage';
    description?: string;
  };
  
  // Shipping
  shipping?: {
    amount: number;
    method?: string;
    estimatedDays?: string;
    isFree?: boolean;
    freeThreshold?: number;
  };
  
  // Tax
  tax?: {
    amount: number;
    rate?: number;
    inclusive?: boolean;
    breakdown?: Array<{
      label: string;
      amount: number;
    }>;
  };
  
  // Savings
  showSavings?: boolean;
  savingsLabel?: string;
  
  // Display options
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  showBreakdown?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  
  // Loyalty/rewards
  loyaltyPoints?: {
    earned: number;
    used?: number;
    balance?: number;
  };
  
  // Promo code
  showPromoCode?: boolean;
  onApplyPromo?: (code: string) => void;
  
  // Actions
  checkoutButton?: {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  
  // Continue shopping
  continueShoppingUrl?: string;
  
  // Styling
  className?: string;
  headerClassName?: string;
  itemsClassName?: string;
  totalClassName?: string;
  
  // Loading
  loading?: boolean;
  
  // Labels
  subtotalLabel?: string;
  totalLabel?: string;
  taxLabel?: string;
  shippingLabel?: string;
  discountLabel?: string;
  
  'aria-label'?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  items = [],
  total,
  originalTotal,
  currency = 'USD',
  discount,
  shipping,
  tax,
  showSavings = true,
  savingsLabel = 'You save',
  variant = 'default',
  showBreakdown = true,
  collapsible = false,
  defaultExpanded = true,
  loyaltyPoints,
  showPromoCode = false,
  onApplyPromo,
  checkoutButton,
  continueShoppingUrl,
  className,
  headerClassName,
  itemsClassName,
  totalClassName,
  loading = false,
  subtotalLabel = 'Subtotal',
  totalLabel = 'Total',
  taxLabel = 'Tax',
  shippingLabel = 'Shipping',
  discountLabel = 'Discount',
  'aria-label': ariaLabel,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [promoCode, setPromoCode] = React.useState('');
  const [isApplyingPromo, setIsApplyingPromo] = React.useState(false);

  // Calculate savings
  const totalSavings = originalTotal ? originalTotal - total : 0;
  const savingsPercentage = originalTotal 
    ? Math.round((totalSavings / originalTotal) * 100)
    : 0;

  // Handle promo code submission
  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !onApplyPromo) return;
    
    setIsApplyingPromo(true);
    try {
      await onApplyPromo(promoCode.trim());
      setPromoCode('');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  // Render line item
  const renderLineItem = (
    label: string,
    value: number,
    options?: {
      description?: string;
      icon?: string;
      highlight?: boolean;
      type?: 'default' | 'discount' | 'fee' | 'tax';
      showPlus?: boolean;
    }
  ) => {
    const isDiscount = options?.type === 'discount';
    const isNegative = value < 0;
    
    return (
      <div 
        className={cn(
          'flex justify-between items-start gap-2',
          options?.highlight && 'font-medium'
        )}
      >
        <div className="flex items-center gap-2">
          {options?.icon && (
            <Icon 
              icon={options.icon} 
              size="xs" 
              className="text-neutral-500 dark:text-neutral-400"
            />
          )}
          <div>
            <span className={cn(
              'text-sm',
              options?.highlight && 'text-base'
            )}>
              {label}
            </span>
            {options?.description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {options.description}
              </p>
            )}
          </div>
        </div>
        <Price
          amount={Math.abs(value)}
          currency={currency}
          size="sm"
          className={cn(
            options?.highlight && 'text-base font-medium',
            (isDiscount || isNegative) && 'text-green-600 dark:text-green-400'
          )}
          prefix={(isDiscount || isNegative) ? '-' : (options?.showPlus ? '+' : '')}
        />
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn(
        'rounded-lg border bg-card p-4 space-y-3',
        className
      )}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
          <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>
      </div>
    );
  }

  const summaryContent = (
    <>
      {/* Header */}
      {variant !== 'minimal' && (
        <div className={cn(
          'flex items-center justify-between',
          collapsible && 'cursor-pointer',
          headerClassName
        )}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        >
          <h3 className="font-semibold text-lg">Order Summary</h3>
          {collapsible && (
            <Icon
              icon={isExpanded ? 'chevron-up' : 'chevron-down'}
              size="sm"
              className="text-neutral-500 dark:text-neutral-400"
            />
          )}
        </div>
      )}

      {/* Breakdown */}
      {showBreakdown && (!collapsible || isExpanded) && variant !== 'minimal' && (
        <div className={cn('space-y-2 pt-3', itemsClassName)}>
          {/* Subtotal */}
          {renderLineItem(subtotalLabel, subtotal)}

          {/* Custom line items */}
          {items.map((item, index) => (
            <div key={index}>
              {renderLineItem(item.label, item.value, {
                description: item.description,
                icon: item.icon,
                highlight: item.highlight,
                type: item.type,
              })}
            </div>
          ))}

          {/* Shipping */}
          {shipping && (
            <>
              {renderLineItem(
                shippingLabel,
                shipping.amount,
                {
                  description: shipping.method || shipping.estimatedDays,
                  icon: 'truck',
                  type: shipping.isFree ? 'discount' : 'default',
                }
              )}
              {shipping.isFree && shipping.freeThreshold && subtotal < shipping.freeThreshold && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Add <Price amount={shipping.freeThreshold - subtotal} currency={currency} size="xs" /> 
                  {' '}more for free shipping
                </p>
              )}
            </>
          )}

          {/* Discount */}
          {discount && discount.amount > 0 && (
            <div>
              {renderLineItem(
                discount.code ? `${discountLabel} (${discount.code})` : discountLabel,
                discount.amount,
                {
                  description: discount.description,
                  icon: 'tag',
                  type: 'discount',
                }
              )}
            </div>
          )}

          {/* Tax */}
          {tax && (
            <div>
              {renderLineItem(
                tax.rate ? `${taxLabel} (${tax.rate}%)` : taxLabel,
                tax.amount,
                {
                  icon: 'receipt',
                  type: 'tax',
                  showPlus: true,
                }
              )}
              {tax.breakdown && variant === 'detailed' && (
                <div className="ml-6 mt-1 space-y-1">
                  {tax.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                      <span>{item.label}</span>
                      <Price amount={item.amount} currency={currency} size="xs" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loyalty points */}
          {loyaltyPoints && (
            <div className="space-y-1">
              {loyaltyPoints.earned > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <Icon icon="star" size="xs" className="text-yellow-500" />
                    Points earned
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                    +{loyaltyPoints.earned}
                  </span>
                </div>
              )}
              {loyaltyPoints.used && loyaltyPoints.used > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    <Icon icon="star" size="xs" className="text-neutral-500" />
                    Points used
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    -{loyaltyPoints.used}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      {(!collapsible || isExpanded) && variant !== 'minimal' && (
        <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
      )}

      {/* Total */}
      <div className={cn(
        'flex justify-between items-start',
        totalClassName
      )}>
        <div>
          <p className="font-semibold text-lg">{totalLabel}</p>
          {tax?.inclusive && variant !== 'minimal' && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              (includes tax)
            </p>
          )}
        </div>
        <div className="text-right">
          <Price
            amount={total}
            currency={currency}
            className="text-lg font-semibold"
          />
          {showSavings && totalSavings > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {savingsLabel} {savingsPercentage}%
            </p>
          )}
        </div>
      </div>

      {/* Promo code input */}
      {showPromoCode && onApplyPromo && variant !== 'minimal' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
              placeholder="Enter promo code"
              disabled={isApplyingPromo}
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            />
            <button
              onClick={handleApplyPromo}
              disabled={!promoCode.trim() || isApplyingPromo}
              className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplyingPromo ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>
      )}

      {/* Checkout button */}
      {checkoutButton && (
        <button
          onClick={checkoutButton.onClick}
          disabled={checkoutButton.disabled || checkoutButton.loading}
          className={cn(
            'w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-md',
            'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2'
          )}
        >
          {checkoutButton.loading ? (
            <>
              <Icon icon="loader-2" size="sm" className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {checkoutButton.label || 'Proceed to Checkout'}
              <Icon icon="arrow-right" size="sm" />
            </>
          )}
        </button>
      )}

      {/* Continue shopping */}
      {continueShoppingUrl && variant !== 'minimal' && (
        <a
          href={continueShoppingUrl}
          className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          Continue Shopping
        </a>
      )}
    </>
  );

  return (
    <div
      className={cn(
        'rounded-lg border bg-card',
        variant === 'minimal' ? 'p-3 space-y-2' : 'p-4 space-y-3',
        className
      )}
      aria-label={ariaLabel || 'Order summary'}
    >
      {summaryContent}
    </div>
  );
};

CartSummary.displayName = 'CartSummary';