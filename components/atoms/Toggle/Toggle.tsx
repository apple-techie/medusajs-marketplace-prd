import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define toggle variants
const toggleVariants = cva(
  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-neutral-200 data-[state=checked]:bg-primary-500',
        error: 'bg-danger-100 data-[state=checked]:bg-danger-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Toggle thumb variants
const toggleThumbVariants = cva(
  'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
  {
    variants: {
      size: {
        default: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Toggle wrapper for label and description
const toggleWrapperVariants = cva(
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

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof toggleVariants> {
  // Label
  label?: React.ReactNode;
  labelClassName?: string;
  labelPosition?: 'left' | 'right';
  
  // Description
  description?: string;
  descriptionClassName?: string;
  
  // Error state
  error?: boolean;
  
  // Container
  containerClassName?: string;
  
  // Controlled state
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      variant,
      label,
      labelClassName,
      labelPosition = 'right',
      description,
      descriptionClassName,
      error,
      containerClassName,
      disabled,
      checked,
      defaultChecked,
      onCheckedChange,
      onChange,
      ...props
    },
    ref
  ) => {
    // Handle controlled/uncontrolled state
    const [isChecked, setIsChecked] = React.useState(defaultChecked ?? false);
    const isControlled = checked !== undefined;
    const currentChecked = isControlled ? checked : isChecked;
    
    // Determine the variant based on error prop
    const toggleVariant = error ? 'error' : variant;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      
      if (!isControlled) {
        setIsChecked(newChecked);
      }
      
      onChange?.(e);
      onCheckedChange?.(newChecked);
    };
    
    // Toggle switch component
    const ToggleSwitch = () => (
      <label
        className={cn(
          toggleVariants({ variant: toggleVariant, className }),
          'relative inline-flex'
        )}
        data-state={currentChecked ? 'checked' : 'unchecked'}
      >
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          disabled={disabled}
          checked={currentChecked}
          onChange={handleChange}
          {...props}
        />
        <span
          className={cn(toggleThumbVariants())}
          data-state={currentChecked ? 'checked' : 'unchecked'}
          aria-hidden="true"
        />
      </label>
    );
    
    // If no label, return just the toggle
    if (!label && !description) {
      return (
        <div className={cn('relative inline-flex', containerClassName)}>
          <ToggleSwitch />
        </div>
      );
    }
    
    // With label/description
    return (
      <div
        className={cn(
          toggleWrapperVariants({ disabled }),
          'items-center',
          containerClassName
        )}
      >
        {labelPosition === 'left' && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                className={cn(
                  'text-sm font-medium leading-5 text-neutral-900',
                  disabled && 'text-neutral-500',
                  labelClassName
                )}
              >
                {label}
              </label>
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
        )}
        
        <ToggleSwitch />
        
        {labelPosition === 'right' && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                className={cn(
                  'text-sm font-medium leading-5 text-neutral-900',
                  disabled && 'text-neutral-500',
                  labelClassName
                )}
              >
                {label}
              </label>
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
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants };