import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const progressBarVariants = cva(
  'relative overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800',
  {
    variants: {
      size: {
        xs: 'h-1',
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
      },
      variant: {
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
);

const progressFillVariants = cva(
  'h-full transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600',
        secondary: 'bg-secondary-600',
        success: 'bg-success-600',
        warning: 'bg-warning-500',
        danger: 'bg-danger-600',
        info: 'bg-info-600',
      },
      animated: {
        true: 'animate-pulse',
        false: '',
      },
      striped: {
        true: 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%] animate-shimmer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      animated: false,
      striped: false,
    },
  }
);

export interface ProgressBarProps extends VariantProps<typeof progressBarVariants> {
  value: number;
  max?: number;
  showValue?: boolean;
  valuePosition?: 'inside' | 'outside' | 'none';
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
  fillClassName?: string;
  'aria-label'?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showValue = true,
  valuePosition = 'none',
  label,
  animated = false,
  striped = false,
  size,
  variant,
  className,
  fillClassName,
  'aria-label': ariaLabel,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const displayValue = `${Math.round(percentage)}%`;

  return (
    <div className="w-full">
      {label && (
        <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
          {label}
        </div>
      )}
      
      {showValue && valuePosition === 'outside' && (
        <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1 text-right">
          {displayValue}
        </div>
      )}
      
      <div
        className={cn(progressBarVariants({ size, variant }), className)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel || label || `Progress: ${displayValue}`}
      >
        <div
          className={cn(
            progressFillVariants({ variant, animated, striped }),
            fillClassName
          )}
          style={{ width: `${percentage}%` }}
        >
          {showValue && valuePosition === 'inside' && percentage > 20 && (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
              {displayValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';