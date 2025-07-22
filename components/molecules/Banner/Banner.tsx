import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';

// Define banner variants
const bannerVariants = cva(
  'relative flex items-start justify-between gap-4 rounded-xl p-4 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-primary-50 border-2 border-primary-500 text-neutral-900',
        info: 'bg-primary-50 border-2 border-primary-500 text-neutral-900',
        success: 'bg-success-50 border-2 border-success-500 text-neutral-900',
        warning: 'bg-warning-50 border-2 border-warning-500 text-neutral-900',
        danger: 'bg-danger-50 border-2 border-danger-500 text-neutral-900',
        neutral: 'bg-neutral-100 border-2 border-neutral-300 text-neutral-900',
      },
      size: {
        sm: 'px-4 py-3',
        md: 'px-6 py-4',
        lg: 'px-8 py-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const bannerIconVariants = cva(
  'shrink-0',
  {
    variants: {
      variant: {
        default: 'text-primary-600',
        info: 'text-primary-600',
        success: 'text-success-600',
        warning: 'text-warning-600',
        danger: 'text-danger-600',
        neutral: 'text-neutral-600',
      },
      size: {
        sm: 'h-5 w-5',
        md: 'h-7 w-7',
        lg: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Types
export interface BannerProps extends VariantProps<typeof bannerVariants> {
  heading?: string;
  subheading?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

// Icon mapping for variants
const getDefaultIcon = (variant: string): string => {
  switch (variant) {
    case 'success':
      return 'checkCircle';
    case 'warning':
      return 'alertTriangle';
    case 'danger':
      return 'alertCircle';
    case 'info':
    case 'default':
      return 'info';
    case 'neutral':
      return 'info';
    default:
      return 'info';
  }
};

// Main Banner component
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ 
    heading,
    subheading,
    icon,
    showIcon = true,
    dismissible = true,
    onDismiss,
    action,
    children,
    variant = 'default',
    size = 'md',
    className,
    'aria-label': ariaLabel,
    'aria-live': ariaLive = 'polite',
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) {
      return null;
    }

    const iconSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
    const headingSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-lg';
    const subheadingSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
    const buttonSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

    return (
      <div
        ref={ref}
        role="alert"
        aria-label={ariaLabel}
        aria-live={ariaLive}
        className={cn(bannerVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex items-start gap-4 flex-1">
          {showIcon && (
            <div className={cn(bannerIconVariants({ variant, size }))}>
              {icon || <Icon icon={getDefaultIcon(variant as string)} size={iconSize} />}
            </div>
          )}
          
          <div className="flex-1 space-y-1">
            {(heading || subheading) && (
              <>
                {heading && (
                  <h3 className={cn(
                    "font-semibold leading-tight",
                    headingSize
                  )}>
                    {heading}
                  </h3>
                )}
                {subheading && (
                  <p className={cn(
                    "text-neutral-700 leading-normal",
                    subheadingSize
                  )}>
                    {subheading}
                  </p>
                )}
              </>
            )}
            
            {children && (
              <div className={cn(
                "leading-normal",
                subheadingSize
              )}>
                {children}
              </div>
            )}
            
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className={cn(
                  "mt-2 font-medium underline hover:no-underline transition-all",
                  variant === 'default' || variant === 'info' ? 'text-primary-700 hover:text-primary-800' :
                  variant === 'success' ? 'text-success-700 hover:text-success-800' :
                  variant === 'warning' ? 'text-warning-700 hover:text-warning-800' :
                  variant === 'danger' ? 'text-danger-700 hover:text-danger-800' :
                  'text-neutral-700 hover:text-neutral-800',
                  buttonSize
                )}
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
        
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={cn(
              "shrink-0 p-1 rounded-lg transition-colors hover:bg-black/5",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              variant === 'default' || variant === 'info' ? 'focus:ring-primary-500' :
              variant === 'success' ? 'focus:ring-success-500' :
              variant === 'warning' ? 'focus:ring-warning-500' :
              variant === 'danger' ? 'focus:ring-danger-500' :
              'focus:ring-neutral-400'
            )}
            aria-label="Dismiss banner"
          >
            <Icon 
              icon="close" 
              size={size === 'sm' ? 'xs' : 'sm'}
              className={cn(
                variant === 'default' || variant === 'info' ? 'text-primary-600' :
                variant === 'success' ? 'text-success-600' :
                variant === 'warning' ? 'text-warning-600' :
                variant === 'danger' ? 'text-danger-600' :
                'text-neutral-600'
              )}
            />
          </button>
        )}
      </div>
    );
  }
);

Banner.displayName = 'Banner';

// Persistent Banner component (doesn't auto-hide)
export interface PersistentBannerProps extends Omit<BannerProps, 'dismissible' | 'onDismiss'> {
  storageKey?: string;
}

export const PersistentBanner = React.forwardRef<HTMLDivElement, PersistentBannerProps>(
  ({ storageKey, ...props }, ref) => {
    const [isDismissed, setIsDismissed] = useState(() => {
      if (storageKey && typeof window !== 'undefined') {
        return localStorage.getItem(storageKey) === 'dismissed';
      }
      return false;
    });

    const handleDismiss = () => {
      setIsDismissed(true);
      if (storageKey && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, 'dismissed');
      }
    };

    if (isDismissed) {
      return null;
    }

    return (
      <Banner
        ref={ref}
        {...props}
        dismissible={true}
        onDismiss={handleDismiss}
      />
    );
  }
);

PersistentBanner.displayName = 'PersistentBanner';

// Hook for managing banner state
export const useBanner = (initialVisible = true) => {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [message, setMessage] = useState<{
    heading?: string;
    subheading?: string;
    variant?: BannerProps['variant'];
  }>({});

  const show = (
    heading?: string, 
    subheading?: string, 
    variant?: BannerProps['variant']
  ) => {
    setMessage({ heading, subheading, variant });
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  const toggle = () => {
    setIsVisible(prev => !prev);
  };

  return {
    isVisible,
    message,
    show,
    hide,
    toggle,
    setMessage,
  };
};

export { bannerVariants, bannerIconVariants };