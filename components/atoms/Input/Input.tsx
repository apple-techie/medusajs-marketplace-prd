import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define input variants
const inputVariants = cva(
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-normal text-neutral-800 placeholder:text-neutral-500 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-neutral-100 shadow-sm hover:border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
        error: 'border-danger-500 focus:border-danger-600 focus:ring-2 focus:ring-danger-500/20 focus:outline-none',
        success: 'border-success-500 focus:border-success-600 focus:ring-2 focus:ring-success-500/20 focus:outline-none',
      },
      size: {
        sm: 'h-9 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-11 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Input wrapper for icons and addons
const inputWrapperVariants = cva(
  'relative flex items-center overflow-hidden rounded-xl bg-white',
  {
    variants: {
      variant: {
        default: 'border border-neutral-100 shadow-sm hover:border-neutral-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
        error: 'border border-danger-500 focus-within:border-danger-600 focus-within:ring-2 focus-within:ring-danger-500/20',
        success: 'border border-success-500 focus-within:border-success-600 focus-within:ring-2 focus-within:ring-success-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  // Label
  label?: string;
  labelClassName?: string;
  required?: boolean;
  
  // Helper/Error text
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Addons
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  
  // Container
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant,
      size,
      label,
      labelClassName,
      required,
      helperText,
      error,
      errorMessage,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      containerClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine the variant based on error prop
    const inputVariant = error ? 'error' : variant;
    
    // Helper text to display (error message takes priority)
    const displayHelperText = error && errorMessage ? errorMessage : helperText;
    
    // If we have icons or addons, we need to wrap the input
    const hasWrapper = leftIcon || rightIcon || leftAddon || rightAddon;
    
    return (
      <div className={cn('w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label className={cn(
            'mb-2 block text-sm font-medium text-neutral-700',
            labelClassName
          )}>
            {label}
            {required && <span className="ml-1 text-danger-500">*</span>}
          </label>
        )}
        
        {/* Input with or without wrapper */}
        {hasWrapper ? (
          <div className={cn(inputWrapperVariants({ variant: inputVariant }))}>
            {/* Left addon */}
            {leftAddon && (
              <div className="flex h-full items-center border-r border-neutral-100 bg-neutral-50 px-3 text-sm text-neutral-600">
                {leftAddon}
              </div>
            )}
            
            {/* Left icon */}
            {leftIcon && (
              <div className="pointer-events-none absolute left-3.5 flex h-full items-center text-neutral-500">
                {leftIcon}
              </div>
            )}
            
            {/* Input field */}
            <input
              type={type}
              className={cn(
                'flex-1 border-0 bg-transparent px-3.5 py-2.5 text-sm font-normal text-neutral-800 placeholder:text-neutral-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                className
              )}
              ref={ref}
              disabled={disabled}
              {...props}
            />
            
            {/* Right icon */}
            {rightIcon && (
              <div className="pointer-events-none absolute right-3.5 flex h-full items-center text-neutral-500">
                {rightIcon}
              </div>
            )}
            
            {/* Right addon */}
            {rightAddon && (
              <div className="flex h-full items-center border-l border-neutral-100 bg-neutral-50 px-3 text-sm text-neutral-600">
                {rightAddon}
              </div>
            )}
          </div>
        ) : (
          <input
            type={type}
            className={cn(inputVariants({ variant: inputVariant, size, className }))}
            ref={ref}
            disabled={disabled}
            {...props}
          />
        )}
        
        {/* Helper text */}
        {displayHelperText && (
          <p className={cn(
            'mt-1.5 text-sm',
            error ? 'text-danger-600' : 'text-neutral-600'
          )}>
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };