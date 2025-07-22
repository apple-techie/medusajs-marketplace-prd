import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '../Icon/Icon';

// DiscountBadge variants
const discountBadgeVariants = cva(
  'inline-flex items-center justify-center font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        filled: 'text-white',
        outlined: 'bg-transparent border',
        gradient: 'text-white',
        subtle: '',
      },
      color: {
        red: '',
        green: '',
        orange: '',
        purple: '',
        primary: '',
      },
      size: {
        xs: 'text-xs px-1.5 py-0.5 rounded',
        sm: 'text-sm px-2 py-0.5 rounded-md',
        md: 'text-base px-3 py-1 rounded-md',
        lg: 'text-lg px-4 py-1.5 rounded-lg',
      },
      shape: {
        rounded: '',
        square: 'rounded-none',
        pill: 'rounded-full',
        flag: 'rounded-r-full',
      },
      position: {
        'top-left': 'absolute top-2 left-2',
        'top-right': 'absolute top-2 right-2',
        'bottom-left': 'absolute bottom-2 left-2',
        'bottom-right': 'absolute bottom-2 right-2',
        inline: '',
      },
    },
    compoundVariants: [
      // Filled variants
      {
        variant: 'filled',
        color: 'red',
        className: 'bg-red-600',
      },
      {
        variant: 'filled',
        color: 'green',
        className: 'bg-green-600',
      },
      {
        variant: 'filled',
        color: 'orange',
        className: 'bg-orange-600',
      },
      {
        variant: 'filled',
        color: 'purple',
        className: 'bg-purple-600',
      },
      {
        variant: 'filled',
        color: 'primary',
        className: 'bg-primary-600',
      },
      // Outlined variants
      {
        variant: 'outlined',
        color: 'red',
        className: 'border-red-600 text-red-600',
      },
      {
        variant: 'outlined',
        color: 'green',
        className: 'border-green-600 text-green-600',
      },
      {
        variant: 'outlined',
        color: 'orange',
        className: 'border-orange-600 text-orange-600',
      },
      {
        variant: 'outlined',
        color: 'purple',
        className: 'border-purple-600 text-purple-600',
      },
      {
        variant: 'outlined',
        color: 'primary',
        className: 'border-primary-600 text-primary-600',
      },
      // Gradient variants
      {
        variant: 'gradient',
        color: 'red',
        className: 'bg-gradient-to-r from-red-600 to-red-700',
      },
      {
        variant: 'gradient',
        color: 'green',
        className: 'bg-gradient-to-r from-green-600 to-green-700',
      },
      {
        variant: 'gradient',
        color: 'orange',
        className: 'bg-gradient-to-r from-orange-600 to-orange-700',
      },
      {
        variant: 'gradient',
        color: 'purple',
        className: 'bg-gradient-to-r from-purple-600 to-purple-700',
      },
      {
        variant: 'gradient',
        color: 'primary',
        className: 'bg-gradient-to-r from-primary-600 to-primary-700',
      },
      // Subtle variants
      {
        variant: 'subtle',
        color: 'red',
        className: 'bg-red-100 text-red-700',
      },
      {
        variant: 'subtle',
        color: 'green',
        className: 'bg-green-100 text-green-700',
      },
      {
        variant: 'subtle',
        color: 'orange',
        className: 'bg-orange-100 text-orange-700',
      },
      {
        variant: 'subtle',
        color: 'purple',
        className: 'bg-purple-100 text-purple-700',
      },
      {
        variant: 'subtle',
        color: 'primary',
        className: 'bg-primary-100 text-primary-700',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      color: 'red',
      size: 'sm',
      shape: 'rounded',
      position: 'inline',
    },
  }
);

