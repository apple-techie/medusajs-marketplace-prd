import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

// Define checkbox variants
const checkboxVariants = cva(
  'peer h-5 w-5 shrink-0 rounded border-2 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 bg-white data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600 data-[state=checked]:text-white',
        error: 'border-danger-500 bg-white data-[state=checked]:border-danger-600 data-[state=checked]:bg-danger-600 data-[state=checked]:text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Checkbox wrapper for better click area
const checkboxWrapperVariants = cva(
  'flex items-start gap-3',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof checkboxVariants> {
  // Label
  label?: React.ReactNode;
  labelClassName?: string;
  
  // Description
  description?: string;
  descriptionClassName?: string;
  
  // Error state
  error?: boolean;
  
  // Indeterminate state
  indeterminate?: boolean;
  
  // Container
  containerClassName?: string;
  
  // Custom check icon
  checkIcon?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      variant,
      label,
      labelClassName,
      description,
      descriptionClassName,
      error,
      indeterminate = false,
      containerClassName,
      checkIcon,
      disabled,
      checked,
      defaultChecked,
      onChange,
      ...props
    },
    ref
  ) => {
    // Use internal state for controlled/uncontrolled behavior
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;
    
    // Determine the variant based on error prop
    const checkboxVariant = error ? 'error' : variant;
    
    // Handle change for both controlled and uncontrolled
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      onChange?.(e);
    };
    
    // Custom checkbox UI
    const CheckboxUI = () => (
      <div
        className={cn(
          checkboxVariants({ variant: checkboxVariant, className }),
          'relative flex items-center justify-center'
        )}
        data-state={isChecked ? 'checked' : 'unchecked'}
        aria-hidden="true"
      >
        {(isChecked || indeterminate) && (
          <span className="flex items-center justify-center text-current">
            {indeterminate ? (
              <div className="h-[2px] w-3 bg-current" />
            ) : (
              checkIcon || <Check className="h-3 w-3" strokeWidth={3} />
            )}
          </span>
        )}
      </div>
    );
    
    // If no label, return just the checkbox
    if (!label && !description) {
      return (
        <div className={cn('relative inline-flex', containerClassName)}>
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />
          <CheckboxUI />
        </div>
      );
    }
    
    // With label/description
    return (
      <label
        className={cn(
          checkboxWrapperVariants({ disabled }),
          containerClassName
        )}
      >
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <CheckboxUI />
        <div className="flex flex-col gap-0.5">
          {label && (
            <span className={cn(
              'text-sm font-medium leading-5 text-neutral-900',
              disabled && 'text-neutral-500',
              labelClassName
            )}>
              {label}
            </span>
          )}
          {description && (
            <span className={cn(
              'text-xs font-normal leading-4 text-neutral-600',
              disabled && 'text-neutral-400',
              descriptionClassName
            )}>
              {description}
            </span>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox, checkboxVariants };