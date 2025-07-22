import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Price variants
const priceVariants = cva(
  'font-medium tabular-nums',
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
      },
      variant: {
        default: 'text-neutral-900',
        primary: 'text-primary-600',
        sale: 'text-danger-600',
        muted: 'text-neutral-500',
        strikethrough: 'text-neutral-500 line-through',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      weight: 'medium',
    },
  }
);

export interface PriceProps extends VariantProps<typeof priceVariants> {
  amount: number | string;
  currency?: string;
  currencyDisplay?: 'symbol' | 'code' | 'name';
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showCurrency?: boolean;
  currencyPosition?: 'before' | 'after';
  originalAmount?: number | string;
  showOriginal?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
  originalClassName?: string;
  as?: 'span' | 'div' | 'p';
  'aria-label'?: string;
}

// Format price with locale and currency
const formatPrice = (
  amount: number | string,
  currency: string,
  locale: string,
  options: {
    currencyDisplay?: 'symbol' | 'code' | 'name';
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): { value: string; currencySymbol: string } => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return { value: '0', currencySymbol: currency };
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: options.currencyDisplay || 'symbol',
      minimumFractionDigits: options.minimumFractionDigits ?? 2,
      maximumFractionDigits: options.maximumFractionDigits ?? 2,
    });

    const formatted = formatter.format(numericAmount);
    
    // Extract currency symbol
    const parts = formatter.formatToParts(numericAmount);
    const currencyPart = parts.find(part => part.type === 'currency');
    const currencySymbol = currencyPart?.value || currency;

    // Remove currency from formatted string for custom positioning
    const valueWithoutCurrency = parts
      .filter(part => part.type !== 'currency')
      .map(part => part.value)
      .join('')
      .trim();

    return { value: valueWithoutCurrency, currencySymbol };
  } catch (error) {
    // Fallback formatting
    const value = numericAmount.toFixed(options.minimumFractionDigits ?? 2);
    return { value, currencySymbol: currency };
  }
};

export const Price: React.FC<PriceProps> = ({
  amount,
  currency = 'USD',
  currencyDisplay = 'symbol',
  locale = 'en-US',
  minimumFractionDigits,
  maximumFractionDigits,
  showCurrency = true,
  currencyPosition = 'before',
  originalAmount,
  showOriginal = true,
  prefix,
  suffix,
  className,
  originalClassName,
  size,
  variant,
  weight,
  as: Component = 'span',
  'aria-label': ariaLabel,
}) => {
  const { value, currencySymbol } = formatPrice(amount, currency, locale, {
    currencyDisplay,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formattedOriginal = originalAmount
    ? formatPrice(originalAmount, currency, locale, {
        currencyDisplay,
        minimumFractionDigits,
        maximumFractionDigits,
      })
    : null;

  const hasDiscount = originalAmount && 
    parseFloat(amount.toString()) < parseFloat(originalAmount.toString());

  const priceContent = (
    <>
      {prefix && <span className="mr-1">{prefix}</span>}
      {showCurrency && currencyPosition === 'before' && (
        <span className="mr-0.5">{currencySymbol}</span>
      )}
      <span>{value}</span>
      {showCurrency && currencyPosition === 'after' && (
        <span className="ml-0.5">{currencySymbol}</span>
      )}
      {suffix && <span className="ml-1">{suffix}</span>}
    </>
  );

  const label = ariaLabel || 
    `${prefix || ''}${showCurrency ? currencySymbol : ''}${value}${suffix || ''}`;

  return (
    <div className="inline-flex items-baseline gap-2">
      {showOriginal && formattedOriginal && hasDiscount && (
        <Component
          className={cn(
            priceVariants({ 
              size: size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : 'sm',
              variant: 'strikethrough',
              weight: 'normal'
            }),
            originalClassName
          )}
          aria-label={`Original price: ${showCurrency ? currencySymbol : ''}${formattedOriginal.value}`}
        >
          {showCurrency && currencyPosition === 'before' && (
            <span className="mr-0.5">{currencySymbol}</span>
          )}
          <span>{formattedOriginal.value}</span>
          {showCurrency && currencyPosition === 'after' && (
            <span className="ml-0.5">{currencySymbol}</span>
          )}
        </Component>
      )}
      
      <Component
        className={cn(
          priceVariants({ 
            size, 
            variant: hasDiscount && variant === 'default' ? 'sale' : variant,
            weight 
          }),
          className
        )}
        aria-label={label}
      >
        {priceContent}
      </Component>
    </div>
  );
};

Price.displayName = 'Price';

// Utility component for displaying price ranges
export interface PriceRangeProps {
  minAmount: number | string;
  maxAmount: number | string;
  currency?: string;
  locale?: string;
  size?: PriceProps['size'];
  variant?: PriceProps['variant'];
  weight?: PriceProps['weight'];
  className?: string;
  separator?: string;
}

export const PriceRange: React.FC<PriceRangeProps> = ({
  minAmount,
  maxAmount,
  currency = 'USD',
  locale = 'en-US',
  size = 'md',
  variant = 'default',
  weight = 'medium',
  className,
  separator = ' - ',
}) => {
  return (
    <span className={cn('inline-flex items-baseline', className)}>
      <Price
        amount={minAmount}
        currency={currency}
        locale={locale}
        size={size}
        variant={variant}
        weight={weight}
        showOriginal={false}
      />
      <span className={cn('mx-1', priceVariants({ size, variant, weight }))}>
        {separator}
      </span>
      <Price
        amount={maxAmount}
        currency={currency}
        locale={locale}
        size={size}
        variant={variant}
        weight={weight}
        showOriginal={false}
      />
    </span>
  );
};

// Utility hook for price calculations
export const usePriceCalculations = (
  price: number,
  { 
    taxRate = 0,
    discount = 0,
    discountType = 'percentage' as 'percentage' | 'fixed',
    quantity = 1,
  } = {}
) => {
  const discountAmount = discountType === 'percentage' 
    ? price * (discount / 100)
    : discount;
    
  const discountedPrice = Math.max(0, price - discountAmount);
  const taxAmount = discountedPrice * (taxRate / 100);
  const finalPrice = discountedPrice + taxAmount;
  const totalPrice = finalPrice * quantity;
  const savings = price - discountedPrice;
  const savingsPercentage = price > 0 ? (savings / price) * 100 : 0;

  return {
    originalPrice: price,
    discountAmount,
    discountedPrice,
    taxAmount,
    finalPrice,
    totalPrice,
    savings,
    savingsPercentage,
  };
};