import React from 'react';
import { cn } from '@/lib/utils';
import { Price, PriceRange } from '../../atoms/Price/Price';
import { DiscountBadge, SaleBadge } from '../../atoms/DiscountBadge/DiscountBadge';

export interface PriceGroupProps {
  price: number | string;
  originalPrice?: number | string;
  currency?: string;
  locale?: string;
  
  // Display options
  layout?: 'horizontal' | 'vertical' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right';
  
  // Badge options
  showBadge?: boolean;
  badgePosition?: 'inline' | 'top' | 'bottom';
  badgeVariant?: 'percentage' | 'amount' | 'text';
  customBadgeText?: string;
  
  // Additional info
  showSavings?: boolean;
  savingsText?: string;
  showInstallments?: boolean;
  installmentCount?: number;
  installmentText?: string;
  
  // Price range
  priceRange?: {
    min: number | string;
    max: number | string;
  };
  
  // Styling
  className?: string;
  priceClassName?: string;
  originalPriceClassName?: string;
  badgeClassName?: string;
  savingsClassName?: string;
  
  // Additional content
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  'aria-label'?: string;
}

export const PriceGroup: React.FC<PriceGroupProps> = ({
  price,
  originalPrice,
  currency = 'USD',
  locale = 'en-US',
  layout = 'horizontal',
  size = 'md',
  align = 'left',
  showBadge = true,
  badgePosition = 'inline',
  badgeVariant = 'percentage',
  customBadgeText,
  showSavings = false,
  savingsText = 'You save',
  showInstallments = false,
  installmentCount = 12,
  installmentText = 'mo',
  priceRange,
  className,
  priceClassName,
  originalPriceClassName,
  badgeClassName,
  savingsClassName,
  prefix,
  suffix,
  'aria-label': ariaLabel,
}) => {
  // Calculate if there's a discount
  const hasDiscount = originalPrice && Number(originalPrice) > Number(price);
  const shouldShowBadge = showBadge && hasDiscount && !priceRange;
  const shouldShowSavings = showSavings && hasDiscount && !priceRange;
  const shouldShowInstallments = showInstallments && !priceRange;

  // Size mappings
  const sizeMap = {
    sm: {
      price: 'sm',
      originalPrice: 'xs',
      badge: 'xs',
      savings: 'xs',
      installments: 'xs',
    },
    md: {
      price: 'lg',
      originalPrice: 'sm',
      badge: 'sm',
      savings: 'sm',
      installments: 'sm',
    },
    lg: {
      price: 'xl',
      originalPrice: 'md',
      badge: 'md',
      savings: 'md',
      installments: 'md',
    },
    xl: {
      price: '2xl',
      originalPrice: 'lg',
      badge: 'lg',
      savings: 'lg',
      installments: 'lg',
    },
  } as const;

  const sizes = sizeMap[size];

  // Layout classes
  const layoutClasses = {
    horizontal: 'flex flex-wrap items-baseline gap-2',
    vertical: 'flex flex-col gap-1',
    compact: 'inline-flex items-baseline gap-2',
  };

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center items-center',
    right: 'justify-end items-end',
  };

  // Calculate savings
  const savingsAmount = hasDiscount
    ? Number(originalPrice) - Number(price)
    : 0;

  const savingsPercentage = hasDiscount
    ? Math.round((savingsAmount / Number(originalPrice)) * 100)
    : 0;

  // Calculate installment price
  const installmentPrice = installmentCount > 0
    ? Number(price) / installmentCount
    : 0;

  // Render badge
  const renderBadge = () => {
    if (!shouldShowBadge) return null;

    if (customBadgeText) {
      return (
        <DiscountBadge
          value={customBadgeText}
          type="text"
          size={sizes.badge}
          className={badgeClassName}
        />
      );
    }

    return (
      <SaleBadge
        originalPrice={Number(originalPrice)}
        salePrice={Number(price)}
        showAmount={badgeVariant === 'amount'}
        currency={currency}
        size={sizes.badge}
        className={badgeClassName}
      />
    );
  };

  // Render savings info
  const renderSavings = () => {
    if (!shouldShowSavings) return null;

    return (
      <span
        className={cn(
          'text-success-600 dark:text-success-400',
          `text-${sizes.savings}`,
          savingsClassName
        )}
      >
        {savingsText}{' '}
        <Price
          amount={savingsAmount}
          currency={currency}
          locale={locale}
          size={sizes.savings}
          variant="sale"
          showCurrency={badgeVariant !== 'percentage'}
        />
        {badgeVariant === 'percentage' && ` (${savingsPercentage}%)`}
      </span>
    );
  };

  // Render installments
  const renderInstallments = () => {
    if (!shouldShowInstallments) return null;

    return (
      <span className={cn('text-neutral-600 dark:text-neutral-400', `text-${sizes.installments}`)}>
        or{' '}
        <Price
          amount={installmentPrice}
          currency={currency}
          locale={locale}
          size={sizes.installments}
          weight="semibold"
        />
        /{installmentText}
      </span>
    );
  };

  // Render price range
  if (priceRange) {
    return (
      <div
        className={cn(
          layoutClasses[layout],
          align !== 'left' && alignClasses[align],
          className
        )}
        aria-label={ariaLabel}
      >
        {prefix}
        <PriceRange
          minAmount={priceRange.min}
          maxAmount={priceRange.max}
          currency={currency}
          locale={locale}
          size={sizes.price}
          className={priceClassName}
        />
        {suffix}
      </div>
    );
  }

  // Main render
  const priceContent = (
    <>
      {prefix}
      <Price
        amount={price}
        originalAmount={originalPrice}
        currency={currency}
        locale={locale}
        size={sizes.price}
        className={priceClassName}
        originalClassName={originalPriceClassName}
        showOriginal={hasDiscount}
      />
      {badgePosition === 'inline' && renderBadge()}
      {suffix}
    </>
  );

  const additionalContent = (
    <>
      {badgePosition === 'bottom' && renderBadge()}
      {renderSavings()}
      {renderInstallments()}
    </>
  );

  return (
    <div
      className={cn(
        layout === 'vertical' && 'inline-flex flex-col',
        align !== 'left' && alignClasses[align],
        className
      )}
      aria-label={ariaLabel}
    >
      {badgePosition === 'top' && (
        <div className="mb-1">{renderBadge()}</div>
      )}
      
      <div className={cn(layoutClasses[layout])}>
        {priceContent}
      </div>
      
      {(layout === 'vertical' || (layout === 'horizontal' && (shouldShowSavings || shouldShowInstallments))) && (
        <div className={cn(
          layout === 'horizontal' ? 'flex flex-wrap gap-3 mt-1' : 'flex flex-col gap-1'
        )}>
          {additionalContent}
        </div>
      )}
    </div>
  );
};

