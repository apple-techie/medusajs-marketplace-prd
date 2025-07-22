import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define radio button variants
const radioVariants = cva(
  'h-5 w-5 shrink-0 rounded-full border-2 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 bg-white text-primary-600 data-[state=checked]:border-primary-600',
        error: 'border-danger-500 bg-white text-danger-600 data-[state=checked]:border-danger-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Radio wrapper for better click area
const radioWrapperVariants = cva(
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

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof radioVariants> {
  // Label
  label?: React.ReactNode;
  labelClassName?: string;
  
  // Description
  description?: string;
  descriptionClassName?: string;
  
  // Error state
  error?: boolean;
  
  // Container
  containerClassName?: string;
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      className,
      variant,
      label,
      labelClassName,
      description,
      descriptionClassName,
      error,
      containerClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine the variant based on error prop
    const radioVariant = error ? 'error' : variant;
    
    // Custom radio UI
    const RadioUI = () => (
      <div
        className={cn(
          radioVariants({ variant: radioVariant, className }),
          'relative flex items-center justify-center'
        )}
        aria-hidden="true"
      >
        <div
          className={cn(
            'h-2 w-2 rounded-full bg-current opacity-0 transition-opacity',
            'peer-checked:opacity-100'
          )}
        />
      </div>
    );
    
    // If no label, return just the radio button
    if (!label && !description) {
      return (
        <div className={cn('relative inline-flex', containerClassName)}>
          <input
            type="radio"
            className="peer sr-only"
            ref={ref}
            disabled={disabled}
            {...props}
          />
          <RadioUI />
        </div>
      );
    }
    
    // With label/description
    return (
      <label
        className={cn(
          radioWrapperVariants({ disabled }),
          containerClassName
        )}
      >
        <input
          type="radio"
          className="peer sr-only"
          ref={ref}
          disabled={disabled}
          {...props}
        />
        <div
          className={cn(
            radioVariants({ variant: radioVariant, className }),
            'relative flex items-center justify-center'
          )}
          data-state={props.checked ? 'checked' : 'unchecked'}
        >
          <div
            className={cn(
              'h-2 w-2 rounded-full bg-current opacity-0 transition-opacity',
              'peer-checked:opacity-100'
            )}
          />
        </div>
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

RadioButton.displayName = 'RadioButton';

// Radio Group component for managing multiple radio buttons
export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      defaultValue,
      onChange,
      children,
      className,
      orientation = 'vertical',
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue || '');
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : selectedValue;

    const handleChange = (newValue: string) => {
      if (!isControlled) {
        setSelectedValue(newValue);
      }
      onChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col space-y-3' : 'flex-row space-x-6',
          className
        )}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === RadioButton) {
            return React.cloneElement(child as React.ReactElement<RadioButtonProps>, {
              name,
              checked: currentValue === child.props.value,
              onChange: () => handleChange(child.props.value as string),
            });
          }
          return child;
        })}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export { RadioButton, radioVariants };