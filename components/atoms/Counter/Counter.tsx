import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define counter variants
const counterVariants = cva(
  'inline-flex items-center justify-center rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100',
        outline: 'border border-neutral-300 bg-transparent',
        primary: 'bg-primary-50',
      },
      size: {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Button variants for increment/decrement
const counterButtonVariants = cva(
  'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Display variants
const counterDisplayVariants = cva(
  'inline-flex items-center justify-center font-semibold text-neutral-900',
  {
    variants: {
      size: {
        sm: 'min-w-[32px] px-2 text-xs',
        md: 'min-w-[40px] px-3 text-sm',
        lg: 'min-w-[48px] px-4 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface CounterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof counterVariants> {
  // Value
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  
  // Constraints
  min?: number;
  max?: number;
  step?: number;
  
  // Display
  disabled?: boolean;
  readOnly?: boolean;
  
  // Formatting
  formatValue?: (value: number) => string;
  
  // Accessibility
  label?: string;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
}

const Counter = forwardRef<HTMLDivElement, CounterProps>(
  (
    {
      className,
      variant,
      size,
      value: controlledValue,
      defaultValue = 0,
      onChange,
      min = 0,
      max = 999,
      step = 1,
      disabled = false,
      readOnly = false,
      formatValue,
      label,
      decrementAriaLabel = 'Decrease value',
      incrementAriaLabel = 'Increase value',
      ...props
    },
    ref
  ) => {
    // State management
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    
    // Update handler
    const updateValue = (newValue: number) => {
      // Clamp value between min and max
      const clampedValue = Math.max(min, Math.min(max, newValue));
      
      if (!isControlled) {
        setUncontrolledValue(clampedValue);
      }
      
      onChange?.(clampedValue);
    };
    
    // Handlers
    const handleDecrement = () => {
      if (!disabled && !readOnly) {
        updateValue(value - step);
      }
    };
    
    const handleIncrement = () => {
      if (!disabled && !readOnly) {
        updateValue(value + step);
      }
    };
    
    // Keyboard handler
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled || readOnly) return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleIncrement();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleDecrement();
          break;
        case 'Home':
          e.preventDefault();
          updateValue(min);
          break;
        case 'End':
          e.preventDefault();
          updateValue(max);
          break;
      }
    };
    
    // Format display value
    const displayValue = formatValue ? formatValue(value) : value.toString();
    
    // Determine if buttons should be disabled
    const decrementDisabled = disabled || readOnly || value <= min;
    const incrementDisabled = disabled || readOnly || value >= max;
    
    return (
      <div
        ref={ref}
        className={cn(counterVariants({ variant, size, className }))}
        role="group"
        aria-label={label || 'Counter'}
        onKeyDown={handleKeyDown}
        tabIndex={disabled || readOnly ? -1 : 0}
        {...props}
      >
        <button
          type="button"
          className={cn(
            counterButtonVariants({ size }),
            'rounded-l-lg hover:bg-black/5 active:bg-black/10',
            variant === 'primary' && 'hover:bg-primary-100 active:bg-primary-200'
          )}
          onClick={handleDecrement}
          disabled={decrementDisabled}
          aria-label={decrementAriaLabel}
          tabIndex={-1}
        >
          <svg
            className={cn(
              'shrink-0',
              size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
        
        <div
          className={cn(counterDisplayVariants({ size }))}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {displayValue}
        </div>
        
        <button
          type="button"
          className={cn(
            counterButtonVariants({ size }),
            'rounded-r-lg hover:bg-black/5 active:bg-black/10',
            variant === 'primary' && 'hover:bg-primary-100 active:bg-primary-200'
          )}
          onClick={handleIncrement}
          disabled={incrementDisabled}
          aria-label={incrementAriaLabel}
          tabIndex={-1}
        >
          <svg
            className={cn(
              'shrink-0',
              size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    );
  }
);

Counter.displayName = 'Counter';

export { Counter, counterVariants };