PriceGroup.displayName = 'PriceGroup';

// Specialized price group for product cards
export interface ProductPriceGroupProps extends Omit<PriceGroupProps, 'layout' | 'showInstallments'> {
  rating?: number;
  reviewCount?: number;
  showRating?: boolean;
  ratingPosition?: 'above' | 'below';
}

export const ProductPriceGroup: React.FC<ProductPriceGroupProps> = ({
  rating,
  reviewCount,
  showRating = true,
  ratingPosition = 'above',
  size = 'md',
  ...props
}) => {
  const hasRating = showRating && rating !== undefined;

  return (
    <div className="space-y-1">
      {hasRating && ratingPosition === 'above' && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-warning-500">★ {rating}</span>
          {reviewCount !== undefined && (
            <span className="text-neutral-500">({reviewCount})</span>
          )}
        </div>
      )}
      
      <PriceGroup
        layout="vertical"
        size={size}
        showBadge
        badgePosition="inline"
        {...props}
      />
      
      {hasRating && ratingPosition === 'below' && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-warning-500">★ {rating}</span>
          {reviewCount !== undefined && (
            <span className="text-neutral-500">({reviewCount})</span>
          )}
        </div>
      )}
    </div>
  );
};

// Comparison price group for showing multiple prices
export interface ComparisonPriceGroupProps {
  prices: Array<{
    label: string;
    price: number | string;
    originalPrice?: number | string;
    highlighted?: boolean;
  }>;
  currency?: string;
  locale?: string;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const ComparisonPriceGroup: React.FC<ComparisonPriceGroupProps> = ({
  prices,
  currency = 'USD',
  locale = 'en-US',
  layout = 'horizontal',
  className,
}) => {
  return (
    <div
      className={cn(
        layout === 'horizontal' ? 'flex gap-6' : 'space-y-3',
        className
      )}
    >
      {prices.map((item, index) => (
        <div
          key={index}
          className={cn(
            'text-center',
            item.highlighted && 'ring-2 ring-primary-500 rounded-lg p-3'
          )}
        >
          <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            {item.label}
          </div>
          <PriceGroup
            price={item.price}
            originalPrice={item.originalPrice}
            currency={currency}
            locale={locale}
            size={item.highlighted ? 'lg' : 'md'}
            align="center"
            showBadge={false}
          />
        </div>
      ))}
    </div>
  );
};