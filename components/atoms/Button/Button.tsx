import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles that apply to all buttons
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary variants (filled)
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
        primaryDark: 'bg-primary-800 text-white hover:bg-primary-900 focus-visible:ring-primary-800',
        
        // Ghost variants (text only with hover background)
        ghost: 'text-primary-500 hover:bg-primary-50 hover:text-primary-600',
        ghostDark: 'text-primary-800 hover:bg-primary-100 hover:text-primary-900',
        
        // Outline variants
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
        outlineDark: 'border-2 border-primary-800 text-primary-800 hover:bg-primary-100',
        outlineNeutral: 'border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-100',
      },
      size: {
        sm: 'h-9 px-3 py-2 text-sm',
        md: 'h-10 px-4 py-2.5 text-base',
        lg: 'h-11 px-6 py-3 text-base',
        xl: 'h-12 px-6 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // Loading state
  isLoading?: boolean;
  loadingText?: string;
  // As child allows for custom implementations
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      leftIcon,
      rightIcon,
      isLoading = false,
      loadingText,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    // Handle loading state
    const isDisabled = disabled || isLoading;
    
    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const Comp = asChild ? React.Fragment : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };