import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define chip variants
const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-[20px] px-3 py-2 text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50',
        filled: 'bg-neutral-900 text-white hover:bg-neutral-800',
        primary: 'border border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100',
        secondary: 'border border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        success: 'border border-success-300 bg-success-50 text-success-700 hover:bg-success-100',
        warning: 'border border-warning-300 bg-warning-50 text-warning-700 hover:bg-warning-100',
        danger: 'border border-danger-300 bg-danger-50 text-danger-700 hover:bg-danger-100',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
      },
      clickable: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      clickable: false,
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Content
  children: React.ReactNode;
  
  // Behavior
  onRemove?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      clickable,
      leftIcon,
      rightIcon,
      children,
      onRemove,
      selected,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    // Default icons based on size
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    
    // Determine if chip is interactive
    const isClickable = !!(onClick || onRemove || clickable);
    
    // Handle click
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(e);
    };
    
    // Handle remove
    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onRemove?.();
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          chipVariants({ variant, size, clickable: isClickable, className }),
          selected && 'ring-2 ring-primary-500 ring-offset-1',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={handleClick}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable && !disabled ? 0 : undefined}
        aria-selected={selected}
        aria-disabled={disabled}
        {...props}
      >
        {leftIcon && (
          <span className={cn('shrink-0', iconSize)}>
            {leftIcon}
          </span>
        )}
        
        <span className="leading-[20px]">{children}</span>
        
        {rightIcon && !onRemove && (
          <span className={cn('shrink-0', iconSize)}>
            {rightIcon}
          </span>
        )}
        
        {onRemove && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className={cn(
              'shrink-0 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1 ml-1',
              iconSize,
              variant === 'filled' && 'hover:bg-white/20 focus:ring-white',
              variant === 'primary' && 'focus:ring-primary-500',
              variant === 'success' && 'focus:ring-success-600',
              variant === 'warning' && 'focus:ring-warning-600',
              variant === 'danger' && 'focus:ring-danger-600',
              disabled && 'cursor-not-allowed'
            )}
            aria-label="Remove chip"
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

Chip.displayName = 'Chip';

// Chip Group component for managing multiple chips
export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
}

export const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ className, children, spacing = 'normal', ...props }, ref) => {
    const spacingClasses = {
      tight: 'gap-1',
      normal: 'gap-2',
      loose: 'gap-3',
    };
    
    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap', spacingClasses[spacing], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ChipGroup.displayName = 'ChipGroup';

// Common chip icons
export const ChipIcons = {
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
  Filter: ({ className }: { className?: string }) => (
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
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  ),
  Tag: ({ className }: { className?: string }) => (
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
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
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
};

export { Chip, chipVariants };