export interface DiscountBadgeProps extends VariantProps<typeof discountBadgeVariants> {
  value: number;
  type?: 'percentage' | 'fixed' | 'text';
  currency?: string;
  prefix?: string;
  suffix?: string;
  showIcon?: boolean;
  icon?: string;
  animate?: boolean;
  pulse?: boolean;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  value,
  type = 'percentage',
  currency = '$',
  prefix,
  suffix,
  showIcon = false,
  icon = 'tag',
  animate = false,
  pulse = false,
  className,
  children,
  'aria-label': ariaLabel,
  variant,
  color,
  size,
  shape,
  position,
}) => {
  // Format the discount text
  const getDiscountText = () => {
    if (children) return children;
    
    let text = '';
    
    if (prefix) text += prefix + ' ';
    
    switch (type) {
      case 'percentage':
        text += `-${value}%`;
        break;
      case 'fixed':
        text += `-${currency}${value}`;
        break;
      case 'text':
        text += value;
        break;
    }
    
    if (suffix) text += ' ' + suffix;
    
    return text;
  };

  const discountText = getDiscountText();
  const label = ariaLabel || `Discount: ${discountText}`;

  const animationClasses = cn(
    animate && 'animate-bounce-slow',
    pulse && 'animate-pulse'
  );

  return (
    <span
      className={cn(
        discountBadgeVariants({ variant, color, size, shape, position }),
        animationClasses,
        className
      )}
      aria-label={label}
    >
      {showIcon && (
        <Icon 
          icon={icon} 
          size="xs" 
          className={cn(
            'mr-1',
            size === 'xs' && 'w-3 h-3',
            size === 'sm' && 'w-3.5 h-3.5',
            size === 'md' && 'w-4 h-4',
            size === 'lg' && 'w-5 h-5'
          )} 
        />
      )}
      {discountText}
    </span>
  );
};

DiscountBadge.displayName = 'DiscountBadge';

// Utility component for common discount scenarios
export interface SaleBadgeProps extends Omit<DiscountBadgeProps, 'type' | 'value'> {
  originalPrice: number;
  salePrice: number;
  showAmount?: boolean;
}

export const SaleBadge: React.FC<SaleBadgeProps> = ({
  originalPrice,
  salePrice,
  showAmount = false,
  currency = '$',
  ...props
}) => {
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  const savings = originalPrice - salePrice;

  if (showAmount) {
    return (
      <DiscountBadge
        value={savings}
        type="fixed"
        currency={currency}
        prefix="Save"
        {...props}
      />
    );
  }

  return (
    <DiscountBadge
      value={discount}
      type="percentage"
      {...props}
    />
  );
};

// Limited time badge
export interface LimitedTimeBadgeProps extends Omit<DiscountBadgeProps, 'value' | 'type'> {
  endTime?: Date;
  text?: string;
}

export const LimitedTimeBadge: React.FC<LimitedTimeBadgeProps> = ({
  endTime,
  text = 'Limited Time',
  icon = 'clock',
  color = 'orange',
  animate = true,
  ...props
}) => {
  const [timeLeft, setTimeLeft] = React.useState<string>('');

  React.useEffect(() => {
    if (!endTime) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <DiscountBadge
      value={timeLeft || text}
      type="text"
      icon={icon}
      showIcon={true}
      color={color}
      animate={animate}
      {...props}
    />
  );
};

// New arrival badge
export const NewBadge: React.FC<Omit<DiscountBadgeProps, 'value' | 'type'>> = ({
  color = 'green',
  children = 'New',
  ...props
}) => {
  return (
    <DiscountBadge
      value={children as string}
      type="text"
      color={color}
      {...props}
    />
  );
};

// Hot/Trending badge
export const HotBadge: React.FC<Omit<DiscountBadgeProps, 'value' | 'type'>> = ({
  color = 'orange',
  icon = 'flame',
  showIcon = true,
  children = 'Hot',
  animate = true,
  ...props
}) => {
  return (
    <DiscountBadge
      value={children as string}
      type="text"
      color={color}
      icon={icon}
      showIcon={showIcon}
      animate={animate}
      {...props}
    />
  );
};