import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// Define select variants (similar to input)
const selectVariants = cva(
  'w-full rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm font-normal text-neutral-800 transition-colors appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
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

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  // Label
  label?: string;
  labelClassName?: string;
  required?: boolean;
  
  // Helper/Error text
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  
  // Options
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  
  // Placeholder
  placeholder?: string;
  
  // Container
  containerClassName?: string;
  
  // Custom icon
  icon?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      size,
      label,
      labelClassName,
      required,
      helperText,
      error,
      errorMessage,
      options = [],
      placeholder = 'Select an option',
      containerClassName,
      disabled,
      icon,
      ...props
    },
    ref
  ) => {
    // Determine the variant based on error prop
    const selectVariant = error ? 'error' : variant;
    
    // Helper text to display (error message takes priority)
    const displayHelperText = error && errorMessage ? errorMessage : helperText;
    
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
        
        {/* Select wrapper */}
        <div className="relative">
          <select
            className={cn(selectVariants({ variant: selectVariant, size, className }))}
            ref={ref}
            disabled={disabled}
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            
            {/* Options */}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Dropdown icon */}
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            {icon || <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
        
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

Select.displayName = 'Select';

// Custom Select with better UI (using Radix UI or similar in production)
export interface CustomSelectProps extends Omit<SelectProps, 'options'> {
  options?: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
}

// For now, export the native select
// In production, you'd want to use a library like Radix UI for better customization
export { Select, selectVariants };