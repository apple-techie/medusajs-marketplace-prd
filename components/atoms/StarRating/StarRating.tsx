import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '../Icon/Icon';

// StarRating variants
const starRatingVariants = cva(
  'inline-flex items-center gap-0.5',
  {
    variants: {
      size: {
        xs: '[&_svg]:w-3 [&_svg]:h-3',
        sm: '[&_svg]:w-4 [&_svg]:h-4',
        md: '[&_svg]:w-5 [&_svg]:h-5',
        lg: '[&_svg]:w-6 [&_svg]:h-6',
        xl: '[&_svg]:w-8 [&_svg]:h-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface StarRatingProps extends VariantProps<typeof starRatingVariants> {
  rating: number;
  maxRating?: number;
  precision?: 0.5 | 1;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (rating: number) => void;
  onHover?: (rating: number | null) => void;
  showValue?: boolean;
  valuePosition?: 'left' | 'right' | 'none';
  emptyIcon?: string;
  filledIcon?: string;
  halfFilledIcon?: string;
  emptyColor?: string;
  filledColor?: string;
  className?: string;
  starClassName?: string;
  valueClassName?: string;
  'aria-label'?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  precision = 1,
  readOnly = true,
  disabled = false,
  onChange,
  onHover,
  showValue = false,
  valuePosition = 'right',
  emptyIcon = 'star',
  filledIcon = 'star',
  halfFilledIcon = 'star',
  emptyColor = 'text-neutral-300',
  filledColor = 'text-yellow-400',
  className,
  starClassName,
  valueClassName,
  'aria-label': ariaLabel,
  size,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [internalRating, setInternalRating] = React.useState(rating);

  React.useEffect(() => {
    setInternalRating(rating);
  }, [rating]);

  const displayRating = hoverRating !== null ? hoverRating : internalRating;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (readOnly || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    
    let newRating: number;
    if (precision === 0.5) {
      newRating = x < width / 2 ? starIndex + 0.5 : starIndex + 1;
    } else {
      newRating = starIndex + 1;
    }
    
    setHoverRating(newRating);
    onHover?.(newRating);
  };

  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    setHoverRating(null);
    onHover?.(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (readOnly || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    
    let newRating: number;
    if (precision === 0.5) {
      newRating = x < width / 2 ? starIndex + 0.5 : starIndex + 1;
    } else {
      newRating = starIndex + 1;
    }
    
    setInternalRating(newRating);
    onChange?.(newRating);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (readOnly || disabled) return;

    let newRating = internalRating;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newRating = Math.max(precision, internalRating - precision);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newRating = Math.min(maxRating, internalRating + precision);
        break;
      case 'Home':
        event.preventDefault();
        newRating = precision;
        break;
      case 'End':
        event.preventDefault();
        newRating = maxRating;
        break;
      default:
        return;
    }

    setInternalRating(newRating);
    onChange?.(newRating);
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = displayRating >= starValue;
    const isHalfFilled = displayRating > index && displayRating < starValue;

    let iconName = emptyIcon;
    let iconClass = emptyColor;

    if (isFilled) {
      iconName = filledIcon;
      iconClass = filledColor;
    } else if (isHalfFilled) {
      iconName = halfFilledIcon;
      iconClass = filledColor;
    }

    return (
      <div
        key={index}
        className={cn(
          'relative',
          !readOnly && !disabled && 'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          starClassName
        )}
        onMouseMove={(e) => handleMouseMove(e, index)}
        onClick={(e) => handleClick(e, index)}
        role={!readOnly ? 'radio' : undefined}
        aria-checked={!readOnly ? displayRating === starValue : undefined}
        aria-label={!readOnly ? `${starValue} star${starValue !== 1 ? 's' : ''}` : undefined}
      >
        {isHalfFilled ? (
          <>
            <Icon icon={filledIcon} className={cn('absolute', filledColor)} />
            <Icon icon={emptyIcon} className={cn('absolute', emptyColor)} style={{ clipPath: 'inset(0 0 0 50%)' }} />
          </>
        ) : (
          <Icon icon={iconName} className={iconClass} />
        )}
      </div>
    );
  };

  const stars = Array.from({ length: maxRating }, (_, i) => renderStar(i));

  const ratingValue = (
    <span className={cn('text-sm font-medium text-neutral-600', valueClassName)}>
      {displayRating.toFixed(precision === 0.5 && displayRating % 1 !== 0 ? 1 : 0)}
    </span>
  );

  const ratingLabel = ariaLabel || `Rating: ${displayRating} out of ${maxRating} stars`;

  return (
    <div
      className={cn(starRatingVariants({ size }), className)}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role={!readOnly ? 'radiogroup' : undefined}
      aria-label={ratingLabel}
      tabIndex={!readOnly && !disabled ? 0 : undefined}
    >
      {showValue && valuePosition === 'left' && ratingValue}
      {stars}
      {showValue && valuePosition === 'right' && ratingValue}
    </div>
  );
};

StarRating.displayName = 'StarRating';

// Simplified read-only variant for common use cases
export const StarRatingDisplay: React.FC<
  Pick<StarRatingProps, 'rating' | 'size' | 'className' | 'showValue'> & {
    maxRating?: number;
    count?: number;
    showCount?: boolean;
  }
> = ({ 
  rating, 
  maxRating = 5, 
  size = 'sm', 
  className,
  showValue = true,
  count,
  showCount = false,
}) => {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <StarRating
        rating={rating}
        maxRating={maxRating}
        size={size}
        readOnly
        showValue={false}
      />
      {(showValue || showCount) && (
        <span className="text-sm text-neutral-600">
          {showValue && rating.toFixed(1)}
          {showValue && showCount && ' '}
          {showCount && count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  );
};