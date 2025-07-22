import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define badge variants
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[20px] px-2 py-1 text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-neutral-200 text-neutral-900',
        primary: 'bg-primary-500 text-white',
        secondary: 'bg-primary-50 text-primary-900',
        success: 'bg-success-50 text-success-900',
        warning: 'bg-warning-50 text-warning-900',
        danger: 'bg-danger-50 text-danger-900',
        outline: 'border border-neutral-300 bg-transparent text-neutral-900',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Content
  children: React.ReactNode;
  
  // Removable
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      children,
      removable,
      onRemove,
      ...props
    },
    ref
  ) => {
    // Default icons based on size
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {leftIcon && (
          <span className={cn('shrink-0', iconSize)}>
            {leftIcon}
          </span>
        )}
        
        <span className="leading-[20px]">{children}</span>
        
        {rightIcon && !removable && (
          <span className={cn('shrink-0', iconSize)}>
            {rightIcon}
          </span>
        )}
        
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className={cn(
              'shrink-0 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1',
              iconSize,
              variant === 'primary' && 'hover:bg-white/20 focus:ring-white',
              variant === 'secondary' && 'focus:ring-primary-500',
              variant === 'success' && 'focus:ring-success-600',
              variant === 'warning' && 'focus:ring-warning-600',
              variant === 'danger' && 'focus:ring-danger-600'
            )}
            aria-label="Remove"
          >
            <svg
              className="h-full w-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

// Common icon components for badges
export const BadgeIcons = {
  Plus: ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  ),
  Check: ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  Info: ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Alert: ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  Star: ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Dot: ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="4" cy="4" r="3" />
    </svg>
  ),
};

export { Badge, badgeVariants };